"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Twin, disruptionInfo, policyInfo, type ScenarioEvent } from "@/lib/twin/engine";
import type { DisruptionId, Params, PolicyId } from "@/lib/twin/model";
import type { PolicySummary } from "@/lib/twin/montecarlo";

const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading 3D network…</div>,
});

const SPEEDS = [1, 4, 12] as const;
const CHALLENGE_DAYS = 120;
const CHALLENGE_EVENTS: ScenarioEvent[] = [
  { id: "supplierOutage", day: 15 },
  { id: "demandSpike", day: 70 },
];

const eur = (v: number) =>
  v >= 1e6 ? `€${(v / 1e6).toFixed(2)}M` : v >= 1e3 ? `€${(v / 1e3).toFixed(0)}k` : `€${v.toFixed(0)}`;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

function Slider({ label, value, min, max, step, format, onChange }: { label: string; value: number; min: number; max: number; step: number; format: (v: number) => string; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono text-muted-foreground">{format(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1.5 w-full accent-[#4f46e5]" />
    </label>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 320;
  const H = 72;
  if (values.length < 2) return <div className="h-[72px]" />;
  const x = (i: number) => (i / (values.length - 1)) * W;
  const y = (v: number) => H - 4 - Math.max(0, Math.min(1, (v - 0.4) / 0.6)) * (H - 8);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[72px] w-full"
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setHover(Math.round(((e.clientX - r.left) / r.width) * (values.length - 1)));
        }}
        role="img"
        aria-label={`Daily fill rate over the last ${values.length} days, latest ${pct(values.at(-1) ?? 1)}`}
      >
        <line x1={0} x2={W} y1={y(0.95)} y2={y(0.95)} stroke="currentColor" className="text-muted-foreground/40" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="#4f46e5" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={0} y2={H} stroke="currentColor" className="text-foreground/40" vectorEffect="non-scaling-stroke" />}
      </svg>
      <span className="pointer-events-none absolute right-0 top-0 font-mono text-[10px] text-muted-foreground">95% target</span>
      {hover !== null && (
        <span className="pointer-events-none absolute -top-6 rounded bg-foreground px-1.5 py-0.5 font-mono text-[10px] text-background" style={{ left: `${(hover / (values.length - 1)) * 100}%`, transform: "translateX(-50%)" }}>
          {pct(values[hover])}
        </span>
      )}
    </div>
  );
}

/**
 * Interactive supply chain twin: a live discrete-event simulation with
 * adjustable parameters, injectable disruptions, policy comparison via Monte
 * Carlo in a Web Worker, a 3D view of the network, and a 120-day challenge.
 */
