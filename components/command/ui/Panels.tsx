"use client";

import {
  ArrowUpRight,
  BatteryCharging,
  Box,
  Boxes,
  Clock3,
  Cylinder,
  Home,
  Minus,
  Package,
  Pin,
  Plus,
  RotateCcw,
  RotateCw,
  Snowflake,
  Truck as TruckIcon,
  X,
  Zap,
} from "lucide-react";
import { carriers, siteById } from "@/lib/command/data";
import { forkliftStatus, siteKpis, skuStatus, truckStatus } from "@/lib/command/kpis";
import { fmtClock } from "@/lib/command/sim";
import { useCommand, type CommandStore } from "@/lib/command/store";
import type { Sku } from "@/lib/command/types";
import { cn } from "@/lib/utils";
import { useView } from "../scene/CommandScene";
import { Bar, Card, Eyebrow, IconTile, minutes, Pill, Row, type Tone } from "./bits";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function Delta({ value, suffix = "" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span className={cn("text-[11px] font-semibold", up ? "text-emerald-600" : "text-rose-600")}>
      {up ? "↑" : "↓"} {up ? "+" : ""}
      {value.toFixed(suffix === "%" ? 1 : 0)}
      {suffix}
    </span>
  );
}

export function KpiCards() {
  const w = useCommand();
  const k = siteKpis(w, w.activeSite);
  const cards = [
    { icon: <Boxes className="h-4 w-4" />, label: "Stock on hand", value: fmt(k.stock), delta: <Delta value={k.stockDelta} />, sub: `pallets · ${w.activeSite}` },
    { icon: <TruckIcon className="h-4 w-4" />, label: "Trucks on site", value: String(k.trucksOnSite), delta: <Delta value={k.trucksOnSite - k.atGate} />, sub: `${k.inboundOnSite} inbound · ${k.atGate} at gate` },
    { icon: <Clock3 className="h-4 w-4" />, label: "On-time delivery", value: `${(k.onTimeRate * 100).toFixed(1)}%`, delta: <Delta value={k.onTimeDelta * 100} suffix="%" />, sub: "last 30 days" },
  ];
  return (
    <div className="flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:gap-3">
      {cards.map((c) => (
        <Card key={c.label} className="min-w-[168px] shrink-0 snap-start px-3 py-2.5 lg:min-w-[184px]">
          <div className="flex items-center gap-2">
            <IconTile>{c.icon}</IconTile>
            <p className="text-[12px] font-medium text-slate-500">{c.label}</p>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <p className="text-[22px] font-bold leading-none tracking-tight text-slate-900">{c.value}</p>
            {c.delta}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{c.sub}</p>
        </Card>
      ))}
    </div>
  );
}

export function MapControls() {
  const v = useView();
  const btn = "flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600";
  return (
    <Card className="flex flex-col overflow-hidden">
      <button type="button" className={btn} onClick={() => v.zoomBy(0.8)} aria-label="Zoom in">
        <Plus className="h-4 w-4" />
      </button>
      <button type="button" className={cn(btn, "border-t border-slate-100")} onClick={() => v.zoomBy(1.25)} aria-label="Zoom out">
        <Minus className="h-4 w-4" />
      </button>
      <button type="button" className={cn(btn, "border-t border-slate-100")} onClick={() => v.rotate(Math.PI / 4)} aria-label="Rotate left">
        <RotateCcw className="h-4 w-4" />
      </button>
      <button type="button" className={cn(btn, "border-t border-slate-100")} onClick={() => v.rotate(-Math.PI / 4)} aria-label="Rotate right">
        <RotateCw className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={cn(btn, "border-t border-slate-100")}
        onClick={() => {
          v.home();
          const s = useCommand.getState();
          s.select({ kind: "site", id: s.activeSite });
        }}
        aria-label="Reset view"
      >
        <Home className="h-4 w-4" />
      </button>
    </Card>
  );
}

