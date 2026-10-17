import type {
  ActiveDisruption,
  DayKpi,
  DisruptionId,
  Kpis,
  Lane,
  Mode,
  Network,
  Params,
  PolicyId,
  Shipment,
  Site,
  SiteState,
  TwinEvent,
} from "./model";
import { defaultNetwork } from "./network";

export const defaultParams: Params = { demand: 1, leadTime: 1, capacity: 1, safetyDays: 4 };

export const disruptionInfo: Record<DisruptionId, { label: string; days: number; detail: string }> = {
  supplierOutage: { label: "Supplier outage", days: 30, detail: "Electronics supplier stops dispatching" },
  demandSpike: { label: "Demand spike", days: 21, detail: "All markets order 60% more" },
  portClosure: { label: "Port closure", days: 21, detail: "Sea freight dispatched now takes +21 days" },
  plantOutage: { label: "Plant outage", days: 14, detail: "Lund plant capacity drops to zero" },
};

export const policyInfo: Record<PolicyId, { label: string; detail: string }> = {
  sQ: { label: "(s, Q) reorder point", detail: "Order a fixed batch when inventory position hits s" },
  RS: { label: "(R, S) periodic review", detail: "Every 7 days, order up to S" },
  expedite: { label: "(s, Q) + expedite", detail: "Like (s, Q), plus air spot-buys when components are about to run out" },
};

const CO2_KG_PER_TKM: Record<Mode, number> = { sea: 0.016, road: 0.09, air: 0.6 };
const UNIT_TONNES = 0.05;
const REVIEW_DAYS = 7;
const BATCH_DAYS = 7;
const AIR_LEAD_TIME = 5;
const AIR_COST_PER_UNIT = 28;
const WARMUP_DAYS = 60;
// Customers wait a few days; older backorders become lost sales.
const BACKORDER_DAYS = 3;

