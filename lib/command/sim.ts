import { carriers, customers, drivers, operators, siteById, siteIds, sites, stagedPallets } from "./data";
import { distance, dockInsidePoint, dockWorkPoint, layouts, phaseSeconds, queueU } from "./layout";
import type {
  Carrier,
  Dock,
  EventId,
  Forklift,
  GameEvent,
  GameProgress,
  OrderRequest,
  Selection,
  Shipment,
  SiteId,
  Truck,
  Vec2,
  World,
} from "./types";

/** One real second is this many simulated seconds (a minute). */
export const SIM_SCALE = 60;
export const SHIFT_START = 6 * 3600;
export const SHIFT_HOURS = 8;
export const ORDER_SECONDS = 16;
export const EVENT_SECONDS = 20;
const FORKLIFT_SPEED = 3.4;
const HANDLE_SECONDS = 0.8;
const BATTERY_PER_PALLET = 2.4;
const LOW_BATTERY = 14;
const CHARGE_PER_SECOND = 8;
const MAX_ORDERS = 3;

export const defaultProgress: GameProgress = {
  shift: 1,
  credits: 0,
  bestScore: 0,
  stars: 0,
  upgrades: { docks: {}, forklifts: {}, fastCharge: false, coldRoom: false },
};

export const UPGRADE_COST = { dock: 800, forklift: 400, fastCharge: 300, coldRoom: 500 } as const;

// ---------- random numbers (seeded, stored in the world) ----------