function SkuIcon({ icon }: { icon: Sku["icon"] }) {
  const c = "h-3.5 w-3.5";
  const el = icon === "cold" ? <Snowflake className={c} /> : icon === "drum" ? <Cylinder className={c} /> : icon === "crate" ? <Boxes className={c} /> : icon === "roll" ? <Package className={c} /> : <Box className={c} />;
  return <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-700">{el}</span>;
}

function Header({ eyebrow, title, sub, onClose }: { eyebrow: string; title: string; sub: string; onClose?: () => void }) {
  return (
    <div className="flex items-start gap-2 border-b border-slate-100 px-4 pb-3 pt-3.5">
      <div className="min-w-0 flex-1">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-0.5 truncate text-[17px] font-bold leading-tight text-slate-900">{title}</h2>
        <p className="truncate text-[12px] text-slate-500">{sub}</p>
      </div>
      <div className="flex shrink-0 items-center gap-0.5 text-slate-400">
        <span className="flex h-7 w-7 items-center justify-center rounded-md" aria-hidden>
          <Pin className="h-3.5 w-3.5" />
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-md" aria-hidden>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
        {onClose && (
          <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBlock({ tone, label, detail, progress }: { tone: Tone; label: string; detail: string; progress?: number }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Pill tone={tone}>{label}</Pill>
        <span className="truncate text-[12px] text-slate-600">{detail}</span>
      </div>
      {progress !== undefined && <Bar value={progress} tone={tone === "route" ? "dock" : tone} className="mt-2" />}
    </div>
  );
}

function Action({ children, onClick, disabled, tone = "primary" }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; tone?: "primary" | "ghost" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-9 flex-1 rounded-lg px-3 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
        tone === "primary" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
      )}
    >
      {children}
    </button>
  );
}