// Small, fast, seedable RNG so every run is reproducible.
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(rand: () => number) {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

type SupplierOrder = { plant: string; qty: number };

export class Twin {
  readonly network: Network;
  params: Params;
  policy: PolicyId;
  day = 0;
  sites: Record<string, SiteState> = {};
  shipments: Shipment[] = [];
  disruptions: ActiveDisruption[] = [];
  events: TwinEvent[] = [];
  history: DayKpi[] = [];

  private rand: () => number;
  private nextId = 1;
  private supplierQueue: Record<string, SupplierOrder[]> = {};
  private lastReview = 0;
  private totals = { demanded: 0, filled: 0, dcDays: 0, dcStockoutDays: 0, logistics: 0, expedite: 0, holding: 0, co2Kg: 0 };
  private recovery: { start: number; dipped: boolean; days: number | null } | null = null;

  constructor(opts: { seed?: number; params?: Partial<Params>; policy?: PolicyId; network?: Network } = {}) {
    this.network = opts.network ?? defaultNetwork;
    this.params = { ...defaultParams, ...opts.params };
    this.policy = opts.policy ?? "sQ";
    this.rand = mulberry32(opts.seed ?? 42);
    this.initState();
    // Run to steady state, then start the visible clock and counters at zero.
    for (let i = 0; i < WARMUP_DAYS; i++) this.step();
    this.day = 0;
    this.shipments.forEach((s) => {
      s.dispatched -= WARMUP_DAYS;
      s.arrives -= WARMUP_DAYS;
    });
    this.lastReview -= WARMUP_DAYS;
    this.resetCounters();
  }

  site(id: string): Site {
    const s = this.network.sites.find((x) => x.id === id);
    if (!s) throw new Error(`Unknown site ${id}`);
    return s;
  }

  lane(from: string, to: string): Lane {
    const l = this.network.lanes.find((x) => x.from === from && x.to === to);
    if (!l) throw new Error(`No lane ${from} -> ${to}`);
    return l;
  }

  private sitesOf(kind: Site["kind"]) {
    return this.network.sites.filter((s) => s.kind === kind);
  }

  /** Mean daily demand flowing through a DC or plant, at the current demand setting. */
  meanDemand(siteId: string): number {
    const site = this.site(siteId);
    if (site.kind === "market") return (site.demandMean ?? 0) * this.params.demand;
    if (site.kind === "dc") return this.sitesOf("market").filter((m) => m.source === siteId).reduce((sum, m) => sum + this.meanDemand(m.id), 0);
    if (site.kind === "plant") return this.sitesOf("dc").filter((d) => d.source === siteId).reduce((sum, d) => sum + this.meanDemand(d.id), 0);
    return 0;
  }

  leadTime(lane: Lane, air = false) {
    if (air) return AIR_LEAD_TIME;
    const base = lane.leadTime * this.params.leadTime;
    const port = lane.mode === "sea" && this.isActive("portClosure") ? 21 : 0;
    return Math.max(1, Math.round(base + port));
  }

  isActive(id: DisruptionId) {
    return this.disruptions.some((d) => d.id === id && this.day >= d.start && this.day < d.end);
  }

  inTransitTo(siteId: string) {
    return this.shipments.filter((s) => s.to === siteId).reduce((sum, s) => sum + s.qty, 0);
  }

  private initState() {
    for (const s of this.network.sites) {
      this.sites[s.id] = { onHand: 0, backorder: 0, components: 0, stockoutToday: false, producedToday: 0 };
    }
    for (const dc of this.sitesOf("dc")) {
      const lt = this.leadTime(this.lane(dc.source!, dc.id));
      this.sites[dc.id].onHand = Math.round(this.meanDemand(dc.id) * (lt + this.params.safetyDays + BATCH_DAYS));
    }
    for (const p of this.sitesOf("plant")) {
      const lt = this.leadTime(this.lane(p.source!, p.id));
      this.sites[p.id].onHand = Math.round(this.meanDemand(p.id) * 3);
      this.sites[p.id].components = Math.round(this.meanDemand(p.id) * (lt + this.params.safetyDays + BATCH_DAYS * 2));
    }
    for (const sup of this.sitesOf("supplier")) this.supplierQueue[sup.id] = [];
  }

  private resetCounters() {
    this.totals = { demanded: 0, filled: 0, dcDays: 0, dcStockoutDays: 0, logistics: 0, expedite: 0, holding: 0, co2Kg: 0 };
    this.history = [];
    this.events = [];
    this.recovery = null;
  }

  private log(text: string, tone: TwinEvent["tone"] = "info") {
    this.events.unshift({ day: this.day, text, tone });
    if (this.events.length > 40) this.events.pop();
  }

  private dispatch(from: string, to: string, qty: number, air = false) {
    if (qty <= 0) return;
    const lane = this.lane(from, to);
    const mode: Mode = air ? "air" : lane.mode;
    const lt = this.leadTime(lane, air);
    this.shipments.push({ id: this.nextId++, from, to, qty, mode, dispatched: this.day, arrives: this.day + lt, expedited: air });
    const freight = qty * (air ? AIR_COST_PER_UNIT : lane.costPerUnit);
    this.totals.logistics += freight;
    if (air) this.totals.expedite += qty * (AIR_COST_PER_UNIT - lane.costPerUnit);
    this.totals.co2Kg += qty * UNIT_TONNES * lane.km * CO2_KG_PER_TKM[mode];
  }

  /** Start a disruption now. Ignored if the same one is already running. */
  inject(id: DisruptionId) {
    if (this.isActive(id)) return;
    const info = disruptionInfo[id];
    this.disruptions.push({ id, start: this.day, end: this.day + info.days });
    this.recovery = { start: this.day, dipped: false, days: null };
    this.log(`${info.label}: ${info.detail.toLowerCase()} for ${info.days} days`, "warn");
  }

  step() {
    const d = this.day;
    const net = this.network;

    // 1. Arrivals.
    const arriving = this.shipments.filter((s) => s.arrives <= d);
    this.shipments = this.shipments.filter((s) => s.arrives > d);
    for (const s of arriving) {
      const to = this.site(s.to);
      if (to.kind === "plant") this.sites[s.to].components += s.qty;
      else if (to.kind === "dc") this.sites[s.to].onHand += s.qty;
    }

    for (const ended of this.disruptions.filter((x) => x.end === d)) {
      this.log(`${disruptionInfo[ended.id].label} is over`, "good");
    }

    // 2. Market demand served from each DC (backorders first, late).
    const spike = this.isActive("demandSpike") ? 1.6 : 1;
    let demandedToday = 0;
    let filledToday = 0;
    for (const dc of this.sitesOf("dc")) {
      const st = this.sites[dc.id];
      const late = Math.min(st.backorder, st.onHand);
      st.onHand -= late;
      st.backorder -= late;
      const markets = net.sites.filter((x) => x.kind === "market" && x.source === dc.id);
      this.dispatch(dc.id, markets[0].id, late);
      let unmet = 0;
      for (const m of markets) {
        const mean = (m.demandMean ?? 0) * this.params.demand * spike;
        const qty = Math.max(0, Math.round(mean + normal(this.rand) * (m.demandSd ?? 0) * this.params.demand));
        const ship = Math.min(qty, st.onHand);
        st.onHand -= ship;
        unmet += qty - ship;
        demandedToday += qty;
        filledToday += ship;
        this.dispatch(dc.id, m.id, ship);
      }
      const wasOut = st.stockoutToday;
      st.stockoutToday = unmet > 0;
      st.backorder = Math.min(st.backorder + unmet, Math.round(this.meanDemand(dc.id) * BACKORDER_DAYS));
      if (st.stockoutToday && !wasOut) this.log(`${dc.name} stocked out`, "warn");
      this.totals.dcDays++;
      if (st.stockoutToday) this.totals.dcStockoutDays++;
    }

    // 3. Production at plants, then DC replenishment orders served from plant stock.
    for (const p of this.sitesOf("plant")) {
      const st = this.sites[p.id];
      const outage = p.id === "P1" && this.isActive("plantOutage");
      const cap = outage ? 0 : Math.round((p.capacity ?? 0) * this.params.capacity);
      const target = this.meanDemand(p.id) * 3 + st.backorder;
      const make = Math.max(0, Math.min(cap, st.components, Math.round(target - st.onHand + this.meanDemand(p.id))));
      st.components -= make;
      st.onHand += make;
      st.producedToday = make;

      // Short-shipped DC orders from earlier days go out first.
      const owed = Math.min(st.backorder, st.onHand);
      if (owed > 0) {
        st.onHand -= owed;
        st.backorder -= owed;
        for (const dc of this.sitesOf("dc").filter((x) => x.source === p.id)) this.dispatch(p.id, dc.id, owed);
      }
    }

    const review = this.policy === "RS" ? d - this.lastReview >= REVIEW_DAYS : true;
    if (this.policy === "RS" && review) this.lastReview = d;
    for (const dc of this.sitesOf("dc")) {
      const plant = this.sites[dc.source!];
      const st = this.sites[dc.id];
      const mu = this.meanDemand(dc.id);
      const lt = this.leadTime(this.lane(dc.source!, dc.id));
      const position = st.onHand + this.inTransitTo(dc.id) + plant.backorder - st.backorder;
      let order = 0;
      if (this.policy === "RS") {
        if (review) order = Math.max(0, mu * (lt + REVIEW_DAYS + this.params.safetyDays) - position);
      } else if (position <= mu * (lt + this.params.safetyDays)) {
        order = mu * BATCH_DAYS + Math.max(0, mu * (lt + this.params.safetyDays) - position);
      }
      const qty = Math.round(order);
      const ship = Math.min(qty, plant.onHand);
      plant.onHand -= ship;
      plant.backorder = Math.min(plant.backorder + qty - ship, Math.round(mu * BATCH_DAYS));
      this.dispatch(dc.source!, dc.id, ship);
    }

    // 4. Plants reorder components; suppliers dispatch unless they are down.
    for (const p of this.sitesOf("plant")) {
      const st = this.sites[p.id];
      const mu = this.meanDemand(p.id);
      const lane = this.lane(p.source!, p.id);
      const lt = this.leadTime(lane);
      const queued = this.supplierQueue[p.source!].filter((o) => o.plant === p.id).reduce((sum, o) => sum + o.qty, 0);
      // Owed DC orders still need components, so they reduce the position.
      const position = st.components + this.inTransitTo(p.id) + queued - st.backorder;
      const reorderPoint = mu * (lt + this.params.safetyDays);
      if (position <= reorderPoint) {
        const qty = Math.round(mu * BATCH_DAYS * 2 + (reorderPoint - position));
        this.supplierQueue[p.source!].push({ plant: p.id, qty });
      }

      // Expedite: when components on hand plus anything landing within the air
      // lead time will not cover it, spot-buy by air. Bypasses the supplier
      // queue, so it also works while the supplier is down.
      if (this.policy === "expedite") {
        const soon = this.shipments.filter((s) => s.to === p.id && s.arrives <= d + AIR_LEAD_TIME).reduce((sum, s) => sum + s.qty, 0);
        const airborne = this.shipments.some((s) => s.to === p.id && s.mode === "air");
        const cover = (st.components + soon) / Math.max(mu, 1);
        if (!airborne && cover < AIR_LEAD_TIME) {
          const qty = Math.round(mu * (AIR_LEAD_TIME + this.params.safetyDays + BATCH_DAYS) - st.components - soon);
          this.dispatch(p.source!, p.id, qty, true);
          this.log(`Expedited ${qty.toLocaleString("en-US")} components to ${p.name} by air`, "info");
        }
      }
    }
    for (const sup of this.sitesOf("supplier")) {
      if (sup.id === "S1" && this.isActive("supplierOutage")) continue;
      for (const o of this.supplierQueue[sup.id]) this.dispatch(sup.id, o.plant, o.qty);
      this.supplierQueue[sup.id] = [];
    }

    // 5. KPIs.
    const units = Object.entries(this.sites).reduce((sum, [id, s]) => {
      const kind = this.site(id).kind;
      return kind === "dc" || kind === "plant" ? sum + s.onHand + s.components * 0.4 : sum;
    }, 0);
    const inventoryValue = units * net.unitValue;
    this.totals.holding += inventoryValue * net.holdingRatePerDay;
    this.totals.demanded += demandedToday;
    this.totals.filled += filledToday;
    const fillRate = demandedToday ? filledToday / demandedToday : 1;
    this.history.push({ day: d, demanded: demandedToday, filled: filledToday, fillRate, inventoryValue });
    if (this.history.length > 365) this.history.shift();

    if (this.recovery && this.recovery.days === null) {
      const rolling = this.rollingFillRate(7);
      if (rolling < 0.95) this.recovery.dipped = true;
      else if (this.recovery.dipped && d > this.recovery.start) {
        this.recovery.days = d - this.recovery.start;
        this.log(`Service recovered after ${this.recovery.days} days`, "good");
      }
    }

    this.day++;
  }

  rollingFillRate(days: number) {
    const recent = this.history.slice(-days);
    const dem = recent.reduce((s, h) => s + h.demanded, 0);
    const fil = recent.reduce((s, h) => s + h.filled, 0);
    return dem ? fil / dem : 1;
  }

  kpis(): Kpis {
    const t = this.totals;
    return {
      day: this.day,
      fillRate: t.demanded ? t.filled / t.demanded : 1,
      serviceLevel: t.dcDays ? 1 - t.dcStockoutDays / t.dcDays : 1,
      backorders: this.sitesOf("dc").reduce((s, dc) => s + this.sites[dc.id].backorder, 0),
      inventoryValue: this.history.at(-1)?.inventoryValue ?? 0,
      logisticsCost: t.logistics,
      expediteCost: t.expedite,
      holdingCost: t.holding,
      co2Tonnes: t.co2Kg / 1000,
      recoveryDays: this.recovery ? (this.recovery.dipped ? this.recovery.days : 0) : null,
      recovering: !!this.recovery && this.recovery.dipped && this.recovery.days === null,
    };
  }
}

export type ScenarioEvent = { id: DisruptionId; day: number };

/** Run one seeded scenario headlessly and return the final KPIs. */
export function runScenario(opts: { policy: PolicyId; params?: Partial<Params>; events?: ScenarioEvent[]; days?: number; seed?: number }): Kpis {
  const twin = new Twin({ policy: opts.policy, params: opts.params, seed: opts.seed });
  const days = opts.days ?? 120;
  for (let i = 0; i < days; i++) {
    for (const e of opts.events ?? []) if (e.day === twin.day) twin.inject(e.id);
    twin.step();
  }
  return twin.kpis();
}
