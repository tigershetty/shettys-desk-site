"use client";

import { Bell, ChevronDown, ChevronRight, Map as MapIcon, Pause, Play, Search, Star, Warehouse } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { siteById, sites } from "@/lib/command/data";
import { siteKpis } from "@/lib/command/kpis";
import { fmtClock } from "@/lib/command/sim";
import { useCommand } from "@/lib/command/store";
import type { Selection } from "@/lib/command/types";
import { cn } from "@/lib/utils";

export function LogoCube({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M16 3 28 10v12l-12 7-12-7V10z" fill="#4f46e5" />
      <path d="M16 3 28 10l-12 7-12-7z" fill="#a5b4fc" />
      <path d="M16 17v12l12-7V10z" fill="#4338ca" />
    </svg>
  );
}

function SearchBox() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const select = useCommand((s) => s.select);
  const trucks = useCommand((s) => s.trucks);
  const forklifts = useCommand((s) => s.forklifts);
  const pallets = useCommand((s) => s.pallets);
  const shipments = useCommand((s) => s.shipments);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && target.tagName !== "INPUT") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    const out: { sel: Selection; title: string; sub: string }[] = [];
    for (const s of sites) if (`${s.id} ${s.name}`.toLowerCase().includes(needle)) out.push({ sel: { kind: "site", id: s.id }, title: s.name, sub: `${s.id} · ${s.typeLabel}` });
    for (const t of Object.values(trucks))
      if (t.phase !== "gone" && `${t.id} ${t.driver} ${t.plate}`.toLowerCase().includes(needle)) out.push({ sel: { kind: "truck", id: t.id }, title: t.id, sub: `Truck · ${t.driver} · ${t.site}` });
    for (const f of Object.values(forklifts))
      if (`${f.id} ${f.operator}`.toLowerCase().includes(needle)) out.push({ sel: { kind: "forklift", id: f.id }, title: f.id, sub: `Forklift · ${f.operator} · ${f.site}` });
    for (const p of Object.values(pallets))
      if (`${p.id} ${p.sku} ${p.lot}`.toLowerCase().includes(needle)) out.push({ sel: { kind: "pallet", id: p.id }, title: p.id, sub: `Pallet · ${p.lot} · ${p.site}` });
    for (const s of Object.values(shipments))
      if (trucks[s.truck] && `${s.id} ${s.customer}`.toLowerCase().includes(needle)) out.push({ sel: { kind: "truck", id: s.truck }, title: s.id, sub: `Shipment · ${s.customer}` });
    return out.slice(0, 8);
  }, [q, trucks, forklifts, pallets, shipments]);

  return (
    <div className="relative hidden min-w-[180px] flex-1 @4xl:block @4xl:max-w-sm">
      <label className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-500 focus-within:border-indigo-300 focus-within:bg-white">
        <Search className="h-4 w-4 shrink-0" />
        <input
          ref={input}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) {
              select(results[0].sel);
              setQ("");
              input.current?.blur();
            }
            if (e.key === "Escape") input.current?.blur();
          }}
          placeholder="Search sites, trucks, forklifts, pallets, shipments…"
          className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
          aria-label="Search the network"
        />
        <kbd className="rounded border border-slate-200 bg-white px-1.5 font-mono text-[11px] text-slate-400">/</kbd>
      </label>
      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-11 z-30 overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-xl">
          {results.map((r, i) => (
            <li key={`${r.title}${i}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  select(r.sel);
                  setQ("");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px] hover:bg-indigo-50"
              >
                <span className="font-semibold text-slate-900">{r.title}</span>
                <span className="truncate text-[12px] text-slate-500">{r.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SiteSwitcher() {
  const [open, setOpen] = useState(false);
  const w = useCommand();
  const k = siteKpis(w, w.activeSite);
  const def = siteById[w.activeSite];
  return (
    <div className="relative flex min-w-0 items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 min-w-0 items-center gap-2 rounded-l-full border border-slate-200 bg-white pl-1.5 pr-2 text-[13px] hover:border-indigo-300"
        aria-expanded={open}
        aria-label="Choose a site"
      >
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-600">{def.id}</span>
        <span className="truncate font-semibold text-slate-900">{def.name}</span>
        <span className="hidden whitespace-nowrap text-slate-500 @7xl:inline">
          · {Math.round(k.fill * 100)}% full · {k.docked}/{k.docksTotal} docked
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>
      <button
        type="button"
        onClick={() => w.cycleSite(1)}
        className="flex h-9 w-9 items-center justify-center rounded-r-full border border-l-0 border-slate-200 bg-white text-slate-500 hover:text-indigo-600"
        aria-label="Next site"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      {open && (
        <ul className="absolute left-0 top-11 z-30 w-72 overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-xl">
          {sites.map((s) => {
            const sk = siteKpis(w, s.id);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    w.setSite(s.id);
                    setOpen(false);
                  }}
                  className={cn("flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-indigo-50", s.id === w.activeSite && "bg-indigo-50/60")}
                >
                  <span className="rounded bg-indigo-50 px-1.5 font-mono text-[11px] font-bold text-indigo-600">{s.id}</span>
                  <span className="flex-1 truncate font-medium text-slate-900">{s.name}</span>
                  <span className="text-[12px] text-slate-500">{Math.round(sk.fill * 100)}%</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Notifications() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<string | null>(null);
  const list = useCommand((s) => s.notifications);
  const unread = list.length > 0 && list[0].id !== seen;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSeen(list[0]?.id ?? null);
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-30 w-80 overflow-hidden rounded-xl border border-black/5 bg-white shadow-xl">
          <p className="border-b border-slate-100 px-3 py-2 text-[12px] font-semibold text-slate-900">Notifications</p>
          <ul className="max-h-80 overflow-y-auto">
            {list.length === 0 && <li className="px-3 py-3 text-[12px] text-slate-500">Nothing yet. The shift just started.</li>}
            {list.map((n) => (
              <li key={n.id} className="flex gap-2 border-b border-slate-50 px-3 py-2 text-[12px]">
                <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", n.tone === "good" ? "bg-emerald-500" : n.tone === "warn" ? "bg-amber-500" : "bg-indigo-500")} />
                <span className="flex-1 text-slate-700">{n.text}</span>
                <span className="font-mono text-[11px] text-slate-400">{fmtClock(n.at)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Clock() {
  const clock = useCommand((s) => s.clock);
  const speed = useCommand((s) => s.speed);
  const over = useCommand((s) => s.shiftOver);
  const setSpeed = useCommand((s) => s.setSpeed);
  const [last, setLast] = useState<1 | 2 | 4>(1);
  return (
    <div className="flex items-center gap-1">
      <span className={cn("flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[12px] font-semibold", speed === 0 ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700")}>
        <span className={cn("h-2 w-2 rounded-full", speed === 0 ? "bg-slate-400" : "animate-pulse bg-emerald-500")} />
        {over ? "Shift over" : speed === 0 ? "Paused" : "Live"} <span className="font-mono">{fmtClock(clock)}</span>
      </span>
      <button
        type="button"
        onClick={() => setSpeed(speed === 0 ? last : 0)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
        aria-label={speed === 0 ? "Resume" : "Pause"}
      >
        {speed === 0 ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>
      <div className="hidden items-center rounded-full bg-slate-100 p-0.5 @6xl:flex">
        {([1, 2, 4] as const).map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => {
              setLast(x);
              setSpeed(x);
            }}
            className={cn("h-8 rounded-full px-2 font-mono text-[11px] font-semibold", speed === x ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}
            aria-label={`Speed ${x}x`}
          >
            {x}×
          </button>
        ))}
      </div>
    </div>
  );
}

function ScoreChip() {
  const score = useCommand((s) => s.stats.score);
  const combo = useCommand((s) => s.stats.combo);
  const credits = useCommand((s) => s.progress.credits);
  const shift = useCommand((s) => s.progress.shift);
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 text-[12px]" title="Score this shift · credits to spend on upgrades">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      <span className="font-mono font-bold text-slate-900">{score.toLocaleString("en-US")}</span>
      {combo > 1 && <span className="rounded-full bg-amber-50 px-1.5 font-semibold text-amber-700">×{Math.min(2, 1 + 0.1 * (combo - 1)).toFixed(1)}</span>}
      <span className="hidden whitespace-nowrap text-slate-400 @7xl:inline">Shift {shift} · {credits} cr</span>
    </div>
  );
}

export function TopBar() {
  const view = useCommand((s) => s.view);
  const setView = useCommand((s) => s.setView);
  return (
    <header className="pointer-events-auto relative z-20 flex h-14 items-center gap-2 border-b border-black/[0.06] bg-white px-3 sm:gap-3 sm:px-4">
      <div className="flex shrink-0 items-center gap-2">
        <LogoCube className="h-7 w-7" />
        <span className="hidden whitespace-nowrap text-[14px] font-bold tracking-tight text-slate-900 @7xl:inline">Supply Chain Command</span>
      </div>
      <SearchBox />
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 @4xl:flex-none">
        <button
          type="button"
          onClick={() => setView(view === "network" ? "site" : "network")}
          className={cn(
            "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12px] font-semibold",
            view === "network" ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
          )}
          aria-pressed={view === "network"}
        >
          {view === "network" ? <Warehouse className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
          <span className="hidden @2xl:inline">{view === "network" ? "Yard" : "Network"}</span>
        </button>
        <SiteSwitcher />
      </div>
      <div className="ml-auto hidden shrink-0 items-center gap-1 @5xl:flex">
        <ScoreChip />
        <Clock />
        <Notifications />
        <div className="ml-1 flex items-center gap-2 border-l border-slate-100 pl-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-[12px] font-bold text-white">PS</span>
          <span className="hidden leading-tight @[90rem]:block">
            <span className="block text-[12px] font-semibold text-slate-900">Poornajith Shetty</span>
            <span className="block text-[11px] text-slate-500">Supply Chain Lead</span>
          </span>
        </div>
      </div>
    </header>
  );
}

/** Compact second row for small screens: clock, score and bell. */
export function MobileStatus() {
  return (
    <div className="pointer-events-auto flex items-center justify-between gap-2 border-b border-black/[0.06] bg-white/95 px-3 py-1.5 @5xl:hidden">
      <ScoreChip />
      <div className="flex items-center">
        <Clock />
        <Notifications />
      </div>
    </div>
  );
}
