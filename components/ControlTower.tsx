"use client";

import { useEffect, useState } from "react";
import CountUp from "./CountUp";
import experience from "@/data/experience.json";
import beliefs from "@/data/beliefs.json";

const kpis = [
  { prefix: "", value: 450, suffix: "M+", unit: "EUR", label: "Annual purchasing volume" },
  { prefix: "", value: 98, suffix: "%", unit: "from 85%", label: "Supply availability, chip shortage" },
  { prefix: "−", value: 20, suffix: "%", unit: "1,500+ parts / yr", label: "Sourcing lead time" },
  { prefix: "~", value: 2200, suffix: "", unit: "hours / yr", label: "Saved by automation" },
  { prefix: "", value: 1000, suffix: "+", unit: "suppliers", label: "Global supply base" },
  { prefix: "", value: 10, suffix: "", unit: "specialists", label: "Team, with budget ownership" },
];

// Schematic (not geographic) layout of the network I have planned across.
const hub = { name: "Lund", x: 300, y: 112 };
const nodes = [
  { name: "Sweden", x: 210, y: 46, role: "Factory" },
  { name: "Italy", x: 330, y: 218, role: "Factory" },
  { name: "Portugal", x: 160, y: 196, role: "Supplier" },
  { name: "Austria", x: 430, y: 178, role: "Supplier" },
  { name: "China", x: 548, y: 96, role: "Supplier" },
  { name: "USA", x: 52, y: 120, role: "Supplier" },
];

const log = [
  { tag: "RESOLVED", text: "Order-confirmation automation through an SAP defect: ~9 h saved per day" },
  { tag: "SHIPPED", text: "Optimus Prime AI agent: query and review time cut by over 90% for 50+ users" },
  { tag: "RECOVERED", text: "Semiconductor shortage: availability back from 85% to 98%" },
  { tag: "IMPROVED", text: "On-time delivery +25% through capacity scenario modelling" },
  { tag: "CLEARED", text: "Sourcing backlog −45% after automating case creation" },
  { tag: "STANDARDISED", text: "Global S&OP planning model, the foundation for IBP" },
  ...beliefs.map((b) => ({ tag: "PRINCIPLE", text: b.title })),
];

function Clock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Stockholm" }).format(new Date());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(fmt());
    const id = window.setInterval(() => setTime(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time ?? "--:--:--"} · MALMÖ</span>;
}

function NetworkMap() {
  const h = hub;
  return (
    <svg viewBox="0 0 600 260" className="h-auto w-full" role="img" aria-label={`Schematic of the supply network planned across ${nodes.map((n) => n.name).join(", ")}, coordinated from Lund`}>
      <defs>
        <pattern id="ct-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.12)" />
        </pattern>
      </defs>
      <rect width="600" height="260" fill="url(#ct-grid)" />
      {nodes.map((n, i) => {
        const p = n;
        const mx = (p.x + h.x) / 2;
        const my = (p.y + h.y) / 2 - 22 - Math.abs(p.x - h.x) * 0.08;
        const d = `M${h.x},${h.y} Q${mx},${my} ${p.x},${p.y}`;
        return (
          <g key={n.name}>
            <path d={d} fill="none" stroke="rgba(129,140,248,0.35)" strokeWidth={1.5} />
            <path d={d} fill="none" stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 14" className="motion-safe:animate-[ct-flow_2.4s_linear_infinite]" style={{ animationDelay: `${i * -0.4}s` }} />
            <circle cx={p.x} cy={p.y} r={4.5} fill={n.role === "Factory" ? "#2dd4bf" : "#818cf8"} stroke="#0a0a0a" strokeWidth={2} />
            <text x={p.x} y={p.y + 20} textAnchor="middle" className="fill-neutral-300 font-mono text-[12px]">
              {n.name}
            </text>
          </g>
        );
      })}
      <circle cx={h.x} cy={h.y} r={10} fill="none" stroke="#fbbf24" strokeWidth={1.5} className="motion-safe:animate-ping" style={{ transformOrigin: `${h.x}px ${h.y}px` }} />
      <circle cx={h.x} cy={h.y} r={6} fill="#fbbf24" stroke="#0a0a0a" strokeWidth={2} />
      <text x={h.x + 12} y={h.y + 4} className="fill-amber-300 font-mono text-[12px] font-semibold">
        LUND · CONTROL
      </text>
    </svg>
  );
}

/**
 * "Planning cockpit" that replaces the old working-with-me and beliefs cards:
 * headline KPIs, the network I plan across, an event log of career wins and
 * principles, and the capability stack. All numbers come from experience.json.
 */
export default function ControlTower() {
  return (
    <section aria-labelledby="tower-heading" className="mb-12 overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
      <style>{`@keyframes ct-flow { to { stroke-dashoffset: -36; } } @keyframes ct-marquee { to { transform: translateX(-50%); } }`}</style>

      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <h2 id="tower-heading" className="font-mono text-xs font-semibold uppercase tracking-[0.2em]">
            Control tower · Career & capabilities
          </h2>
        </div>
        <span className="font-mono text-[10px] tracking-widest text-neutral-500">
          <Clock />
        </span>
      </header>

      <dl className="grid grid-cols-2 gap-px bg-neutral-800 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="flex flex-col bg-neutral-950 px-4 py-4">
            <dt className="order-last mt-1 block text-xs leading-snug text-neutral-400">{k.label}</dt>
            <dd>
              <span className="sr-only">
                {k.prefix}
                {k.value.toLocaleString("en-US")}
                {k.suffix} {k.unit}
              </span>
              <span className="font-mono text-2xl font-bold text-white sm:text-3xl" aria-hidden>
                {k.prefix}
                <CountUp to={k.value} separator="," duration={1.6} />
                {k.suffix}
              </span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-amber-300" aria-hidden>{k.unit}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-px bg-neutral-800 lg:grid-cols-[1.4fr_1fr]">
        <div className="bg-neutral-950 p-5">
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            <span>Network planned across</span>
            <span className="flex gap-3">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-teal-400" />Factory</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-400" />Supplier</span>
            </span>
          </div>
          <NetworkMap />
          <p className="mt-2 text-xs text-neutral-400">
            9 key products, 2 internal factories and 12+ external suppliers across 6 countries, scheduled from Lund.
          </p>
        </div>

        <div className="bg-neutral-950 p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500">Event log</p>
          <ul className="space-y-2.5">
            {log.slice(0, 6).map((e) => (
              <li key={e.text} className="flex gap-3 text-sm">
                <span className="mt-0.5 w-[5.75rem] shrink-0 rounded border border-neutral-700 py-0.5 text-center font-mono text-[9px] tracking-wider text-emerald-300">{e.tag}</span>
                <span className="leading-snug text-neutral-200">{e.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-800 bg-neutral-950 p-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500">Capability stack</p>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {experience.competencies.map((c) => (
            <li key={c.area} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
              <p className="text-sm font-semibold text-white">{c.area}</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-400">{c.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative overflow-hidden border-t border-neutral-800 bg-neutral-900 py-2" aria-hidden>
        <div className="flex w-max gap-10 whitespace-nowrap font-mono text-[11px] text-neutral-400 motion-safe:animate-[ct-marquee_60s_linear_infinite]">
          {[...log, ...log].map((e, i) => (
            <span key={i}>
              <span className="text-amber-300">{e.tag}</span> · {e.text}
            </span>
          ))}
        </div>
      </div>
      <ul className="sr-only">
        {beliefs.map((b) => (
          <li key={b.title}>Principle: {b.title}. {b.body}</li>
        ))}
      </ul>
    </section>
  );
}
