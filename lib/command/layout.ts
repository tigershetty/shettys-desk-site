import { CatmullRomCurve3, Vector3 } from "three";
import { siteById, sites } from "./data";
import type { SiteId, SiteType, Vec2 } from "./types";

// Yard geometry in each site's local frame. The building faces +Z (the yard),
// docks sit on the front wall, and a two-lane road runs along +X at the
// front of the yard. Trucks drive past a dock, then reverse into it.

export const TRUCK_LENGTH = 11;
export const ROAD_Z = 34;
export const LANE_EAST = 32;
export const DOCK_SPACING = 8.5;

export type SiteLayout = {
  type: SiteType;
  width: number;
  depth: number;
  frontZ: number;
  centerZ: number;
  gateX: number;
  fence: { minX: number; maxX: number; minZ: number; maxZ: number };
  dockX: number[];
  staging: Vec2[];
  chargers: Vec2[];
  forkliftHome: Vec2[];
  racks: Vec2[];
};

const v = (x: number, z: number) => new Vector3(x, 0, z);

function buildLayout(id: SiteId): SiteLayout {
  const def = siteById[id];
  const slots = def.docks + def.spareDocks;
  const width = Math.max(34, slots * DOCK_SPACING + 14);
  const depth = def.type === "cold" ? 26 : def.type === "crossdock" ? 20 : 22;
  const frontZ = 3;
  const centerZ = frontZ - depth / 2;
  const firstDock = -width / 2 + 9;
  const dockX = Array.from({ length: slots }, (_, i) => firstDock + i * DOCK_SPACING);
  const gateX = width / 2 + 8;

  const staging: Vec2[] = [];
  // Staging bays sit beside the building's left wall, clear of the truck paths.
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) staging.push([-width / 2 - 16 + c * 2.4, frontZ - 1 - r * 2.4]);

  return {
    type: def.type,
    width,
    depth,
    frontZ,
    centerZ,
    gateX,
    fence: { minX: -width / 2 - 18, maxX: gateX + 10, minZ: centerZ - depth / 2 - 6, maxZ: ROAD_Z - 4 },
    dockX,
    staging,
    chargers: Array.from({ length: 4 }, (_, i) => [-width / 2 - 3, frontZ - 4 - i * 3.2] as Vec2),
    forkliftHome: Array.from({ length: 7 }, (_, i) => [-width / 2 - 8 + (i % 4) * 2.6, frontZ + 5 + Math.floor(i / 4) * 3] as Vec2),
    racks: def.type === "plant" || def.type === "crossdock" ? [[width / 2 + 3, frontZ - 6], [width / 2 + 3, frontZ - 12]] : [],
  };
}

export const layouts = Object.fromEntries(sites.map((s) => [s.id, buildLayout(s.id)])) as Record<SiteId, SiteLayout>;

export type DockPaths = { arrive: CatmullRomCurve3; reverse: CatmullRomCurve3; depart: CatmullRomCurve3; docked: Vec2 };

function buildPaths(l: SiteLayout, x: number): DockPaths {
  const f = l.frontZ;
  const docked: Vec2 = [x, f + TRUCK_LENGTH / 2 + 0.4];
  const arrive = new CatmullRomCurve3([
    v(-95, LANE_EAST),
    v(l.gateX - 14, LANE_EAST),
    v(l.gateX - 2, LANE_EAST - 3),
    v(l.gateX - 3, f + 22),
    v(x + 6, f + 18),
    v(x - 4, f + 16.5),
    v(x - 13, f + 18.5),
  ]);
  const reverse = new CatmullRomCurve3([v(x - 13, f + 18.5), v(x - 5, f + 15.5), v(x - 0.6, f + 11), v(docked[0], docked[1])]);
  const depart = new CatmullRomCurve3([
    v(docked[0], docked[1]),
    v(x, f + 14),
    v(x + 6, f + 19),
    v(l.gateX - 4, f + 22),
    v(l.gateX + 2, LANE_EAST - 2),
    v(l.gateX + 14, LANE_EAST),
    v(110, LANE_EAST),
  ]);
  return { arrive, reverse, depart, docked };
}

export const dockPaths = Object.fromEntries(
  sites.map((s) => [s.id, layouts[s.id].dockX.map((x) => buildPaths(layouts[s.id], x))])
) as Record<SiteId, DockPaths[]>;

/** Real seconds each moving phase takes, from path length and a visual speed. */
export const DRIVE_SPEED = 9;
export const REVERSE_SPEED = 3.2;
export function phaseSeconds(site: SiteId, dockIndex: number, phase: "arriving" | "reversing" | "departing") {
  const p = dockPaths[site][dockIndex];
  const curve = phase === "arriving" ? p.arrive : phase === "reversing" ? p.reverse : p.depart;
  return curve.getLength() / (phase === "reversing" ? REVERSE_SPEED : DRIVE_SPEED);
}

/** Waiting spot on the road shoulder for the n-th truck queued at the gate. */
export function queueSpot(site: SiteId, n: number): { pos: Vec2; heading: number } {
  const l = layouts[site];
  return { pos: [l.gateX - 18 - n * (TRUCK_LENGTH + 2), LANE_EAST - 0.2], heading: 0 };
}

/** Where on the arrival path the n-th queued truck waits, so it can move off without jumping. */
export function queueU(site: SiteId, dockIndex: number, n: number) {
  const curve = dockPaths[site][dockIndex].arrive;
  return Math.min(0.6, Math.max(0, (queueSpot(site, n).pos[0] + 95) / curve.getLength()));
}

/** Pickup and drop points for a forklift serving a dock. */
export function dockWorkPoint(site: SiteId, dockIndex: number): Vec2 {
  const l = layouts[site];
  return [l.dockX[dockIndex] + 2.6, l.frontZ + 1.6];
}

/** Put-away and pick face just inside the dock door. */
export function dockInsidePoint(site: SiteId, dockIndex: number, k: number): Vec2 {
  const l = layouts[site];
  return [l.dockX[dockIndex] - 1.8 + (k % 3) * 1.8, l.frontZ - 4.5 - (k % 2) * 1.5];
}

export function distance(a: Vec2, b: Vec2) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}
