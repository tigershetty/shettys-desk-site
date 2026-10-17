// Typed entities for the supply chain twin. The engine owns the state; the
// 3D scene and the UI only read it.

export type SiteKind = "supplier" | "plant" | "dc" | "market";
export type Mode = "sea" | "road" | "air";

export type Site = {
  id: string;
  kind: SiteKind;
  name: string;
  country: string;
  /** Schematic position on the 3D board (x, z). */
  pos: [number, number];
  /** Plants: daily production capacity in units. */
  capacity?: number;
  /** Markets: mean daily demand and its standard deviation. */
  demandMean?: number;
  demandSd?: number;
  /** Markets: the DC that serves them. Plants: the supplier they buy from. DCs: the plant that replenishes them. */
  source?: string;
};

export type Lane = {
  from: string;
  to: string;
  mode: Mode;
  /** Base lead time in days. */
  leadTime: number;
  /** Distance in km, for CO2. */
  km: number;
  /** Freight cost per unit. */
  costPerUnit: number;
};

export type Network = { sites: Site[]; lanes: Lane[]; unitValue: number; holdingRatePerDay: number };

export type PolicyId = "sQ" | "RS" | "expedite";

export type Params = {
  demand: number;
  leadTime: number;
  capacity: number;
  safetyDays: number;
};

export type DisruptionId = "supplierOutage" | "demandSpike" | "portClosure" | "plantOutage";

export type ActiveDisruption = { id: DisruptionId; start: number; end: number };

export type Shipment = {
  id: number;
  from: string;
  to: string;
  qty: number;
  mode: Mode;
  dispatched: number;
  arrives: number;
  expedited: boolean;
};

export type SiteState = {
  onHand: number;
  backorder: number;
  /** Plants: component stock. */
  components: number;
  stockoutToday: boolean;
  producedToday: number;
};

export type DayKpi = {
  day: number;
  demanded: number;
  filled: number;
  fillRate: number;
  inventoryValue: number;
};

export type Kpis = {
  day: number;
  fillRate: number;
  serviceLevel: number;
  backorders: number;
  inventoryValue: number;
  logisticsCost: number;
  expediteCost: number;
  holdingCost: number;
  co2Tonnes: number;
  recoveryDays: number | null;
  /** True while service is below target after a disruption and not yet back. */
  recovering: boolean;
};

export type TwinEvent = { day: number; text: string; tone: "info" | "warn" | "good" };