function rand(w: World) {
  w.rng = (w.rng + 0x6d2b79f5) >>> 0;
  let t = w.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const between = (w: World, a: number, b: number) => a + rand(w) * (b - a);
const pick = <T>(w: World, list: readonly T[]) => list[Math.floor(rand(w) * list.length)];

function nextId(w: World) {
  return ++w.seq;
}

export function fmtClock(sec: number) {
  const s = Math.max(0, Math.floor(sec)) % 86400;
  return `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}`;
}

function notify(w: World, text: string, tone: "info" | "good" | "warn" = "info") {
  w.notifications.unshift({ id: `N${nextId(w)}`, at: w.clock, tone, text });
  if (w.notifications.length > 30) w.notifications.length = 30;
}

// ---------- world creation ----------

export function dockCount(w: Pick<World, "progress">, site: SiteId) {
  const def = siteById[site];
  return Math.min(def.docks + def.spareDocks, def.docks + (w.progress.upgrades.docks[site] ?? 0));
}

function dockLabel(site: SiteId, i: number) {
  if (siteById[site].type === "crossdock") return i < 2 ? `In ${i + 1}` : `Out ${i - 1}`;
  return `Bay ${i + 1}`;
}

export function createWorld(seed = 7, progress: GameProgress = defaultProgress): World {
  const w: World = {
    clock: SHIFT_START,
    shiftStart: SHIFT_START,
    shiftEnd: SHIFT_START + SHIFT_HOURS * 3600,
    speed: 1,
    view: "site",
    activeSite: "SE-01",
    selection: { kind: "site", id: "SE-01" },
    focusNonce: 0,
    autopilot: true,
    docks: {},
    trucks: {},
    forklifts: {},
    chargers: {},
    shipments: {},
    pallets: {},
    stock: {} as World["stock"],
    stockAtStart: {} as World["stockAtStart"],
    outboundToday: {} as World["outboundToday"],
    putawaysToday: {} as World["putawaysToday"],
    orders: [],
    event: null,
    notifications: [],
    stats: { score: 0, delivered: 0, onTime: 0, late: 0, lost: 0, combo: 0, eventsHandled: 0 },
    progress: structuredClone(progress),
    modifiers: { slowForklifts: 0, portDelay: 0, surge: 0 },
    timers: { nextOrder: 6, nextEvent: 45, nextInbound: {} as World["timers"]["nextInbound"] },
    shiftOver: false,
    rng: seed >>> 0,
    seq: 2050,
  };

  let fl = 0;
  for (const def of sites) {
    const l = layouts[def.id];
    for (let i = 0; i < dockCount(w, def.id); i++) {
      const id = `${def.id}-D${i + 1}`;
      w.docks[id] = { id, site: def.id, index: i, label: dockLabel(def.id, i), status: "available", truck: null, outUntil: null };
    }
    for (let i = 0; i < def.chargers; i++) {
      const id = `${def.id}-C${i + 1}`;
      w.chargers[id] = { id, site: def.id, forklift: null, sessions: Math.floor(between(w, 2, 9)), energyKwh: Math.round(between(w, 12, 48)) };
    }
    const forklifts = def.forklifts + (w.progress.upgrades.forklifts[def.id] ?? 0);
    for (let i = 0; i < forklifts; i++) {
      fl++;
      const id = `FL-${String(fl).padStart(2, "0")}`;
      const [operator, model] = operators[(fl - 1) % operators.length];
      const home = l.forkliftHome[i % l.forkliftHome.length];
      w.forklifts[id] = {
        id, site: def.id, operator, model, status: "idle", battery: Math.round(between(w, 55, 96)),
        dock: null, charger: null, carrying: false, moves: Math.floor(between(w, 8, 30)),
        from: [...home], to: [...home], t: 1, legSeconds: 1, leg: "travel", home: [...home], brokenUntil: null,
      };
    }
    const cap = def.capacity * (def.type === "cold" && w.progress.upgrades.coldRoom ? 1.25 : 1);
    w.stock[def.id] = Object.fromEntries(def.skus.map((s) => [s.id, Math.round((cap / def.skus.length) * between(w, 0.45, 0.8))]));
    w.stockAtStart[def.id] = Object.values(w.stock[def.id]).reduce((a, b) => a + b, 0);
    w.outboundToday[def.id] = 0;
    w.putawaysToday[def.id] = 0;
    w.timers.nextInbound[def.id] = between(w, 1, 12);

    stagedPallets[def.id].forEach((p, i) => {
      const id = `PAL-${def.id.slice(0, 2)}${String(i + 1).padStart(2, "0")}`;
      w.pallets[id] = {
        id, site: def.id, sku: p.sku, quantity: p.quantity, weightKg: p.weightKg, lot: p.lot,
        location: `${def.id} · Yard slot S${String(i + 1).padStart(2, "0")}`, received: "Today, 05:4" + i,
        slot: l.staging[i * 2 + 1],
      };
    });
  }

  // A couple of trucks already working when the shift opens, so the yard is alive.
  for (const id of siteIds) {
    spawnTruck(w, id, "inbound", { eta: between(w, 1, 6) * 60 });
  }
  spawnTruck(w, "SE-01", "outbound", { eta: 30 });
  return w;
}

// ---------- trucks and shipments ----------

function capacityOf(w: World, site: SiteId) {
  const def = siteById[site];
  return Math.round(def.capacity * (def.type === "cold" && w.progress.upgrades.coldRoom ? 1.25 : 1));
}

export function stockOnHand(w: World, site: SiteId) {
  return Object.values(w.stock[site]).reduce((a, b) => a + b, 0);
}

function spawnTruck(
  w: World,
  site: SiteId,
  direction: "inbound" | "outbound",
  opts: { eta?: number; carrier?: Carrier; sku?: string; pallets?: number; customer?: string; destination?: string; promised?: number; rush?: boolean } = {}
): Truck {
  const def = siteById[site];
  const sku =
    opts.sku ??
    (direction === "inbound"
      ? [...def.skus].sort((a, b) => w.stock[site][a.id] / a.lowAt - w.stock[site][b.id] / b.lowAt)[0].id
      : pick(w, def.skus).id);
  const pallets = opts.pallets ?? Math.round(between(w, 4, 8));
  const eta = (opts.eta ?? between(w, 8, 22) * 60) + (direction === "inbound" ? w.modifiers.portDelay > 0 && site === "NL-01" ? 45 * 60 : 0 : 0);
  const carrier = opts.carrier ?? (rand(w) < 0.4 ? "house" : pick(w, ["nordline", "cargovia", "bluepeak"] as const));
  const n = nextId(w);
  const truckId = `TRK-${n}`;
  const shipmentId = `SHP-${78400 + n}`;
  const customer = opts.customer ?? (direction === "inbound" ? def.inboundFrom : pick(w, customers).name);
  const destination = opts.destination ?? (direction === "inbound" ? `${site} ${def.name}` : pick(w, customers).destination);
  const shipment: Shipment = {
    id: shipmentId, site, truck: truckId, direction, customer, destination, sku, pallets,
    rush: !!opts.rush,
    times: { confirmed: w.clock - between(w, 40, 90) * 60, picked: w.clock - between(w, 10, 35) * 60 },
    promised: opts.promised ?? w.clock + eta + 70 * 60,
    deliverAt: null,
    status: "open",
  };
  if (direction === "outbound") shipment.times = { confirmed: w.clock };
  const truck: Truck = {
    id: truckId, site, carrier, driver: pick(w, drivers),
    plate: `${pick(w, ["SKN", "HH", "RTM", "GD", "MI"] as const)}-${Math.floor(between(w, 100, 999))}`,
    direction, phase: "enroute", eta, etaTotal: eta, dock: null, t: 0, pallets, done: 0, sku, shipment: shipmentId, queuedAt: null,
  };
  w.trucks[truckId] = truck;
  w.shipments[shipmentId] = shipment;
  return truck;
}

/** One truck manoeuvres in a yard at a time, so paths never cross. */
function yardClear(w: World, site: SiteId) {
  return !Object.values(w.trucks).some((t) => t.site === site && (t.phase === "arriving" || t.phase === "reversing"));
}

function freeDock(w: World, site: SiteId): Dock | null {
  if (!yardClear(w, site)) return null;
  return Object.values(w.docks).find((d) => d.site === site && d.status === "available") ?? null;
}

export function gateQueue(w: World, site: SiteId) {
  return Object.values(w.trucks)
    .filter((t) => t.site === site && t.phase === "atGate")
    .sort((a, b) => (a.queuedAt ?? 0) - (b.queuedAt ?? 0));
}

function assignDock(w: World, truck: Truck, dock: Dock) {
  const queued = truck.phase === "atGate" ? gateQueue(w, truck.site).findIndex((t) => t.id === truck.id) : -1;
  dock.status = "busy";
  dock.truck = truck.id;
  truck.dock = dock.id;
  truck.phase = "arriving";
  truck.t = queued >= 0 ? queueU(truck.site, dock.index, queued) : 0;
  truck.queuedAt = null;
}

function dockIndex(w: World, truck: Truck) {
  return truck.dock ? w.docks[truck.dock].index : 0;
}

// ---------- forklifts ----------

function startLeg(f: Forklift, to: Vec2, leg: Forklift["leg"], slow: boolean) {
  f.from = currentPos(f);
  f.to = to;
  f.t = 0;
  f.leg = leg;
  f.legSeconds = Math.max(0.6, distance(f.from, to) / (FORKLIFT_SPEED * (slow ? 0.6 : 1))) + (leg === "travel" ? 0 : HANDLE_SECONDS);
}

export function currentPos(f: Forklift): Vec2 {
  const t = Math.min(1, f.t);
  return [f.from[0] + (f.to[0] - f.from[0]) * t, f.from[1] + (f.to[1] - f.from[1]) * t];
}


function sendHome(w: World, f: Forklift) {
  f.status = "idle";
  f.dock = null;
  f.carrying = false;
  startLeg(f, f.home, "travel", false);
}

function freeCharger(w: World, site: SiteId) {
  return Object.values(w.chargers).find((c) => c.site === site && !c.forklift) ?? null;
}

function goCharge(w: World, f: Forklift) {
  const c = freeCharger(w, f.site);
  if (!c) return false;
  c.forklift = f.id;
  f.charger = c.id;
  f.status = "toCharger";
  f.dock = null;
  f.carrying = false;
  const i = Number(c.id.split("-C")[1]) - 1;
  const p = layouts[f.site].chargers[i];
  startLeg(f, [p[0] - 1.6, p[1]], "travel", false);
  return true;
}

function assignForklift(w: World, f: Forklift, dock: Dock) {
  const truck = dock.truck ? w.trucks[dock.truck] : null;
  if (!truck || truck.phase !== "docked") return false;
  if (f.charger) w.chargers[f.charger].forklift = null;
  f.charger = null;
  f.status = "working";
  f.dock = dock.id;
  const work = dockWorkPoint(f.site, dock.index);
  const pickup = truck.direction === "inbound" ? work : dockInsidePoint(f.site, dock.index, f.moves);
  startLeg(f, pickup, "pick", w.modifiers.slowForklifts > 0);
  return true;
}

function forkliftsAt(w: World, dockId: string) {
  return Object.values(w.forklifts).filter((f) => f.dock === dockId && f.status === "working");
}

function tickForklift(w: World, f: Forklift, dt: number) {
  if (f.status === "broken") {
    if (f.brokenUntil !== null && w.clock >= f.brokenUntil) {
      f.brokenUntil = null;
      notify(w, `${f.id} is back in service`, "good");
      sendHome(w, f);
    }
    return;
  }
  if (f.status === "charging") {
    const rate = CHARGE_PER_SECOND * (w.progress.upgrades.fastCharge ? 1.5 : 1);
    f.battery = Math.min(100, f.battery + rate * dt);
    if (f.charger) w.chargers[f.charger].energyKwh += 0.05 * rate * dt;
    if (f.battery >= 95) {
      if (f.charger) {
        w.chargers[f.charger].forklift = null;
        w.chargers[f.charger].sessions++;
      }
      f.charger = null;
      sendHome(w, f);
    }
    return;
  }

  if (f.t < 1) {
    f.t = Math.min(1, f.t + dt / f.legSeconds);
    if (f.t < 1) return;
  }

  // Arrived at the end of a leg.
  if (f.status === "toCharger") {
    f.status = "charging";
    return;
  }
  if (f.status === "idle") {
    if (w.autopilot && f.battery < 30) goCharge(w, f);
    return;
  }
  if (f.status !== "working" || !f.dock) return;

  const dock = w.docks[f.dock];
  const truck = dock.truck ? w.trucks[dock.truck] : null;
  if (!truck || truck.phase !== "docked") return sendHome(w, f);

  const work = dockWorkPoint(f.site, dock.index);
  const slow = w.modifiers.slowForklifts > 0;
  const staging = dockInsidePoint(f.site, dock.index, f.moves);
  const claimed = forkliftsAt(w, dock.id).filter((x) => x.carrying).length;

  if (f.leg === "pick") {
    if (truck.done + claimed >= truck.pallets) return sendHome(w, f);
    if (truck.direction === "outbound" && w.stock[truck.site][truck.sku] <= 0) {
      // Nothing to load: wait at the staging lane.
      f.t = 0.85;
      return;
    }
    f.carrying = true;
    if (truck.direction === "outbound") w.stock[truck.site][truck.sku]--;
    startLeg(f, truck.direction === "inbound" ? staging : work, "drop", slow);
    return;
  }

  if (f.leg === "drop") {
    f.carrying = false;
    f.moves++;
    f.battery = Math.max(0, f.battery - BATTERY_PER_PALLET);
    truck.done = Math.min(truck.pallets, truck.done + 1);
    if (truck.direction === "inbound") {
      w.stock[truck.site][truck.sku]++;
      w.putawaysToday[truck.site]++;
    }
    if (f.battery < LOW_BATTERY) {
      notify(w, `${f.id} battery at ${Math.round(f.battery)}%, heading to charge`, "warn");
      if (!goCharge(w, f)) sendHome(w, f);
      return;
    }
    if (truck.done >= truck.pallets) return sendHome(w, f);
    startLeg(f, truck.direction === "inbound" ? work : staging, "pick", slow);
  }
}

// ---------- scoring ----------

function deliver(w: World, s: Shipment) {
  const onTime = w.clock <= s.promised;
  s.status = onTime ? "onTime" : "late";
  s.times.delivered = w.clock;
  w.stats.delivered++;
  const base = s.pallets * 25;
  if (onTime) {
    w.stats.onTime++;
    w.stats.combo++;
    const combo = Math.min(2, 1 + 0.1 * (w.stats.combo - 1));
    const points = Math.round(base * (s.rush ? 2 : 1) * combo * (w.autopilot ? 1 : 1.25));
    w.stats.score += points;
    notify(w, `${s.id} delivered on time to ${s.customer} · +${points}`, "good");
  } else {
    w.stats.late++;
    w.stats.combo = 0;
    const points = Math.round(base * 0.3);
    w.stats.score += points;
    notify(w, `${s.id} delivered late to ${s.customer} · +${points}`, "warn");
  }
}

// ---------- the main tick ----------

export function tick(w: World, dtReal: number) {
  if (w.shiftOver || w.speed === 0) return;
  const dt = Math.min(dtReal, 0.25) * w.speed;
  const dSim = dt * SIM_SCALE;
  w.clock += dSim;
  w.modifiers.slowForklifts = Math.max(0, w.modifiers.slowForklifts - dSim);
  w.modifiers.portDelay = Math.max(0, w.modifiers.portDelay - dSim);

  for (const d of Object.values(w.docks)) {
    if (d.status === "out" && d.outUntil !== null && w.clock >= d.outUntil) {
      d.status = d.truck ? "busy" : "available";
      d.outUntil = null;
      notify(w, `${d.site} ${d.label} back in service`, "good");
    }
  }

  for (const truck of Object.values(w.trucks)) tickTruck(w, truck, dt, dSim);
  for (const f of Object.values(w.forklifts)) tickForklift(w, f, dt);

  // Autopilot: idle forklifts pick up docked trucks that need hands.
  if (w.autopilot) {
    for (const dock of Object.values(w.docks)) {
      const truck = dock.truck ? w.trucks[dock.truck] : null;
      if (!truck || truck.phase !== "docked") continue;
      const working = forkliftsAt(w, dock.id).length;
      const remaining = truck.pallets - truck.done;
      if (working >= Math.min(2, remaining)) continue;
      const idle = Object.values(w.forklifts)
        .filter((f) => f.site === dock.site && f.status === "idle" && f.battery >= 25)
        .sort((a, b) => distance(currentPos(a), dockWorkPoint(dock.site, dock.index)) - distance(currentPos(b), dockWorkPoint(dock.site, dock.index)))[0];
      if (idle) assignForklift(w, idle, dock);
    }
  }

  // Inbound replenishment keeps every yard busy.
  for (const site of siteIds) {
    w.timers.nextInbound[site] -= dt;
    if (w.timers.nextInbound[site] <= 0) {
      const live = Object.values(w.trucks).filter((t) => t.site === site && t.phase !== "gone").length;
      if (live < dockCount(w, site) + 1) spawnTruck(w, site, "inbound");
      w.timers.nextInbound[site] = between(w, 20, 40);
    }
  }

  // Orders.
  w.timers.nextOrder -= dt;
  if (w.timers.nextOrder <= 0) {
    if (w.orders.length < MAX_ORDERS) spawnOrder(w);
    w.timers.nextOrder = w.modifiers.surge > 0 ? between(w, 4, 7) : between(w, 14, 24);
    if (w.modifiers.surge > 0) w.modifiers.surge--;
  }
  for (const o of w.orders) o.timeLeft -= dt;
  for (const o of w.orders.filter((x) => x.timeLeft <= 0)) {
    w.stats.lost++;
    w.stats.combo = 0;
    w.stats.score = Math.max(0, w.stats.score - 30);
    notify(w, `Order from ${o.customer} expired · −30`, "warn");
  }
  w.orders = w.orders.filter((o) => o.timeLeft > 0);

  // Events.
  if (w.event) {
    w.event.timeLeft -= dt;
    if (w.event.timeLeft <= 0) chooseEvent(w, 1);
  } else {
    w.timers.nextEvent -= dt;
    if (w.timers.nextEvent <= 0) {
      spawnEvent(w);
      w.timers.nextEvent = between(w, 45, 70);
    }
  }

  if (w.clock >= w.shiftEnd) endShift(w);
}

function tickTruck(w: World, truck: Truck, dt: number, dSim: number) {
  switch (truck.phase) {
    case "enroute": {
      truck.eta -= dSim;
      if (truck.eta <= 0) {
        truck.eta = 0;
        const dock = w.autopilot ? freeDock(w, truck.site) : null;
        if (dock) assignDock(w, truck, dock);
        else {
          truck.phase = "atGate";
          truck.queuedAt = w.clock;
          if (!w.autopilot) notify(w, `${truck.id} waiting at the ${truck.site} gate`, "warn");
        }
      }
      break;
    }
    case "atGate": {
      if (w.autopilot) {
        const queue = gateQueue(w, truck.site);
        const dock = queue[0]?.id === truck.id ? freeDock(w, truck.site) : null;
        if (dock) assignDock(w, truck, dock);
      }
      break;
    }
    case "arriving":
    case "reversing": {
      truck.t += dt / phaseSeconds(truck.site, dockIndex(w, truck), truck.phase);
      if (truck.t >= 1) {
        truck.t = 0;
        if (truck.phase === "arriving") truck.phase = "reversing";
        else {
          truck.phase = "docked";
          const s = w.shipments[truck.shipment];
          s.times[truck.direction === "inbound" ? "unloading" : "loading"] = w.clock;
          if (truck.direction === "inbound") {
            const onTime = w.clock <= s.promised;
            s.status = onTime ? "onTime" : "late";
            if (onTime) w.stats.score += truck.pallets * 5;
          }
        }
      }
      break;
    }
    case "docked": {
      if (truck.done >= truck.pallets) {
        const dock = truck.dock ? w.docks[truck.dock] : null;
        truck.phase = "departing";
        truck.t = 0;
        const s = w.shipments[truck.shipment];
        if (truck.direction === "outbound") {
          s.times.transit = w.clock;
          s.deliverAt = w.clock + between(w, 25, 60) * 60;
          w.outboundToday[truck.site]++;
        } else {
          s.times.delivered = w.clock;
        }
        if (dock) {
          dock.truck = null;
          if (dock.status === "busy") dock.status = "available";
        }
      }
      break;
    }
    case "departing": {
      // Keep the dock index for the path even though the dock is released.
      truck.t += dt / phaseSeconds(truck.site, dockIndex(w, truck), "departing");
      if (truck.t >= 1) {
        truck.phase = "gone";
        truck.t = 1;
      }
      break;
    }
    case "gone": {
      const s = w.shipments[truck.shipment];
      if (s.direction === "outbound" && s.status === "open" && s.deliverAt !== null && w.clock >= s.deliverAt) deliver(w, s);
      if (s.status !== "open" || s.direction === "inbound") delete w.trucks[truck.id];
      break;
    }
  }
}

// ---------- orders ----------

function spawnOrder(w: World) {
  const site = rand(w) < 0.5 ? w.activeSite : pick(w, siteIds);
  const def = siteById[site];
  const c = pick(w, customers);
  const sku = pick(w, def.skus).id;
  const pallets = Math.round(between(w, 3, 7));
  const order: OrderRequest = {
    id: `ORD-${nextId(w)}`, site, customer: c.name, destination: c.destination, sku, pallets,
    timeLeft: ORDER_SECONDS, points: pallets * 25,
  };
  w.orders.push(order);
}

export function respondOrder(w: World, orderId: string, answer: "accept" | "rush" | "decline") {
  const order = w.orders.find((o) => o.id === orderId);
  if (!order) return;
  w.orders = w.orders.filter((o) => o.id !== orderId);
  if (answer === "decline") {
    w.stats.combo = 0;
    return;
  }
  const rush = answer === "rush";
  const truck = spawnTruck(w, order.site, "outbound", {
    eta: between(w, 4, 10) * 60,
    sku: order.sku,
    pallets: order.pallets,
    customer: order.customer,
    destination: order.destination,
    promised: w.clock + (rush ? 100 : 150) * 60,
    rush,
  });
  notify(w, `${rush ? "Rush order" : "Order"} accepted · ${truck.id} dispatched to ${order.site}`, "info");
}

// ---------- events ----------

const eventKinds: EventId[] = ["dockFault", "forkliftBreakdown", "spill", "lateTruck", "orderSurge", "lowStock", "portDelay"];

function spawnEvent(w: World) {
  const site = w.activeSite;
  const def = siteById[site];
  const kind = pick(w, eventKinds.filter((k) => k !== "portDelay" || site === "NL-01" || rand(w) < 0.3));
  const id = `EVT-${nextId(w)}`;
  const docks = Object.values(w.docks).filter((d) => d.site === site && d.status !== "out");
  const lifts = Object.values(w.forklifts).filter((f) => f.site === site && f.status !== "broken");
  const inbound = Object.values(w.trucks).filter((t) => t.site === site && t.direction === "inbound" && t.phase === "enroute");
  const low = [...def.skus].sort((a, b) => w.stock[site][a.id] / a.lowAt - w.stock[site][b.id] / b.lowAt)[0];
  const ev = (title: string, body: string, a: [string, string, number], b: [string, string, number], target: Selection | null): GameEvent => ({
    id, kind, site, title, body, timeLeft: EVENT_SECONDS, target,
    options: [{ label: a[0], detail: a[1], cost: a[2] }, { label: b[0], detail: b[1], cost: b[2] }],
  });

  let e: GameEvent | null = null;
  if (kind === "dockFault" && docks.length) {
    const d = pick(w, docks);
    e = ev(`${d.label} door jammed`, `The dock leveller at ${def.name} ${d.label} is stuck.`, ["Call technician", "Fixed in 20 min", 150], ["Work around", "Bay out for 90 min", 0], { kind: "dock", id: d.id });
  } else if (kind === "forkliftBreakdown" && lifts.length) {
    const f = pick(w, lifts);
    e = ev(`${f.id} hydraulic fault`, `${f.operator}'s forklift lost mast pressure.`, ["Rush repair", "Back in 15 min", 100], ["Wait for service", "Out for 60 min", 0], { kind: "forklift", id: f.id });
  } else if (kind === "spill") {
    e = ev("Spill on the apron", `A pallet of ${low.name.toLowerCase()} split near the docks.`, ["Clean it now", "Forklifts pause 10 min", 0], ["Work around it", "Forklifts slower for 40 min", 0], { kind: "site", id: site });
  } else if (kind === "lateTruck" && inbound.length) {
    const t = pick(w, inbound);
    e = ev(`${t.id} running late`, `${carriers[t.carrier].name} reports traffic on the E20.`, ["Pay to expedite", "−20 min ETA", 120], ["Accept the delay", "+45 min ETA", 0], { kind: "truck", id: t.id });
  } else if (kind === "orderSurge") {
    e = ev("Order surge incoming", "A promotion went live. Expect a burst of requests.", ["Bring in the team", "Next 4 orders come fast, +20% points", 0], ["Stay steady", "Nothing changes", 0], null);
  } else if (kind === "lowStock") {
    e = ev(`${low.name} running low`, `${def.name} has ${w.stock[site][low.id]} pallets left.`, ["Transfer from network", "Inbound truck in 15 min", 80], ["Ride it out", "Orders may run late", 0], { kind: "site", id: site });
  } else if (kind === "portDelay") {
    e = ev("Port congestion at Rotterdam", "Vessel berthing slipped a tide; inbound from Asia is delayed.", ["Reroute via Hamburg", "Avoid the delay", 200], ["Accept the delay", "NL-01 inbound +45 min for 2 h", 0], { kind: "site", id: "NL-01" });
  }
  if (!e) e = ev("Quiet moment", "Everything is flowing. Take a breath.", ["Tidy the yard", "+20 points", 0], ["Carry on", "Nothing changes", 0], null);
  w.event = e;
}

export function chooseEvent(w: World, option: 0 | 1) {
  const e = w.event;
  if (!e) return;
  w.event = null;
  if (option === 0 && e.options[0].cost > w.progress.credits) {
    notify(w, `Not enough credits for "${e.options[0].label}", working around it`, "warn");
    option = 1;
  }
  const opt = e.options[option];
  w.progress.credits = Math.max(0, w.progress.credits - opt.cost);
  w.stats.eventsHandled++;
  w.stats.score += option === 0 ? 20 : 0;

  const target = e.target;
  if (e.kind === "dockFault" && target?.kind === "dock") {
    const d = w.docks[target.id];
    d.status = "out";
    d.outUntil = w.clock + (option === 0 ? 20 : 90) * 60;
  } else if (e.kind === "forkliftBreakdown" && target?.kind === "forklift") {
    const f = w.forklifts[target.id];
    if (f.charger) w.chargers[f.charger].forklift = null;
    f.charger = null;
    f.status = "broken";
    f.dock = null;
    f.carrying = false;
    f.brokenUntil = w.clock + (option === 0 ? 15 : 60) * 60;
  } else if (e.kind === "spill") {
    if (option === 0) {
      for (const f of Object.values(w.forklifts)) if (f.site === e.site && f.status === "working") f.t = Math.max(0, f.t - 0.5);
      w.modifiers.slowForklifts = 10 * 60;
    } else w.modifiers.slowForklifts = 40 * 60;
  } else if (e.kind === "lateTruck" && target?.kind === "truck") {
    const t = w.trucks[target.id];
    if (t) t.eta = Math.max(60, t.eta + (option === 0 ? -20 : 45) * 60);
  } else if (e.kind === "orderSurge" && option === 0) {
    w.modifiers.surge = 4;
    w.timers.nextOrder = 2;
  } else if (e.kind === "lowStock" && option === 0) {
    const def = siteById[e.site];
    const low = [...def.skus].sort((a, b) => w.stock[e.site][a.id] / a.lowAt - w.stock[e.site][b.id] / b.lowAt)[0];
    spawnTruck(w, e.site, "inbound", { eta: 15 * 60, sku: low.id, pallets: 8, carrier: "house" });
  } else if (e.kind === "portDelay" && option === 1) {
    w.modifiers.portDelay = 120 * 60;
    for (const t of Object.values(w.trucks)) if (t.site === "NL-01" && t.phase === "enroute" && t.direction === "inbound") t.eta += 45 * 60;
  }
}

// ---------- operator actions ----------

export function sendTruckToDock(w: World, truckId: string, dockId: string) {
  const truck = w.trucks[truckId];
  const dock = w.docks[dockId];
  if (!truck || !dock || dock.site !== truck.site || dock.status !== "available") return false;
  if (truck.phase !== "atGate" && truck.phase !== "enroute") return false;
  if (truck.phase === "enroute") {
    truck.eta = Math.min(truck.eta, 60);
    return false;
  }
  assignDock(w, truck, dock);
  return true;
}

export function assignForkliftToDock(w: World, forkliftId: string, dockId: string) {
  const f = w.forklifts[forkliftId];
  const dock = w.docks[dockId];
  if (!f || !dock || f.status === "broken" || f.battery < 10) return false;
  return assignForklift(w, f, dock);
}

export function sendForkliftToCharge(w: World, forkliftId: string) {
  const f = w.forklifts[forkliftId];
  if (!f || f.status === "charging" || f.status === "toCharger" || f.status === "broken") return false;
  return goCharge(w, f);
}

export function toggleDockService(w: World, dockId: string) {
  const d = w.docks[dockId];
  if (!d) return;
  if (d.status === "out") {
    d.status = d.truck ? "busy" : "available";
    d.outUntil = null;
  } else if (!d.truck) {
    d.status = "out";
    d.outUntil = null;
  }
}

export function buyUpgrade(w: World, kind: keyof typeof UPGRADE_COST, site: SiteId) {
  const cost = UPGRADE_COST[kind];
  if (w.progress.credits < cost) return false;
  const u = w.progress.upgrades;
  if (kind === "dock") {
    const def = siteById[site];
    if ((u.docks[site] ?? 0) >= def.spareDocks) return false;
    u.docks[site] = (u.docks[site] ?? 0) + 1;
  } else if (kind === "forklift") {
    if ((u.forklifts[site] ?? 0) >= 2) return false;
    u.forklifts[site] = (u.forklifts[site] ?? 0) + 1;
  } else if (kind === "fastCharge") {
    if (u.fastCharge) return false;
    u.fastCharge = true;
  } else {
    if (u.coldRoom) return false;
    u.coldRoom = true;
  }
  w.progress.credits -= cost;
  return true;
}

// ---------- shifts ----------

export function shiftStars(stats: World["stats"]) {
  const rate = stats.delivered ? stats.onTime / stats.delivered : 0;
  if (stats.delivered >= 3 && rate >= 0.95 && stats.score >= 3000) return 3;
  if (stats.delivered >= 2 && rate >= 0.9 && stats.score >= 1500) return 2;
  if (stats.delivered >= 1 && rate >= 0.8) return 1;
  return 0;
}

function endShift(w: World) {
  w.shiftOver = true;
  w.speed = 0;
  w.orders = [];
  w.event = null;
  const stars = shiftStars(w.stats);
  w.progress.credits += Math.floor(w.stats.score / 10);
  w.progress.bestScore = Math.max(w.progress.bestScore, w.stats.score);
  w.progress.stars += stars;
  notify(w, `Shift ${w.progress.shift} complete · ${w.stats.score} points · ${stars}★`, "good");
}

export function nextShiftProgress(w: World): GameProgress {
  return { ...structuredClone(w.progress), shift: w.progress.shift + 1 };
}

export { capacityOf };