export default function TwinLab() {
  const [policy, setPolicy] = useState<PolicyId>("sQ");
  const [params, setParams] = useState<Params>({ demand: 1, leadTime: 1, capacity: 1, safetyDays: 4 });
  // The engine is a mutable simulation; `tick` re-renders after each day.
  const [twin, setTwin] = useState(() => new Twin({ policy: "sQ", seed: 42 }));
  const twinRef = useRef(twin);
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(4);
  const [selected, setSelected] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<{ active: boolean; done: boolean }>({ active: false, done: false });
  const [compare, setCompare] = useState<{ loading: boolean; results: PolicySummary[] | null }>({ loading: false, results: null });
  const [lite, setLite] = useState(false);
  const dayFraction = useRef(0);

  useEffect(() => {
    twinRef.current = twin;
  }, [twin]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLite(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  // Real-time loop: advance whole days at the chosen speed, interpolate between.
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      acc += ((now - last) / 1000) * speed;
      last = now;
      let stepped = false;
      while (acc >= 1) {
        acc -= 1;
        const t = twinRef.current;
        if (challenge.active) {
          for (const e of CHALLENGE_EVENTS) if (e.day === t.day) t.inject(e.id);
          if (t.day >= CHALLENGE_DAYS) {
            setRunning(false);
            setChallenge({ active: false, done: true });
            break;
          }
        }
        t.step();
        stepped = true;
      }
      dayFraction.current = acc;
      if (stepped) setTick((n) => n + 1);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, speed, challenge.active]);

  const reset = useCallback((next?: { policy?: PolicyId; params?: Params }) => {
    const fresh = new Twin({ policy: next?.policy ?? policy, params: next?.params ?? params, seed: 42 });
    twinRef.current = fresh;
    setTwin(fresh);
    dayFraction.current = 0;
    setTick((n) => n + 1);
  }, [policy, params]);

  const updateParam = (key: keyof Params, value: number) => {
    const next = { ...params, [key]: value };
    setParams(next);
    twinRef.current.params = next;
  };

  const changePolicy = (p: PolicyId) => {
    setPolicy(p);
    twinRef.current.policy = p;
  };

  const startChallenge = () => {
    reset();
    setChallenge({ active: true, done: false });
    setCompare({ loading: false, results: null });
    setRunning(true);
  };

  const runCompare = () => {
    setCompare({ loading: true, results: null });
    const worker = new Worker(new URL("../../lib/twin/montecarlo.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<PolicySummary[]>) => {
      setCompare({ loading: false, results: e.data });
      worker.terminate();
    };
    worker.onerror = () => {
      setCompare({ loading: false, results: null });
      worker.terminate();
    };
    worker.postMessage({ policies: ["sQ", "RS", "expedite"], runs: 60, params, events: CHALLENGE_EVENTS, days: CHALLENGE_DAYS });
  };

  const k = twin.kpis();
  const series = useMemo(() => twin.history.map((h) => h.fillRate), [twin, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const score = Math.round(k.fillRate * 1000 - (k.logisticsCost + k.holdingCost) / 2000 - k.co2Tonnes / 10);
  const site = selected ? twin.site(selected) : null;
  const siteState = selected ? twin.sites[selected] : null;

  const kpiTiles = [
    { label: "Fill rate", value: pct(k.fillRate), warn: k.fillRate < 0.95 },
    { label: "DC service level", value: pct(k.serviceLevel), warn: k.serviceLevel < 0.95 },
    { label: "Backorders", value: k.backorders.toLocaleString("en-US"), warn: k.backorders > 0 },
    { label: "Inventory value", value: eur(k.inventoryValue) },
    { label: "Logistics + holding", value: eur(k.logisticsCost + k.holdingCost) },
    { label: "Expedite premium", value: eur(k.expediteCost) },
    { label: "CO₂", value: `${k.co2Tonnes.toFixed(0)} t` },
    { label: "Recovery time", value: k.recovering ? "Recovering…" : k.recoveryDays === null ? "n/a" : k.recoveryDays === 0 ? "No dip" : `${k.recoveryDays} days`, warn: k.recovering },
  ];

  return (
    <div className="space-y-4">
      {/* Transport controls */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3">
        <span className="font-mono text-sm font-bold text-foreground">DAY {String(k.day).padStart(3, "0")}</span>
        <button type="button" onClick={() => setRunning((r) => !r)} className="min-h-10 rounded-lg bg-foreground px-4 text-sm font-medium text-background">
          {running ? "Pause" : "Play"}
        </button>
        <div className="inline-flex rounded-lg border border-border p-0.5" role="group" aria-label="Simulation speed">
          {SPEEDS.map((s) => (
            <button key={s} type="button" aria-pressed={speed === s} onClick={() => setSpeed(s)} className={cn("min-h-9 rounded-md px-2.5 font-mono text-xs", speed === s ? "bg-muted font-bold text-foreground" : "text-muted-foreground")}>
              {s} d/s
            </button>
          ))}
        </div>
        <button type="button" onClick={() => reset()} className="min-h-10 rounded-lg border border-border px-3 text-sm">
          Reset
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Policy</span>
          <select value={policy} onChange={(e) => changePolicy(e.target.value as PolicyId)} className="min-h-10 rounded-lg border border-border bg-background px-2 text-sm">
            {(Object.keys(policyInfo) as PolicyId[]).map((p) => (
              <option key={p} value={p}>
                {policyInfo[p].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* 3D network */}
        <div className="relative h-[320px] overflow-hidden rounded-2xl border border-border bg-[#f8fafc] sm:h-[460px]">
          <Scene3D twin={twin} tick={tick} dayFraction={dayFraction} selected={selected} onSelect={setSelected} lite={lite} />
          <div className="pointer-events-none absolute left-2 right-2 top-2 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-600 sm:left-3 sm:top-3">
            {[
              ["#64748b", "Supplier"],
              ["#4f46e5", "Plant"],
              ["#14b8a6", "DC"],
              ["#f59e0b", "Market"],
              ["#ef4444", "Stocked out"],
            ].map(([c, l]) => (
              <span key={l} className="flex items-center gap-1 rounded bg-white/85 px-1.5 py-0.5">
                <span className="h-2 w-2 rounded-sm" style={{ background: c }} />
                {l}
              </span>
            ))}
          </div>
          {!site && (
            <p className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] text-slate-500">Tap a site for live status · drag to orbit</p>
          )}
          {site && siteState && (
            <div className="absolute bottom-2 left-2 max-w-[12rem] rounded-xl border border-border bg-white/95 p-2 text-[10px] shadow-sm sm:bottom-3 sm:left-3 sm:max-w-[15rem] sm:p-3 sm:text-xs" aria-live="polite">
              <p className="font-semibold text-foreground">{site.name}</p>
              <p className="text-muted-foreground">{site.country} · {site.kind.toUpperCase()}</p>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono">
                {site.kind !== "market" && site.kind !== "supplier" && (<><dt className="text-muted-foreground">On hand</dt><dd className="text-right">{siteState.onHand.toLocaleString("en-US")}</dd></>)}
                {site.kind === "plant" && (<><dt className="text-muted-foreground">Components</dt><dd className="text-right">{siteState.components.toLocaleString("en-US")}</dd><dt className="text-muted-foreground">Made today</dt><dd className="text-right">{siteState.producedToday}</dd></>)}
                {(site.kind === "dc" || site.kind === "plant") && (<><dt className="text-muted-foreground">Backorder</dt><dd className="text-right">{siteState.backorder.toLocaleString("en-US")}</dd><dt className="text-muted-foreground">Inbound</dt><dd className="text-right">{twin.inTransitTo(site.id).toLocaleString("en-US")}</dd></>)}
                {site.kind === "market" && (<><dt className="text-muted-foreground">Mean demand</dt><dd className="text-right">{Math.round(twin.meanDemand(site.id))}/day</dd></>)}
                {site.kind === "supplier" && (<><dt className="text-muted-foreground">Status</dt><dd className="text-right">{site.id === "S1" && twin.isActive("supplierOutage") ? "DOWN" : "Shipping"}</dd></>)}
              </dl>
            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Live KPIs</p>
          <dl className="grid grid-cols-2 gap-2">
            {kpiTiles.map((t) => (
              <div key={t.label} className="rounded-xl border border-border px-3 py-2">
                <dt className="text-[11px] text-muted-foreground">{t.label}</dt>
                <dd className={cn("font-mono text-lg font-bold", t.warn ? "text-red-600" : "text-foreground")}>{t.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mb-1 mt-4 text-[11px] text-muted-foreground">Daily fill rate</p>
          <Sparkline values={series} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Parameters */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Parameters (live)</p>
          <Slider label="Demand" value={params.demand} min={0.5} max={1.8} step={0.05} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => updateParam("demand", v)} />
          <Slider label="Lead time" value={params.leadTime} min={0.5} max={2.5} step={0.05} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => updateParam("leadTime", v)} />
          <Slider label="Plant capacity" value={params.capacity} min={0.5} max={1.5} step={0.05} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => updateParam("capacity", v)} />
          <Slider label="Safety stock" value={params.safetyDays} min={0} max={21} step={1} format={(v) => `${v} days`} onChange={(v) => updateParam("safetyDays", v)} />
        </div>

        {/* Disruptions + challenge */}
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Disruptions</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(disruptionInfo) as DisruptionId[]).map((id) => {
              const active = twin.isActive(id);
              return (
                <button
                  key={id}
                  type="button"
                  disabled={active}
                  onClick={() => {
                    twin.inject(id);
                    setTick((n) => n + 1);
                  }}
                  title={disruptionInfo[id].detail}
                  className={cn("min-h-11 rounded-lg border px-2 py-1.5 text-left text-xs transition-colors", active ? "border-red-300 bg-red-50 text-red-700" : "border-border hover:border-foreground")}
                >
                  <span className="block font-semibold">{disruptionInfo[id].label}</span>
                  <span className="block text-[10px] opacity-75">{active ? "Active" : `${disruptionInfo[id].days} days`}</span>
                </button>
              );
            })}
          </div>
          <div className="rounded-xl border border-dashed border-border p-3">
            <p className="text-sm font-semibold text-foreground">120-day challenge</p>
            <p className="mt-1 text-xs text-muted-foreground">A supplier outage hits on day 15 and a demand spike on day 70. Pick a policy and tune safety stock, then keep the fill rate high without burning cash or CO₂.</p>
            {challenge.done ? (
              <p className="mt-2 font-mono text-sm">
                Score <span className="text-lg font-bold text-primary">{score}</span> · fill {pct(k.fillRate)} · {eur(k.logisticsCost + k.holdingCost)} · {k.co2Tonnes.toFixed(0)} t
              </p>
            ) : challenge.active ? (
              <p className="mt-2 font-mono text-xs text-muted-foreground">Running… day {k.day} of {CHALLENGE_DAYS}</p>
            ) : null}
            <button type="button" onClick={startChallenge} className="mt-2 min-h-10 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground">
              {challenge.done ? "Play again" : "Start challenge"}
            </button>
          </div>
        </div>

        {/* Event log */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Event log</p>
          <ul className="max-h-[260px] space-y-1.5 overflow-y-auto text-xs" aria-live="polite">
            {twin.events.length === 0 && <li className="text-muted-foreground">Steady state. Inject a disruption to see the network react.</li>}
            {twin.events.slice(0, 20).map((e, i) => (
              <li key={`${e.day}-${i}`} className="flex gap-2">
                <span className="w-10 shrink-0 font-mono text-muted-foreground">D{e.day}</span>
                <span className={cn(e.tone === "warn" ? "text-red-700" : e.tone === "good" ? "text-emerald-700" : "text-foreground")}>{e.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Monte Carlo */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">Compare policies with Monte Carlo</p>
            <p className="text-xs text-muted-foreground">60 seeded runs per policy of the challenge scenario, using your current parameters. Runs in a background worker.</p>
          </div>
          <button type="button" onClick={runCompare} disabled={compare.loading} className="min-h-10 rounded-lg border border-foreground px-3 text-sm font-medium disabled:opacity-50">
            {compare.loading ? "Running 180 simulations…" : "Run comparison"}
          </button>
        </div>
        {compare.results && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-2 font-medium">Policy</th>
                  <th className="py-2 font-medium">Fill rate (P10 to P90)</th>
                  <th className="py-2 font-medium">Cost (mean)</th>
                  <th className="py-2 font-medium">CO₂</th>
                  <th className="py-2 font-medium">Recovery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {compare.results.map((r) => (
                  <tr key={r.policy}>
                    <td className="py-2 font-sans font-medium text-foreground">{policyInfo[r.policy].label}</td>
                    <td className="py-2">{pct(r.fillRate.mean)} <span className="text-muted-foreground">({pct(r.fillRate.p10)} to {pct(r.fillRate.p90)})</span></td>
                    <td className="py-2">{eur(r.totalCost.mean)}</td>
                    <td className="py-2">{r.co2Tonnes.toFixed(0)} t</td>
                    <td className="py-2">{r.recoveryDays === null ? "n/a" : r.recoveryDays === 0 ? "No dip" : `${r.recoveryDays.toFixed(0)} days`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
