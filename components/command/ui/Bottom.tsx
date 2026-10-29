"use client";

import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { carriers, siteById } from "@/lib/command/data";
import { forkliftStatus, truckStatus } from "@/lib/command/kpis";
import { fmtClock } from "@/lib/command/sim";
import { useCommand } from "@/lib/command/store";
import type { Shipment, Truck, World } from "@/lib/command/types";
import { cn } from "@/lib/utils";
import { Bar, Card, minutes, Pill } from "./bits";

/** The truck the tracking card follows: the selection, or the busiest truck at the site. */
function trackedTruck(w: World): Truck | null {
  const sel = w.selection;
  if (sel?.kind === "truck" && w.trucks[sel.id]) return w.trucks[sel.id];
  if (sel?.kind === "dock" && w.docks[sel.id]?.truck) return w.trucks[w.docks[sel.id].truck!] ?? null;
  if (sel?.kind === "forklift") {
    const f = w.forklifts[sel.id];
    const d = f?.dock ? w.docks[f.dock] : null;
    if (d?.truck && w.trucks[d.truck]) return w.trucks[d.truck];
  }
  const order: Truck["phase"][] = ["docked", "reversing", "arriving", "atGate", "enroute", "departing"];
  const here = Object.values(w.trucks).filter((t) => t.site === w.activeSite && t.phase !== "gone");
  here.sort((a, b) => order.indexOf(a.phase) - order.indexOf(b.phase));
  return here[0] ?? null;
}

type Step = { label: string; time: string; state: "done" | "now" | "next" };

function steps(w: World, t: Truck, s: Shipment): Step[] {
  const at = (x?: number) => (x !== undefined ? fmtClock(x) : "");
  const eta = (mins: number) => `ETA ${fmtClock(w.clock + mins * 60)}`;
  if (s.direction === "inbound") {
    const docked = t.phase === "docked";
    const arrived = ["docked", "departing", "gone"].includes(t.phase);
    return [
      { label: "Order Confirmed", time: at(s.times.confirmed), state: "done" },
      { label: "Picked", time: at(s.times.picked), state: "done" },
      { label: "In Transit", time: t.phase === "enroute" ? `ETA ${minutes(t.eta)}` : "", state: arrived || t.phase !== "enroute" ? "done" : "now" },
      { label: "Docking", time: t.phase === "enroute" ? "" : t.phase === "atGate" ? "At gate" : "", state: arrived ? "done" : t.phase === "enroute" ? "next" : "now" },
      { label: docked ? `Unloading ${t.done}/${t.pallets}` : "Unloaded", time: at(s.times.unloading), state: docked ? "now" : arrived ? "done" : "next" },
    ];
  }
  const loading = t.phase === "docked";
  const left = ["departing", "gone"].includes(t.phase);
  return [
    { label: "Order Confirmed", time: at(s.times.confirmed), state: "done" },
    { label: "Picked", time: at(s.times.confirmed ? s.times.confirmed + 300 : undefined), state: "done" },
    { label: loading ? `Loading ${t.done}/${t.pallets}` : left ? "Loaded" : "Loading", time: at(s.times.loading), state: loading ? "now" : left ? "done" : "next" },
    { label: "In Transit", time: s.times.transit ? at(s.times.transit) : eta(40), state: left && s.status === "open" ? "now" : s.status !== "open" ? "done" : "next" },
    { label: "Delivered", time: s.times.delivered ? at(s.times.delivered) : s.deliverAt ? `ETA ${fmtClock(s.deliverAt)}` : `Due ${fmtClock(s.promised)}`, state: s.status !== "open" ? "done" : "next" },
  ];
}

