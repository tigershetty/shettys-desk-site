"use client";

import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import SplitFlap from "./SplitFlap";
import { lines, milestones, type JourneyLine, type JourneyStatus, type Milestone } from "@/data/journey";

const lineOrder: JourneyLine[] = ["education", "career", "projects", "ventures"];

const statusStyle: Record<JourneyStatus, string> = {
  LANDED: "text-neutral-400",
  "NOW BOARDING": "text-emerald-400 animate-pulse",
  "IN FLIGHT": "text-amber-300",
  SCHEDULED: "text-sky-300",
};

// Stations that connect two lines on the metro map.
const interchanges: [string, string][] = [
  ["thesis", "analyst"],
  ["analyst", "sop"],
  ["scheduler", "chips"],
  ["manager", "automation"],
  ["desk", "twin"],
];

const START = 2013;
const END = 2027.7;

function Board({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-4 sm:px-6">
        <SplitFlap text="Departures" className="text-lg sm:text-2xl" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">BLR → MMX → ∞</span>
      </div>
      <div className="hidden grid-cols-[92px_1fr_80px_150px] gap-4 border-b border-neutral-800 px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest text-neutral-500 sm:grid">
        <span>Time</span>
        <span>Destination</span>
        <span>Gate</span>
        <span className="text-right">Status</span>
      </div>
      <ol>
        {milestones.map((m) => {
          const active = m.id === selected;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onSelect(m.id)}
                aria-pressed={active}
                className={cn(
                  "grid w-full grid-cols-[64px_1fr_auto] items-center gap-3 border-b border-neutral-900 px-4 py-3.5 text-left font-mono text-sm transition-colors sm:grid-cols-[92px_1fr_80px_150px] sm:gap-4 sm:px-6 sm:py-4 sm:text-base",
                  active ? "bg-neutral-800/80" : "hover:bg-neutral-900"
                )}
              >
                <span className="text-amber-300">{m.time}</span>
                <span className="min-w-0">
                  <span className="block truncate uppercase text-neutral-100 sm:whitespace-normal">{m.destination}</span>
                  <span className="block truncate text-[11px] text-neutral-500 sm:hidden">{lines[m.line].gate} · {m.status}</span>
                </span>
                <span className="hidden sm:inline" style={{ color: lines[m.line].color }}>
                  {lines[m.line].gate}
                </span>
                <span className={cn("hidden text-right text-xs tracking-wider sm:inline", statusStyle[m.status])}>{m.status}</span>
                <span className="text-neutral-600 sm:hidden" aria-hidden>›</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function MetroMap({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const W = 960;
  const pad = 40;
  const laneY: Record<JourneyLine, number> = { education: 56, career: 122, projects: 188, ventures: 254 };
  const x = (at: number) => pad + ((at - START) / (END - START)) * (W - pad * 2);
  const byId = useMemo(() => Object.fromEntries(milestones.map((m) => [m.id, m])), []);
  const years = Array.from({ length: 15 }, (_, i) => START + i);

  return (
    <>
      {/* Desktop: horizontal metro map */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
        <svg viewBox={`0 0 ${W} 300`} className="w-full" role="img" aria-label="Career metro map with four lines: education, career, projects and ventures">
          {years.map((y) => (
            <g key={y}>
              <line x1={x(y)} x2={x(y)} y1={24} y2={282} stroke="currentColor" className="text-border" strokeDasharray="2 6" />
              {y % 2 === 1 && (
                <text x={x(y)} y={292} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">
                  {y}
                </text>
              )}
            </g>
          ))}

          {interchanges.map(([a, b]) => (
            <path
              key={a + b}
              d={`M${x(byId[a].at)},${laneY[byId[a].line]} C${x(byId[a].at)},${(laneY[byId[a].line] + laneY[byId[b].line]) / 2} ${x(byId[b].at)},${(laneY[byId[a].line] + laneY[byId[b].line]) / 2} ${x(byId[b].at)},${laneY[byId[b].line]}`}
              fill="none"
              stroke="currentColor"
              className="text-muted-foreground/40"
              strokeWidth={3}
            />
          ))}

          {lineOrder.map((line) => {
            const stops = milestones.filter((m) => m.line === line);
            const first = x(stops[0].at);
            const last = x(stops[stops.length - 1].at);
            const scheduled = stops.findIndex((s) => s.status === "SCHEDULED");
            const solidEnd = scheduled > 0 ? x(stops[scheduled - 1].at) : last;
            return (
              <g key={line}>
                <text x={first - 12} y={laneY[line] - 14} className="fill-foreground text-[11px] font-semibold">
                  {lines[line].label}
                </text>
                <line x1={first} x2={solidEnd} y1={laneY[line]} y2={laneY[line]} stroke={lines[line].color} strokeWidth={6} strokeLinecap="round" />
                {scheduled > 0 && (
                  <line x1={solidEnd} x2={last} y1={laneY[line]} y2={laneY[line]} stroke={lines[line].color} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 10" />
                )}
              </g>
            );
          })}

          {milestones.map((m) => {
            const active = m.id === selected;
            const cx = x(m.at);
            const cy = laneY[m.line];
            return (
              <g
                key={m.id}
                role="button"
                tabIndex={0}
                aria-label={`${m.time}: ${m.destination}`}
                aria-pressed={active}
                onClick={() => onSelect(m.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(m.id)}
                className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-primary"
              >
                <circle cx={cx} cy={cy} r={16} fill="transparent" />
                <circle cx={cx} cy={cy} r={active ? 9 : 7} fill="white" stroke={active ? "#0f172a" : lines[m.line].color} strokeWidth={active ? 4 : 3} />
                {m.status === "NOW BOARDING" && (
                  <circle cx={cx} cy={cy} r={14} fill="none" stroke={lines[m.line].color} strokeWidth={2} className="motion-safe:animate-ping" style={{ transformOrigin: `${cx}px ${cy}px` }} />
                )}
                <text x={cx} y={cy + 24} textAnchor="middle" className={cn("font-mono text-[9px]", active ? "fill-foreground font-bold" : "fill-muted-foreground")}>
                  {m.code}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile: vertical metro with four rails */}
      <ol className="relative rounded-2xl border border-border bg-card py-2 md:hidden">
        {milestones.map((m, i) => {
          const active = m.id === selected;
          return (
            <li key={m.id} className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex gap-2" aria-hidden>
                {lineOrder.map((line) => {
                  const stops = milestones.filter((s) => s.line === line).map((s) => milestones.indexOf(s));
                  const on = i >= Math.min(...stops) && i <= Math.max(...stops);
                  return (
                    <span key={line} className="relative w-1.5">
                      {on && (
                        <span
                          className={cn("absolute inset-x-0 rounded-full", i === Math.min(...stops) ? "top-1/2 bottom-0" : i === Math.max(...stops) ? "top-0 bottom-1/2" : "inset-y-0")}
                          style={{ background: lines[line].color, opacity: m.line === line ? 1 : 0.35 }}
                        />
                      )}
                      {m.line === line && (
                        <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-white" style={{ borderColor: active ? "#0f172a" : lines[line].color }} />
                      )}
                    </span>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => onSelect(m.id)}
                aria-pressed={active}
                className={cn("block w-full py-2.5 pl-[4.75rem] pr-4 text-left", active && "bg-muted")}
              >
                <span className="block font-mono text-[10px] text-muted-foreground">{m.time} · {lines[m.line].label}</span>
                <span className="block text-sm font-medium text-foreground">{m.destination}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function Detail({ m }: { m: Milestone }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5" aria-live="polite">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className="rounded px-1.5 py-0.5 text-white" style={{ background: lines[m.line].color }}>
          {lines[m.line].gate}
        </span>
        <span>{m.time}</span>
        <span aria-hidden>·</span>
        <span>{m.code}</span>
        <span aria-hidden>·</span>
        <span className="text-foreground">{m.status}</span>
      </div>
      <h3 className="mt-3">
        <SplitFlap text={m.destination} className="text-sm sm:text-base" />
      </h3>
      <p className="mt-2 text-sm font-medium text-foreground">{m.place}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {m.metrics.map((metric) => (
          <li key={metric} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
            {metric}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Career journey as a split-flap departures board or a four-line metro map.
 * Both views share one selection and a flap-animated detail card.
 */
export default function JourneyBoard({ views = ["board", "metro"] }: { views?: ("board" | "metro")[] }) {
  const [view, setView] = useState<"board" | "metro">(views[0]);
  const [selected, setSelected] = useState("manager");
  const current = milestones.find((m) => m.id === selected) ?? milestones[0];
  const detailRef = useRef<HTMLDivElement>(null);

  // On small screens the detail card sits above the list; bring it into view.
  const select = (id: string) => {
    setSelected(id);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <section aria-labelledby="journey-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="journey-heading" className="font-semibold text-foreground">The journey so far</h2>
          <p className="text-xs text-muted-foreground">Education, roles, projects and ventures. Tap any stop for the details.</p>
        </div>
        {views.length > 1 && (
        <div className="inline-flex rounded-lg border border-border bg-card p-1 text-xs font-medium" role="group" aria-label="Journey view">
          {(
            [
              ["board", "Departures board"],
              ["metro", "Metro map"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={cn("min-h-9 rounded-md px-3 transition-colors", view === key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
            >
              {label}
            </button>
          ))}
        </div>
        )}
      </div>

      <div className={cn("grid gap-4 lg:items-start", view === "board" && "xl:grid-cols-[1.7fr_1fr]")}>
        <div ref={detailRef} className={cn("scroll-mt-20", view === "board" && "xl:sticky xl:top-6 xl:order-2")}>
          <Detail m={current} />
        </div>
        {view === "board" ? <Board selected={selected} onSelect={select} /> : <MetroMap selected={selected} onSelect={select} />}
      </div>
    </section>
  );
}