function SiteInspector({ w }: { w: CommandStore }) {
  const site = w.activeSite;
  const def = siteById[site];
  const k = siteKpis(w, site);
  const skus = skuStatus(w, site);
  const fleet = Object.values(w.forklifts).filter((f) => f.site === site);
  const working = fleet.filter((f) => f.status === "working").length;
  const select = w.select;
  const u = w.progress.upgrades;
  const canDock = (u.docks[site] ?? 0) < def.spareDocks;
  return (
    <>
      <Header eyebrow={`${def.typeLabel} · ${site}`} title={def.name} sub={def.address} />
      <div className="space-y-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
          <Pill tone={k.docksOut ? "wait" : "good"}>{k.docksOut ? "Degraded" : "Operational"}</Pill>
          <span>
            {k.docked} docked · {k.arriving} arriving · {k.staged} staged
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-[11px] text-slate-500">Stock on hand</p>
            <p className="text-[15px] font-bold text-slate-900">
              {fmt(k.stock)} <span className="text-[11px] font-medium text-slate-400">/ {fmt(k.capacity)}</span>
            </p>
            <Bar value={k.fill} className="mt-1.5" />
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-[11px] text-slate-500">Truck bays</p>
            <p className="text-[15px] font-bold text-slate-900">
              {k.docksBusy} <span className="text-[11px] font-medium text-slate-400">/ {k.docksTotal} busy</span>
            </p>
            <Bar value={k.docksBusy / Math.max(1, k.docksTotal)} tone="work" className="mt-1.5" />
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-[11px] text-slate-500">Outbound today</p>
            <p className="text-[15px] font-bold text-slate-900">
              {k.outboundToday} <span className="text-[11px] font-medium text-slate-400">trucks</span>
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-[11px] text-slate-500">Put-aways today</p>
            <p className="text-[15px] font-bold text-slate-900">
              {k.putawaysToday} <span className="text-[11px] font-medium text-slate-400">pallets</span>
            </p>
          </div>
        </div>
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Inventory</p>
          <ul>
            {skus.map((s) => (
              <li key={s.id} className="flex items-center gap-2 border-t border-slate-100 py-1.5 text-[12px] first:border-t-0">
                <SkuIcon icon={s.icon} />
                <span className="min-w-0 flex-1 truncate font-medium text-slate-800">{s.name}</span>
                <span className="font-mono text-slate-500">{fmt(s.units)}</span>
                <Pill tone={s.low ? "wait" : "good"}>{s.low ? "Low stock" : "In stock"}</Pill>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Forklift fleet</p>
            <span className="text-[11px] text-slate-500">
              {working}/{fleet.length} working
            </span>
          </div>
          <ul>
            {fleet.map((f) => {
              const s = forkliftStatus(w, f.id);
              return (
                <li key={f.id}>
                  <button type="button" onClick={() => select({ kind: "forklift", id: f.id })} className="flex w-full items-center gap-2 border-t border-slate-100 py-1.5 text-left text-[12px] first:border-t-0 hover:bg-slate-50">
                    <span className="w-11 font-mono font-semibold text-slate-900">{f.id}</span>
                    <span className="min-w-0 flex-1 truncate text-slate-600">
                      {s.label} {f.status === "working" ? s.detail : ""}
                    </span>
                    <span className="w-16">
                      <Bar value={f.battery / 100} tone={f.battery < 25 ? "wait" : "work"} />
                    </span>
                    <span className="w-8 text-right font-mono text-[11px] text-slate-500">{Math.round(f.battery)}%</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Upgrades · {w.progress.credits} credits</p>
          <div className="grid grid-cols-2 gap-1.5">
            <Action tone="ghost" disabled={!canDock || w.progress.credits < 800} onClick={() => w.buyUpgrade("dock", site)}>
              {canDock ? "Open a bay · 800" : "All bays open"}
            </Action>
            <Action tone="ghost" disabled={(u.forklifts[site] ?? 0) >= 2 || w.progress.credits < 400} onClick={() => w.buyUpgrade("forklift", site)}>
              Forklift · 400
            </Action>
            <Action tone="ghost" disabled={u.fastCharge || w.progress.credits < 300} onClick={() => w.buyUpgrade("fastCharge", site)}>
              {u.fastCharge ? "Fast charge ✓" : "Fast charge · 300"}
            </Action>
            <Action tone="ghost" disabled={u.coldRoom || w.progress.credits < 500} onClick={() => w.buyUpgrade("coldRoom", "NL-01")}>
              {u.coldRoom ? "Cold room ✓" : "Cold room · 500"}
            </Action>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Upgrades apply from the next shift.</p>
        </div>
      </div>
    </>
  );
}

function TruckInspector({ w, id }: { w: CommandStore; id: string }) {
  const t = w.trucks[id];
  if (!t) return <SiteInspector w={w} />;
  const c = carriers[t.carrier];
  const s = truckStatus(w, t);
  const sh = w.shipments[t.shipment];
  const dock = t.dock ? w.docks[t.dock] : null;
  const def = siteById[t.site];
  const sku = def.skus.find((x) => x.id === t.sku);
  const free = Object.values(w.docks).filter((d) => d.site === t.site && d.status === "available");
  const moving = ["arriving", "departing"].includes(t.phase);
  return (
    <>
      <Header eyebrow={c.eyebrow} title={t.id} sub={`${t.driver} · ${t.plate}`} onClose={() => w.select({ kind: "site", id: t.site }, false)} />
      <div className="space-y-3 px-4 py-3">
        <StatusBlock tone={s.tone} label={s.label} detail={s.detail} progress={s.progress} />
        {t.phase === "atGate" && (
          <div className="flex flex-wrap gap-1.5">
            {free.length === 0 && <p className="text-[12px] text-amber-700">No free bay. Finish a truck, or clear a fault.</p>}
            {free.map((d) => (
              <Action key={d.id} onClick={() => w.sendTruckToDock(t.id, d.id)}>
                Send to {d.label}
              </Action>
            ))}
          </div>
        )}
        <div>
          <Row label="Shipment">
            <span className="font-mono text-indigo-600">#{sh?.id}</span>
          </Row>
          <Row label="Customer">{sh?.customer}</Row>
          <Row label="Destination">{sh?.destination}</Row>
          <Row label="ETA">{t.phase === "enroute" ? minutes(t.eta) : t.phase === "atGate" ? "At the gate" : "On site"}</Row>
          <Row label="Speed">{t.phase === "enroute" ? "72 km/h" : moving ? "12 km/h" : t.phase === "reversing" ? "4 km/h" : "0 km/h"}</Row>
          <Row label="Bay">{dock ? `${t.site} · ${dock.label}` : "Not assigned"}</Row>
          <Row label="Cargo">
            {t.done}/{t.pallets} pallets · {sku?.name ?? t.sku}
          </Row>
          {sh?.rush && (
            <Row label="Priority">
              <Pill tone="wait">Rush</Pill>
            </Row>
          )}
        </div>
      </div>
    </>
  );
}

function ForkliftInspector({ w, id }: { w: CommandStore; id: string }) {
  const f = w.forklifts[id];
  if (!f) return <SiteInspector w={w} />;
  const s = forkliftStatus(w, id);
  const docks = Object.values(w.docks).filter((d) => d.site === f.site && d.truck && w.trucks[d.truck]?.phase === "docked");
  const moving = f.t < 1;
  return (
    <>
      <Header eyebrow={`Forklift · ${f.site}`} title={f.id} sub={`${f.operator} · ${f.model}`} onClose={() => w.select({ kind: "site", id: f.site }, false)} />
      <div className="space-y-3 px-4 py-3">
        <StatusBlock tone={s.tone} label={s.label} detail={s.detail} progress={f.status === "working" ? s.progress : undefined} />
        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-1.5 text-slate-500">
              <BatteryCharging className="h-3.5 w-3.5" /> Battery
            </span>
            <span className="font-mono font-semibold text-slate-900">{Math.round(f.battery)}%</span>
          </div>
          <Bar value={f.battery / 100} tone={f.battery < 25 ? "wait" : "work"} className="mt-2" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Action tone="ghost" disabled={["charging", "toCharger", "broken"].includes(f.status)} onClick={() => w.chargeForklift(f.id)}>
            <Zap className="mr-1 inline h-3.5 w-3.5" />
            Send to charge
          </Action>
          {docks.slice(0, 3).map((d) => (
            <Action key={d.id} disabled={f.status === "broken" || f.dock === d.id || f.battery < 10} onClick={() => w.assignForklift(f.id, d.id)}>
              Work {d.label}
            </Action>
          ))}
        </div>
        <div>
          <Row label="Carrying">{f.carrying ? "1 pallet" : "Empty"}</Row>
          <Row label="Moves today">{f.moves}</Row>
          <Row label="Speed">{moving && f.status !== "charging" ? "12 km/h" : "0 km/h"}</Row>
          <Row label="Charger">{f.charger ? f.charger.split("-").pop() : "—"}</Row>
          <Row label="Site">{siteById[f.site].name}</Row>
        </div>
      </div>
    </>
  );
}

function PalletInspector({ w, id }: { w: CommandStore; id: string }) {
  const p = w.pallets[id];
  if (!p) return <SiteInspector w={w} />;
  const sku = siteById[p.site].skus.find((s) => s.id === p.sku);
  return (
    <>
      <Header eyebrow={`Pallet · ${sku?.icon === "cold" ? "Chilled" : "Dry goods"}`} title={sku?.name ?? p.sku} sub={p.id} onClose={() => w.select({ kind: "site", id: p.site }, false)} />
      <div className="space-y-3 px-4 py-3">
        <StatusBlock tone="dock" label="Staged" detail={p.location} />
        <div>
          <Row label="Quantity">{fmt(p.quantity)} units</Row>
          <Row label="Gross weight">{fmt(p.weightKg)} kg</Row>
          <Row label="Location">{p.location}</Row>
          <Row label="Lot">{p.lot}</Row>
          <Row label="Received">{p.received}</Row>
          <Row label="Site">{siteById[p.site].name}</Row>
        </div>
      </div>
    </>
  );
}

function ChargerInspector({ w, id }: { w: CommandStore; id: string }) {
  const c = w.chargers[id];
  if (!c) return <SiteInspector w={w} />;
  const f = c.forklift ? w.forklifts[c.forklift] : null;
  const rate = 8 * (w.progress.upgrades.fastCharge ? 1.5 : 1);
  return (
    <>
      <Header eyebrow={`Charger · ${c.site}`} title={id.split("-").pop()!} sub="Lithium-ion fast charger" onClose={() => w.select({ kind: "site", id: c.site }, false)} />
      <div className="space-y-3 px-4 py-3">
        <StatusBlock tone={f ? "wait" : "good"} label={f ? "In use" : "Free"} detail={f ? `${f.id} at ${Math.round(f.battery)}%` : "Ready for the next forklift"} progress={f ? f.battery / 100 : undefined} />
        <div>
          <Row label="Forklift">{f ? `${f.id} · ${Math.round(f.battery)}%` : "—"}</Row>
          <Row label="Sessions today">{c.sessions}</Row>
          <Row label="Energy today">{c.energyKwh.toFixed(1)} kWh</Row>
          <Row label="Charge rate">{(rate / 60).toFixed(2)}%/min sim · {rate}%/s live</Row>
          <Row label="Site">{siteById[c.site].name}</Row>
        </div>
      </div>
    </>
  );
}

function DockInspector({ w, id }: { w: CommandStore; id: string }) {
  const d = w.docks[id];
  if (!d) return <SiteInspector w={w} />;
  const t = d.truck ? w.trucks[d.truck] : null;
  const hands = Object.values(w.forklifts).filter((f) => f.dock === id && f.status === "working");
  return (
    <>
      <Header eyebrow={`Dock · ${d.site}`} title={d.label} sub={siteById[d.site].name} onClose={() => w.select({ kind: "site", id: d.site }, false)} />
      <div className="space-y-3 px-4 py-3">
        <StatusBlock
          tone={d.status === "out" ? "bad" : d.status === "busy" ? "work" : "idle"}
          label={d.status === "out" ? "Out of service" : d.status === "busy" ? "Busy" : "Available"}
          detail={d.status === "out" && d.outUntil ? `Back at ${fmtClock(d.outUntil)}` : t ? `${t.id} · ${t.done}/${t.pallets} pallets` : "Waiting for a truck"}
          progress={t ? t.done / t.pallets : undefined}
        />
        <div className="flex gap-1.5">
          <Action tone="ghost" disabled={!!d.truck && d.status !== "out"} onClick={() => w.toggleDock(id)}>
            {d.status === "out" ? "Return to service" : "Take out of service"}
          </Action>
          {t && (
            <Action onClick={() => w.select({ kind: "truck", id: t.id })}>
              Open {t.id}
            </Action>
          )}
        </div>
        <div>
          <Row label="Truck">{t ? `${t.id} · ${carriers[t.carrier].name}` : "—"}</Row>
          <Row label="Forklifts">{hands.length ? hands.map((f) => f.id).join(", ") : "—"}</Row>
        </div>
      </div>
    </>
  );
}

export function Inspector() {
  const w = useCommand();
  const sel = w.selection;
  let body: React.ReactNode;
  if (!sel || sel.kind === "site") body = <SiteInspector w={w} />;
  else if (sel.kind === "truck") body = <TruckInspector w={w} id={sel.id} />;
  else if (sel.kind === "forklift") body = <ForkliftInspector w={w} id={sel.id} />;
  else if (sel.kind === "pallet") body = <PalletInspector w={w} id={sel.id} />;
  else if (sel.kind === "charger") body = <ChargerInspector w={w} id={sel.id} />;
  else body = <DockInspector w={w} id={sel.id} />;
  return <Card className="max-h-full overflow-y-auto">{body}</Card>;
}