export function ShipmentTracking({ compact = false }: { compact?: boolean }) {
  const w = useCommand();
  const t = trackedTruck(w);
  if (!t) {
    return (
      <Card className="px-4 py-3">
        <p className="text-[13px] font-semibold text-slate-900">Shipment Tracking</p>
        <p className="mt-1 text-[12px] text-slate-500">No trucks at {siteById[w.activeSite].name} right now.</p>
      </Card>
    );
  }
  const s = w.shipments[t.shipment];
  const st = truckStatus(w, t);
  const list = steps(w, t, s);
  const dock = t.dock ? w.docks[t.dock] : null;
  const left = s.direction === "outbound" ? s.promised - w.clock : t.eta;
  return (
    <Card className="px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-slate-900">Shipment Tracking</p>
        <button type="button" onClick={() => w.select({ kind: "truck", id: t.id })} className="text-[12px] text-slate-500 hover:text-indigo-600">
          <span className="font-mono font-semibold text-slate-900">{t.id}</span> · {carriers[t.carrier].name}
        </button>
      </div>
      <div className={cn("mt-3 flex gap-4", compact ? "flex-col" : "flex-col xl:flex-row xl:items-center")}>
        <ol className="flex flex-1 items-start">
          {list.map((step, i) => (
            <li key={i} className="relative flex flex-1 flex-col items-center text-center">
              {i > 0 && <span className={cn("absolute right-1/2 top-[11px] h-0.5 w-full", step.state === "next" ? "bg-slate-200" : "bg-indigo-600")} />}
              <span
                className={cn(
                  "relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-white",
                  step.state === "done" && "bg-indigo-600",
                  step.state === "now" && "bg-white ring-4 ring-indigo-200 [&>span]:bg-indigo-600",
                  step.state === "next" && "bg-slate-200"
                )}
              >
                {step.state === "done" ? <Check className="h-3.5 w-3.5" /> : step.state === "now" ? <span className="h-2.5 w-2.5 rounded-full" /> : null}
              </span>
              <span className={cn("mt-1.5 text-[11px] font-semibold leading-tight", step.state === "next" ? "text-slate-400" : "text-slate-900")}>{step.label}</span>
              <span className="mt-0.5 font-mono text-[10px] text-slate-400">{step.time}</span>
            </li>
          ))}
        </ol>
        {!compact && (
          <button
            type="button"
            onClick={() => w.select({ kind: "truck", id: t.id })}
            className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left hover:border-indigo-200 xl:w-64"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-[12px] font-bold text-slate-900">#{s.id}</span>
              <span className="block truncate text-[11px] text-slate-500">
                {s.direction === "inbound" ? "From" : "To"}: {s.direction === "inbound" ? s.customer : s.destination}
              </span>
              <span className="mt-1 flex items-center gap-1.5">
                <Pill tone={st.tone}>{st.label}</Pill>
              </span>
              <span className="mt-1 block truncate text-[11px] text-slate-500">
                {t.site}
                {dock ? ` · ${dock.label}` : ""} · {s.direction === "inbound" && t.phase !== "enroute" ? "On site" : left > 0 ? `${minutes(left)} left` : "Overdue"}
              </span>
            </span>
            <TruckThumb color={carriers[t.carrier].stripe} />
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        )}
      </div>
    </Card>
  );
}

function TruckThumb({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 32" className="h-8 w-16 shrink-0" aria-hidden>
      <rect x="2" y="6" width="40" height="18" rx="2" fill="#fff" stroke="#cbd5e1" />
      <rect x="2" y="19" width="40" height="3" fill={color} />
      <path d="M44 10h10l6 7v7H44z" fill={color} />
      <rect x="47" y="12" width="7" height="5" rx="1" fill="#1e293b" />
      <circle cx="12" cy="26" r="3.5" fill="#1f2937" />
      <circle cx="34" cy="26" r="3.5" fill="#1f2937" />
      <circle cx="52" cy="26" r="3.5" fill="#1f2937" />
    </svg>
  );
}

type Tab = "docks" | "forklifts" | "trucks";

