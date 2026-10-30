"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// What Shetty's Desk is building, as air traffic: each initiative is a blip
// on the radar scope and a paper flight strip beside it. The sweep is a CSS
// rotation; each blip glows as the sweep passes its bearing.

export type Flight = {
  callsign: string;
  name: string;
  status: "IN SERVICE" | "CRUISING" | "ON APPROACH" | "HOLDING" | "WIP";
  /** Bearing in degrees (0 = up, clockwise) and range 0–1 on the scope. */
  bearing: number;
  range: number;
  route: string;
  note: string;
};

const SWEEP_S = 6;

const tone: Record<Flight["status"], { text: string; blip: string; strip: string }> = {
  "IN SERVICE": { text: "text-emerald-600", blip: "#34d399", strip: "border-l-emerald-500" },
  CRUISING: { text: "text-indigo-600", blip: "#a5b4fc", strip: "border-l-indigo-500" },
  "ON APPROACH": { text: "text-amber-600", blip: "#fbbf24", strip: "border-l-amber-500" },
  HOLDING: { text: "text-sky-600", blip: "#7dd3fc", strip: "border-l-sky-500" },
  WIP: { text: "text-teal-600", blip: "#5eead4", strip: "border-l-teal-500" },
};

export default function AtcRadar({ flights }: { flights: Flight[] }) {
  const [selected, setSelected] = useState(flights[0]?.callsign);
  const R = 140;
  const pos = (f: Flight) => {
    const a = ((f.bearing - 90) * Math.PI) / 180;
    return { x: 160 + Math.cos(a) * f.range * R, y: 160 + Math.sin(a) * f.range * R };
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
      {/* the scope */}
      <div className="relative mx-auto w-full max-w-[380px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#07110d] p-3 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">
          <span>SD approach · radar</span>
          <span>{flights.length} tracks</span>
        </div>
        <svg viewBox="0 0 320 320" className="w-full" role="img" aria-label="Radar scope with the initiatives Shetty's Desk is working on">
          <defs>
            <radialGradient id="atc-bg" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#0d2a1f" />
              <stop offset="1" stopColor="#06120d" />
            </radialGradient>
            <linearGradient id="atc-sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#34d399" stopOpacity="0" />
              <stop offset="1" stopColor="#34d399" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <circle cx="160" cy="160" r="150" fill="url(#atc-bg)" stroke="#1f4d3a" />
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <circle key={r} cx="160" cy="160" r={R * r} fill="none" stroke="#1f4d3a" strokeDasharray={r === 1 ? undefined : "2 4"} />
          ))}
          <line x1="160" y1="12" x2="160" y2="308" stroke="#1f4d3a" />
          <line x1="12" y1="160" x2="308" y2="160" stroke="#1f4d3a" />
          {["N", "E", "S", "W"].map((d, i) => (
            <text key={d} x={160 + [0, 138, 0, -138][i]} y={160 + [-130, 4, 140, 4][i]} textAnchor="middle" className="fill-emerald-400/50 font-mono text-[9px]">
              {d}
            </text>
          ))}
          {/* runway and the desk at the centre */}
          <rect x="154" y="148" width="12" height="24" rx="2" fill="#134e3a" stroke="#34d399" strokeOpacity="0.6" />
          {/* sweep */}
          <g className="origin-center motion-safe:animate-[atc-sweep_6s_linear_infinite]" style={{ transformBox: "view-box", transformOrigin: "160px 160px" }}>
            <path d="M160 160 L160 10 A150 150 0 0 1 266 54 Z" fill="url(#atc-sweep)" />
            <line x1="160" y1="160" x2="266" y2="54" stroke="#34d399" strokeOpacity="0.8" />
          </g>
          {flights.map((f) => {
            const p = pos(f);
            const on = f.callsign === selected;
            // the sweep line sits at 45° when the animation starts
            const delay = (((f.bearing - 45 + 360) % 360) / 360) * SWEEP_S;
            return (
              <g
                key={f.callsign}
                role="button"
                tabIndex={0}
                aria-label={`${f.callsign} ${f.name}, ${f.status}`}
                aria-pressed={on}
                onClick={() => setSelected(f.callsign)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(f.callsign)}
                className="cursor-pointer outline-none"
              >
                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  fill={tone[f.status].blip}
                  className="motion-safe:animate-[atc-blip_6s_linear_infinite]"
                  style={{ animationDelay: `${delay}s` }}
                />
                {on && <circle cx={p.x} cy={p.y} r="10" fill="none" stroke={tone[f.status].blip} strokeWidth="1.5" />}
                <text x={p.x + 9} y={p.y - 7} className="fill-emerald-200 font-mono text-[9px]">
                  {f.callsign}
                </text>
              </g>
            );
          })}
        </svg>
        <style>{`
          @keyframes atc-sweep { to { transform: rotate(360deg); } }
          @keyframes atc-blip { 0% { opacity: 1; } 8% { opacity: 1; } 60% { opacity: .35; } 100% { opacity: .35; } }
        `}</style>
      </div>

      {/* flight progress strips */}
      <ol className="space-y-2">
        {flights.map((f) => {
          const on = f.callsign === selected;
          return (
            <li key={f.callsign}>
              <button
                type="button"
                onClick={() => setSelected(f.callsign)}
                aria-pressed={on}
                className={cn(
                  "grid w-full grid-cols-[4.5rem_1fr] gap-3 rounded-lg border border-l-[6px] border-foreground/15 bg-[#fdfbf3] px-3 py-2.5 text-left font-mono transition-all sm:grid-cols-[5rem_1fr_auto]",
                  tone[f.status].strip,
                  on ? "shadow-[0_10px_24px_-14px_rgba(15,23,42,.5)] ring-1 ring-foreground/20" : "hover:-translate-y-0.5"
                )}
              >
                <span className="text-sm font-bold text-foreground">{f.callsign}</span>
                <span className="min-w-0">
                  <span className="block font-sans text-sm font-semibold text-foreground">{f.name}</span>
                  <span className="block text-[11px] text-muted-foreground">{f.route}</span>
                  {on && <span className="mt-1.5 block font-sans text-[13px] leading-relaxed text-foreground/80">{f.note}</span>}
                </span>
                <span className={cn("col-start-2 text-[11px] font-semibold tracking-wider sm:col-start-auto sm:text-right", tone[f.status].text)}>{f.status}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
