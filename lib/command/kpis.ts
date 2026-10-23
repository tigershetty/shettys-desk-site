import { siteById } from "./data";
import { capacityOf, stockOnHand } from "./sim";
import type { SiteId, Truck, World } from "./types";

// Pure read-only views over the world, shared by the KPI cards, the
// inspector and the ops panel.

const ON_SITE: Truck["phase"][] = ["atGate", "arriving", "reversing", "docked", "departing"];

export function siteKpis(w: World, site: SiteId) {
  const def = siteById[site];
  const stock = stockOnHand(w, site);
  const trucks = Object.values(w.trucks).filter((t) => t.site === site);
  const onSite = trucks.filter((t) => ON_SITE.includes(t.phase));
  const docks = Object.values(w.docks).filter((d) => d.site === site);
  const shipments = Object.values(w.shipments).filter((s) => s.site === site && s.status !== "open");
  const onTimeToday = shipments.filter((s) => s.status === "onTime").length;
  const delivered = def.history.delivered + shipments.length;
  const onTime = def.history.onTime + onTimeToday;
  const historyRate = def.history.onTime / def.history.delivered;
  const rate = onTime / delivered;
  return {
    stock,
    capacity: capacityOf(w, site),
    stockDelta: stock - w.stockAtStart[site],
    fill: stock / capacityOf(w, site),
    trucksOnSite: onSite.length,
    inboundOnSite: onSite.filter((t) => t.direction === "inbound").length,
    enroute: trucks.filter((t) => t.phase === "enroute").length,
    docked: trucks.filter((t) => t.phase === "docked").length,
    arriving: trucks.filter((t) => t.phase === "arriving" || t.phase === "reversing").length,
    atGate: trucks.filter((t) => t.phase === "atGate").length,
    docksTotal: docks.length,
    docksBusy: docks.filter((d) => d.status === "busy").length,
    docksOut: docks.filter((d) => d.status === "out").length,
    onTimeRate: rate,
    onTimeDelta: rate - historyRate,
    outboundToday: w.outboundToday[site],
    putawaysToday: w.putawaysToday[site],
    staged: Object.values(w.pallets).filter((p) => p.site === site).length,
  };
}

export function skuStatus(w: World, site: SiteId) {
  return siteById[site].skus.map((sku) => {
    const pallets = w.stock[site][sku.id];
    return { ...sku, pallets, units: pallets * sku.unitsPerPallet, low: pallets < sku.lowAt };
  });
}

export function truckStatus(w: World, t: Truck) {
  const dock = t.dock ? w.docks[t.dock] : null;
  const work = t.direction === "inbound" ? "Unloading" : "Loading";
  switch (t.phase) {
    case "enroute":
      return { label: "En route", tone: "route" as const, detail: `To ${t.site} · ETA ${Math.max(1, Math.round(t.eta / 60))} min`, progress: 1 - t.eta / Math.max(1, t.etaTotal) };
    case "atGate":
      return { label: "At gate", tone: "wait" as const, detail: `${t.site} · Waiting for a free bay`, progress: 0 };
    case "arriving":
      return { label: "Docking", tone: "dock" as const, detail: `Turning in to ${dock?.label ?? "a bay"}`, progress: t.t * 0.5 };
    case "reversing":
      return { label: "Docking", tone: "dock" as const, detail: `Reversing into ${dock?.label ?? "a bay"}`, progress: 0.5 + t.t * 0.5 };
    case "docked":
      return { label: work, tone: "work" as const, detail: `${t.site} · ${dock?.label ?? ""} · ${t.done}/${t.pallets} pallets`, progress: t.done / t.pallets };
    case "departing":
      return { label: "Departing", tone: "route" as const, detail: `Leaving ${t.site}`, progress: t.t };
    default:
      return { label: "In transit", tone: "route" as const, detail: "On the road to the customer", progress: 1 };
  }
}

export const truckTitle: Record<Truck["phase"], string> = {
  enroute: "En route",
  atGate: "At gate",
  arriving: "Arriving",
  reversing: "Reversing",
  docked: "Docked",
  departing: "Departing",
  gone: "In transit",
};

export function forkliftStatus(w: World, id: string) {
  const f = w.forklifts[id];
  const dock = f.dock ? w.docks[f.dock] : null;
  const truck = dock?.truck ? w.trucks[dock.truck] : null;
  switch (f.status) {
    case "working":
      return {
        label: truck?.direction === "outbound" ? "Loading truck" : "Unloading truck",
        tone: "work" as const,
        detail: truck ? `${truck.id} at ${dock?.label}` : "Heading to a bay",
        progress: truck ? truck.done / truck.pallets : 0,
      };
    case "toCharger":
      return { label: "To charger", tone: "wait" as const, detail: `Battery ${Math.round(f.battery)}%`, progress: f.battery / 100 };
    case "charging":
      return { label: "Charging at bay", tone: "wait" as const, detail: f.charger ? `Charger ${f.charger.split("-").pop()}` : "", progress: f.battery / 100 };
    case "broken":
      return { label: "Out of service", tone: "bad" as const, detail: "Waiting for a technician", progress: 0 };
    default:
      return { label: "Idle", tone: "idle" as const, detail: "Parked, ready for work", progress: 0 };
  }
}

export function scoreSummary(w: World) {
  const { stats } = w;
  return {
    ...stats,
    onTimeRate: stats.delivered ? stats.onTime / stats.delivered : 1,
    elapsed: (w.clock - w.shiftStart) / (w.shiftEnd - w.shiftStart),
  };
}
