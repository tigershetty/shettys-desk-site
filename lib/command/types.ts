// Supply Chain Command: typed world model. The simulation owns this state;
// the 3D scene and the UI only read it. All positions are metres, Y is up,
// and floor positions are [x, z] in the site's local frame unless noted.

export type Vec2 = [number, number];

export type SiteId = "SE-01" | "DE-01" | "NL-01" | "PL-01" | "IT-01";
export type SiteType = "plant" | "dc" | "cold" | "crossdock" | "robotics";

export type Carrier = "house" | "nordline" | "cargovia" | "bluepeak";

export type Sku = {
  id: string;
  name: string;
  /** Icon hint for the inventory list. */
  icon: "box" | "crate" | "drum" | "roll" | "cold";
  unitsPerPallet: number;
  /** Below this many pallets the SKU shows Low Stock. */
  lowAt: number;
};

export type SiteDef = {
  id: SiteId;
  name: string;
  type: SiteType;
  typeLabel: string;
  address: string;
  /** World origin of the yard. */
  origin: Vec2;
  /** Position on the network map board. */
  mapPos: Vec2;
  docks: number;
  /** Extra dock slots that can be unlocked with credits. */
  spareDocks: number;
  forklifts: number;
  chargers: number;
  capacity: number;
  skus: Sku[];
  /** Seeded on-time history for the last 30 days. */
  history: { delivered: number; onTime: number };
  /** Where inbound trucks come from (for the network map). */
  inboundFrom: string;
};

export type DockStatus = "available" | "busy" | "out";

export type Dock = {
  id: string;
  site: SiteId;
  index: number;
  label: string;
  status: DockStatus;
  truck: string | null;
  /** Game-time (sim seconds) when an out-of-service dock returns. */
  outUntil: number | null;
};

export type TruckPhase =
  | "enroute"
  | "atGate"
  | "arriving"
  | "reversing"
  | "docked"
  | "departing"
  | "gone";

export type Truck = {
  id: string;
  site: SiteId;
  carrier: Carrier;
  driver: string;
  plate: string;
  direction: "inbound" | "outbound";
  phase: TruckPhase;
  /** Sim seconds until arrival while en route. */
  eta: number;
  etaTotal: number;
  dock: string | null;
  /** 0..1 progress through the current moving phase. */
  t: number;
  pallets: number;
  done: number;
  sku: string;
  shipment: string;
  /** Sim seconds the truck entered the gate queue. */
  queuedAt: number | null;
};

export type ForkliftStatus = "idle" | "working" | "toCharger" | "charging" | "broken";

export type Forklift = {
  id: string;
  site: SiteId;
  operator: string;
  model: string;
  status: ForkliftStatus;
  battery: number;
  /** Dock it is serving while working. */
  dock: string | null;
  charger: string | null;
  carrying: boolean;
  moves: number;
  /** Current leg, for smooth motion. Local [x, z]. */
  from: Vec2;
  to: Vec2;
  t: number;
  legSeconds: number;
  /** "pick" walks to the pickup point, "drop" carries to the drop point. */
  leg: "pick" | "drop" | "travel";
  home: Vec2;
  brokenUntil: number | null;
};

export type Charger = {
  id: string;
  site: SiteId;
  forklift: string | null;
  sessions: number;
  energyKwh: number;
};

export type ShipmentStep = "confirmed" | "picked" | "loading" | "transit" | "delivered" | "unloading";

export type Shipment = {
  id: string;
  site: SiteId;
  truck: string;
  direction: "inbound" | "outbound";
  customer: string;
  destination: string;
  sku: string;
  pallets: number;
  rush: boolean;
  /** Sim timestamps (seconds) for each completed step. */
  times: Partial<Record<ShipmentStep, number>>;
  /** Sim second by which it must be delivered (outbound) or docked (inbound). */
  promised: number;
  /** Sim second it is expected to be delivered, once departed. */
  deliverAt: number | null;
  status: "open" | "onTime" | "late";
};

export type Pallet = {
  id: string;
  site: SiteId;
  sku: string;
  quantity: number;
  weightKg: number;
  location: string;
  lot: string;
  received: string;
  slot: Vec2;
};

export type Selection =
  | { kind: "site"; id: SiteId }
  | { kind: "truck" | "forklift" | "dock" | "pallet" | "charger"; id: string };

export type OrderRequest = {
  id: string;
  site: SiteId;
  customer: string;
  destination: string;
  sku: string;
  pallets: number;
  /** Real seconds left to answer. */
  timeLeft: number;
  points: number;
};

export type EventId =
  | "dockFault"
  | "forkliftBreakdown"
  | "spill"
  | "lateTruck"
  | "orderSurge"
  | "lowStock"
  | "portDelay";

export type GameEvent = {
  id: string;
  kind: EventId;
  site: SiteId;
  title: string;
  body: string;
  options: [EventOption, EventOption];
  /** Real seconds before option B is chosen automatically. */
  timeLeft: number;
  /** Entity the event is about, for the camera. */
  target: Selection | null;
};

export type EventOption = { label: string; detail: string; cost: number };

export type Notification = {
  id: string;
  at: number;
  tone: "info" | "good" | "warn";
  text: string;
};

export type Upgrades = {
  docks: Partial<Record<SiteId, number>>;
  forklifts: Partial<Record<SiteId, number>>;
  fastCharge: boolean;
  coldRoom: boolean;
};

export type GameProgress = {
  shift: number;
  credits: number;
  bestScore: number;
  stars: number;
  upgrades: Upgrades;
};

export type ShiftStats = {
  score: number;
  delivered: number;
  onTime: number;
  late: number;
  lost: number;
  combo: number;
  eventsHandled: number;
};

export type World = {
  /** Sim seconds since midnight. */
  clock: number;
  shiftStart: number;
  shiftEnd: number;
  speed: 0 | 1 | 2 | 4;
  view: "network" | "site";
  activeSite: SiteId;
  selection: Selection | null;
  /** Bumped when the camera should fly to the selection. */
  focusNonce: number;
  autopilot: boolean;
  docks: Record<string, Dock>;
  trucks: Record<string, Truck>;
  forklifts: Record<string, Forklift>;
  chargers: Record<string, Charger>;
  shipments: Record<string, Shipment>;
  pallets: Record<string, Pallet>;
  /** Pallets on hand per site per SKU. */
  stock: Record<SiteId, Record<string, number>>;
  stockAtStart: Record<SiteId, number>;
  outboundToday: Record<SiteId, number>;
  putawaysToday: Record<SiteId, number>;
  orders: OrderRequest[];
  event: GameEvent | null;
  notifications: Notification[];
  stats: ShiftStats;
  progress: GameProgress;
  /** Effects from event choices. */
  modifiers: { slowForklifts: number; portDelay: number; surge: number };
  timers: { nextOrder: number; nextEvent: number; nextInbound: Record<SiteId, number> };
  shiftOver: boolean;
  rng: number;
  seq: number;
};
