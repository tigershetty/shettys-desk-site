// Shared types for the 3D network and yards. All positions are metres, Y is
// up, and floor positions are [x, z] in the site's local frame unless noted.

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