export function OpsPanel() {
  const w = useCommand();
  const [tab, setTab] = useState<Tab>("docks");
  const site = w.activeSite;
  const docks = Object.values(w.docks).filter((d) => d.site === site);
  const lifts = Object.values(w.forklifts).filter((f) => f.site === site);
  const trucks = Object.values(w.trucks).filter((t) => t.site === site && t.phase !== "gone");
  const sel = w.selection;
  const tabs: { id: Tab; label: string; n: string }[] = [
    { id: "docks", label: "Docks", n: `${docks.filter((d) => d.status === "busy").length}/${docks.length}` },
    { id: "forklifts", label: "Forklifts", n: `${lifts.filter((f) => f.status === "working").length}/${lifts.length}` },
    { id: "trucks", label: "Trucks", n: String(trucks.length) },
  ];
  const rowCls = (on: boolean) =>
    cn("flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] hover:bg-slate-50", on && "bg-indigo-50/70 ring-1 ring-inset ring-indigo-200");
  return (
    <Card className="flex max-h-full flex-col overflow-hidden">
      <div className="flex items-center gap-1 border-b border-slate-100 px-2 pt-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn("-mb-px border-b-2 px-2 pb-2 text-[12px] font-semibold", tab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800")}
          >
            {t.label} <span className="font-mono text-[11px] text-slate-400">{t.n}</span>
          </button>
        ))}
        <span className="ml-auto truncate pb-2 pr-1 text-[11px] text-slate-400">{siteById[site].name}</span>
      </div>
      <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-1.5">
        {tab === "docks" &&
          docks.map((d) => {
            const t = d.truck ? w.trucks[d.truck] : null;
            const st = t ? truckStatus(w, t) : null;
            return (
              <li key={d.id}>
                <button type="button" onClick={() => w.select(t ? { kind: "truck", id: t.id } : { kind: "dock", id: d.id })} className={rowCls(sel?.id === d.id || (!!t && sel?.id === t.id))}>
                  <span className="w-14 shrink-0">
                    <span className="block font-semibold text-slate-900">{d.label}</span>
                    <span className="block text-[10px] text-slate-400">{d.id.slice(-2)}</span>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-slate-600">
                    {t ? (
                      <>
                        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: carriers[t.carrier].stripe }} />
                        {t.id} · {carriers[t.carrier].name}
                      </>
                    ) : d.status === "out" ? (
                      "Out of service"
                    ) : (
                      "Empty bay"
                    )}
                  </span>
                  <Pill tone={d.status === "out" ? "bad" : st ? st.tone : "idle"}>{d.status === "out" ? "Out" : st ? st.label : "Available"}</Pill>
                  <span className="w-12 shrink-0">{t && t.phase === "docked" ? <Bar value={t.done / t.pallets} tone="work" /> : null}</span>
                  <span className="w-7 shrink-0 text-right font-mono text-[11px] text-slate-500">{t && t.phase === "docked" ? `${t.done}/${t.pallets}` : ""}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                </button>
              </li>
            );
          })}
        {tab === "forklifts" &&
          lifts.map((f) => {
            const st = forkliftStatus(w, f.id);
            return (
              <li key={f.id}>
                <button type="button" onClick={() => w.select({ kind: "forklift", id: f.id })} className={rowCls(sel?.id === f.id)}>
                  <span className="w-14 shrink-0">
                    <span className="block font-mono font-semibold text-slate-900">{f.id}</span>
                    <span className="block truncate text-[10px] text-slate-400">{f.operator.split(" ")[0]}</span>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-slate-600">{st.detail}</span>
                  <Pill tone={st.tone}>{st.label}</Pill>
                  <span className="w-12 shrink-0">
                    <Bar value={f.battery / 100} tone={f.battery < 25 ? "wait" : "work"} />
                  </span>
                  <span className="w-7 shrink-0 text-right font-mono text-[11px] text-slate-500">{Math.round(f.battery)}%</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                </button>
              </li>
            );
          })}
        {tab === "trucks" &&
          (trucks.length === 0 ? (
            <li className="px-2 py-3 text-[12px] text-slate-500">No trucks for this site.</li>
          ) : (
            trucks.map((t) => {
              const st = truckStatus(w, t);
              return (
                <li key={t.id}>
                  <button type="button" onClick={() => w.select({ kind: "truck", id: t.id })} className={rowCls(sel?.id === t.id)}>
                    <span className="w-16 shrink-0">
                      <span className="block font-mono font-semibold text-slate-900">{t.id}</span>
                      <span className="block text-[10px] text-slate-400">{t.direction === "inbound" ? "Inbound" : "Outbound"}</span>
                    </span>
                    <span className="min-w-0 flex-1 truncate text-slate-600">
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: carriers[t.carrier].stripe }} />
                      {carriers[t.carrier].name}
                    </span>
                    <Pill tone={st.tone}>{st.label}</Pill>
                    <span className="w-14 shrink-0 text-right font-mono text-[11px] text-slate-500">
                      {t.phase === "enroute" ? minutes(t.eta) : t.phase === "docked" ? `${t.done}/${t.pallets}` : ""}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  </button>
                </li>
              );
            })
          ))}
      </ul>
    </Card>
  );
}
