import { siteById } from "./data";
import { dockPaths, layouts, queueU, TRUCK_LENGTH } from "./layout";
import { currentPos, gateQueue } from "./sim";
import type { Forklift, Selection, SiteId, Truck, World } from "./types";

// World-space poses for the display layer. Positions are [x, z]; heading is
// the yaw that points a model's local +Z forward.

export type Pose = { x: number; z: number; heading: number; visible: boolean };

const hidden: Pose = { x: 0, z: 0, heading: 0, visible: false };

export function toWorld(site: SiteId, p: [number, number]): [number, number] {
  const o = siteById[site].origin;
  return [o[0] + p[0], o[1] + p[1]];
}

function headingOf(dx: number, dz: number) {
  return Math.atan2(dx, dz);
}

export function truckPose(w: World, t: Truck): Pose {
  const origin = siteById[t.site].origin;
  if (t.phase === "enroute" || t.phase === "gone") return hidden;
  if (t.phase === "atGate") {
    const n = Math.max(0, gateQueue(w, t.site).findIndex((x) => x.id === t.id));
    const curve = dockPaths[t.site][0].arrive;
    const u = queueU(t.site, 0, n);
    const p = curve.getPointAt(u);
    const tan = curve.getTangentAt(Math.max(0.001, u));
    return { x: origin[0] + p.x, z: origin[1] + p.z, heading: headingOf(tan.x, tan.z), visible: true };
  }
  const index = t.dock ? w.docks[t.dock].index : 0;
  const paths = dockPaths[t.site][index];
  if (t.phase === "docked") return { x: origin[0] + paths.docked[0], z: origin[1] + paths.docked[1], heading: 0, visible: true };
  const curve = t.phase === "arriving" ? paths.arrive : t.phase === "reversing" ? paths.reverse : paths.depart;
  const u = Math.min(1, Math.max(0, t.t));
  const p = curve.getPointAt(u);
  const tan = curve.getTangentAt(Math.min(0.999, Math.max(0.001, u)));
  // Reversing: the truck moves backwards, so it faces against the path.
  const heading = headingOf(tan.x, tan.z) + (t.phase === "reversing" ? Math.PI : 0);
  return { x: origin[0] + p.x, z: origin[1] + p.z, heading, visible: true };
}

export function forkliftPose(f: Forklift): Pose {
  const p = currentPos(f);
  const dx = f.to[0] - f.from[0];
  const dz = f.to[1] - f.from[1];
  const moving = Math.hypot(dx, dz) > 0.05;
  const [x, z] = toWorld(f.site, p);
  return { x, z, heading: moving ? headingOf(dx, dz) : Math.PI, visible: true };
}

/** Where the camera should look and how big the selection box is. */
export function focusOf(w: World, sel: Selection | null): { x: number; z: number; size: [number, number, number]; site: SiteId } {
  const site = w.activeSite;
  const l = layouts[site];
  const o = siteById[site].origin;
  const siteFocus = { x: o[0] + 2, z: o[1] + l.frontZ + 8, size: [l.width + 4, 9, l.depth + 4] as [number, number, number], site };
  if (!sel) return siteFocus;
  switch (sel.kind) {
    case "site": {
      const so = siteById[sel.id].origin;
      const sl = layouts[sel.id];
      return { x: so[0] + 2, z: so[1] + sl.frontZ + 8, size: [sl.width + 4, 9, sl.depth + 4], site: sel.id };
    }
    case "truck": {
      const t = w.trucks[sel.id];
      if (!t) return siteFocus;
      const p = truckPose(w, t);
      if (!p.visible) return siteFocus;
      return { x: p.x, z: p.z, size: [3.2, 4.4, TRUCK_LENGTH + 1], site: t.site };
    }
    case "forklift": {
      const f = w.forklifts[sel.id];
      if (!f) return siteFocus;
      const p = forkliftPose(f);
      return { x: p.x, z: p.z, size: [1.8, 2.8, 3], site: f.site };
    }
    case "pallet": {
      const pal = w.pallets[sel.id];
      if (!pal) return siteFocus;
      const [x, z] = toWorld(pal.site, pal.slot);
      return { x, z, size: [1.6, 1.6, 1.6], site: pal.site };
    }
    case "charger": {
      const c = w.chargers[sel.id];
      if (!c) return siteFocus;
      const i = Number(c.id.split("-C")[1]) - 1;
      const [x, z] = toWorld(c.site, layouts[c.site].chargers[i]);
      return { x, z, size: [1.4, 2.2, 1.4], site: c.site };
    }
    case "dock": {
      const d = w.docks[sel.id];
      if (!d) return siteFocus;
      const dl = layouts[d.site];
      const [x, z] = toWorld(d.site, [dl.dockX[d.index], dl.frontZ + 1]);
      return { x, z, size: [4.6, 5, 3], site: d.site };
    }
  }
}

/** Heading of an entity for orienting the selection brackets. */
export function selectionHeading(w: World, sel: Selection | null) {
  if (!sel) return 0;
  if (sel.kind === "truck" && w.trucks[sel.id]) return truckPose(w, w.trucks[sel.id]).heading;
  if (sel.kind === "forklift" && w.forklifts[sel.id]) return forkliftPose(w.forklifts[sel.id]).heading;
  return 0;
}
