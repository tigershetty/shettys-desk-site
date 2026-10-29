"use client";

import { Clock3, Coins, TrendingDown, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import CountFigure from "@/components/CountFigure";
import beliefs from "@/data/beliefs.json";
import experience from "@/data/experience.json";
import { islandOrder, islands, type IslandId } from "@/lib/scor";
import { cn } from "@/lib/utils";

// Career at a glance: a bento of the work, in the site's own palette. The
// layout idiom (a stream across time, a tick gauge, KPI tiles) comes from the
// finance-bento dashboard; the content is the career, and every figure is
// from the site's data: experience.json, the SCOR roles in lib/scor.ts, and
// the results already published on Experience.

// The stream counts working roles, so it starts with the first one (2016);
// the degrees that came before it are not roles.
const START = 2016;
const END = new Date().getFullYear();
const YEARS = Array.from({ length: END - START + 1 }, (_, i) => START + i);

const parseSpan = (period: string): [number, number] => {
  const [a, b] = period.split("–");
  return [parseInt(a, 10), b === "now" ? END : parseInt(b, 10)];
};

/** Roles active in each SCOR process, per year. */
const counts: Record<IslandId, number[]> = Object.fromEntries(
  islandOrder.map((id) => [
    id,
    YEARS.map((y) =>
      islands[id].entries.filter((e) => {
        const [from, to] = parseSpan(e.period);
        return from >= START && y >= from && y <= to;
      }).length
    ),
  ])
) as Record<IslandId, number[]>;

// Innermost first: Enable is the foundation, delivery the outer skin.
const STACK: IslandId[] = ["enable", "make", "plan", "source", "deliver"];

// Schematic (not geographic) layout of the network planned across.
const hub = { name: "Lund", x: 300, y: 112 };
const nodes = [
  { name: "Sweden", x: 210, y: 46, role: "Factory" },
  { name: "Italy", x: 330, y: 218, role: "Factory" },
  { name: "Portugal", x: 160, y: 196, role: "Supplier" },
  { name: "Austria", x: 430, y: 178, role: "Supplier" },
  { name: "China", x: 548, y: 96, role: "Supplier" },
  { name: "USA", x: 52, y: 120, role: "Supplier" },
];

const wins: { tag: string; tone: "teal" | "indigo" | "amber"; text: string }[] = [
  { tag: "Resolved", tone: "teal", text: "Order-confirmation automation through an SAP defect: ~9 h saved per day" },
  { tag: "Shipped", tone: "indigo", text: "Optimus Prime AI agent: 90% faster QMS queries for 50+ users" },
  { tag: "Recovered", tone: "teal", text: "Semiconductor shortage: availability back from 85% to 98%" },
  { tag: "Improved", tone: "amber", text: "On-time delivery +25% through capacity scenario modelling" },
  { tag: "Cleared", tone: "teal", text: "Sourcing backlog −45% after automating case creation" },
  { tag: "Standardised", tone: "indigo", text: "Global S&OP planning model, the foundation for IBP" },
];

const toneClass = {
  teal: "bg-teal-50 text-teal-700",
  indigo: "bg-indigo-50 text-indigo-700",
  amber: "bg-amber-50 text-amber-800",
};

/** True once the element has scrolled into view (and stays true). */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** Smooth path through points (Catmull-Rom). */
function smoothPath(P: [number, number][], move = true) {
  let d = (move ? "M" : "L") + `${P[0][0]},${P[0][1]}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[i + 2] || p2;
    const k = 0.17;
    d += `C${p1[0] + (p2[0] - p0[0]) * k},${p1[1] + (p2[1] - p0[1]) * k} ${p2[0] - (p3[0] - p1[0]) * k},${p2[1] - (p3[1] - p1[1]) * k} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function Tile({ title, note, className, children }: { title?: string; note?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative flex min-w-0 flex-col rounded-2xl border border-foreground/10 bg-white p-4 sm:p-5", className)}>
      {title && <p className="text-sm font-medium text-foreground">{title}</p>}
      {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
      {children}
    </div>
  );
}

/* ------------------------------ the stream ------------------------------ */

function Stream() {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  // Drawn at its real pixel width, so the labels stay a readable size on a phone.
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.max(260, Math.round(el.clientWidth))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  const H = W < 480 ? 200 : 230;
  const pad = 14;
  const base = 22; // room for the year labels
  const mid = (H - base) / 2;
  const half = mid - 8;
  const X = (i: number) => pad + (i / (YEARS.length - 1)) * (W - pad * 2);

  const totals = YEARS.map((_, i) => STACK.reduce((s, id) => s + counts[id][i], 0));
  const max = Math.max(...totals);
  const cum = YEARS.map((_, i) => {
    let run = 0;
    return STACK.map((id) => (run += counts[id][i]));
  });
  const band = (k: number) => {
    const top: [number, number][] = YEARS.map((_, i) => [X(i), mid - (cum[i][k] / max) * half]);
    const bottom: [number, number][] = YEARS.map((_, i) => [X(i), mid + (cum[i][k] / max) * half]).reverse() as [number, number][];
    return smoothPath(top) + smoothPath(bottom, false) + "Z";
  };

  const hi = hover ?? YEARS.length - 1;
  const here = STACK.map((id) => ({ id, n: counts[id][hi] })).filter((x) => x.n > 0);

  return (
    <Tile title="Career stream" note="The roles active in each part of the supply chain, year by year." className="lg:col-span-8 sm:col-span-2">
      <div ref={ref} className="mt-3">
        <div
          className="motion-reduce:transition-none"
          style={{
            clipPath: seen ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            transition: "clip-path 1.6s cubic-bezier(.32,.72,0,1)",
          }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block touch-pan-y" role="img" aria-label={`Stream chart of roles active in each SCOR process from ${START} to now`} onPointerLeave={() => setHover(null)}>
            {[...STACK].reverse().map((id) => (
              <path key={id} d={band(STACK.indexOf(id))} fill={islands[id].color} fillOpacity={0.92} />
            ))}
            {YEARS.map((y, i) =>
              (y - START) % 2 === 0 ? (
                <text key={y} x={X(i)} y={H - 6} textAnchor="middle" className="fill-muted-foreground text-[11px]">
                  {y}
                </text>
              ) : null
            )}
            {hover !== null && <line x1={X(hover)} x2={X(hover)} y1={6} y2={H - base} stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.5} className="text-foreground" />}
            <rect
              width={W}
              height={H - base}
              fill="transparent"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width) * W;
                setHover(Math.max(0, Math.min(YEARS.length - 1, Math.round(((x - pad) / (W - pad * 2)) * (YEARS.length - 1)))));
              }}
            />
          </svg>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-hidden>
          {STACK.map((id) => (
            <span key={id} className="inline-flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full" style={{ background: islands[id].color }} />
              {islands[id].label}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-foreground/10 pt-2 text-xs text-muted-foreground" aria-live="polite">
          <span className="font-medium text-foreground tabular-nums">{YEARS[hi]}</span>
          {here.map((x) => (
            <span key={x.id} className="inline-flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full" style={{ background: islands[x.id].color }} />
              {islands[x.id].label} {x.n}
            </span>
          ))}
        </div>
      </div>
      <ul className="sr-only">
        {islandOrder.map((id) => (
          <li key={id}>
            {islands[id].label}: {islands[id].entries.map((e) => e.period).join(", ")}
          </li>
        ))}
      </ul>
    </Tile>
  );
}

/* ------------------------------- the gauge ------------------------------ */

function Gauge() {
  const [ref, seen] = useInView<HTMLDivElement>();
  const n = 56;
  const ticks = Array.from({ length: n + 1 }, (_, i) => {
    const f = i / n;
    const a = ((180 + f * 180) * Math.PI) / 180;
    const long = i % 7 === 0;
    const r1 = 136;
    const r2 = long ? 110 : 118;
    // Rounded so the server and the browser print identical numbers.
    const r = (v: number) => Math.round(v * 100) / 100;
    return { i, f, x1: r(r1 * Math.cos(a)), y1: r(r1 * Math.sin(a)), x2: r(r2 * Math.cos(a)), y2: r(r2 * Math.sin(a)) };
  });
  return (
    <Tile title="Supply availability" note="During the semiconductor shortage." className="lg:col-span-4 sm:col-span-2">
      <div ref={ref} className="relative mx-auto mt-4 w-full max-w-[300px]">
        <svg viewBox="-150 -150 300 162" className="h-auto w-full" aria-hidden>
          {ticks.map((t) => {
            const gained = t.f > 0.85 && t.f <= 0.98;
            const before = t.f <= 0.85;
            return (
              <line
                key={t.i}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                strokeWidth={3.2}
                strokeLinecap="round"
                className={gained ? "stroke-teal-600" : before ? "stroke-foreground/25" : "stroke-foreground/10"}
                style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ${t.i * 14}ms` }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="text-5xl font-semibold leading-none tracking-[-0.05em] text-foreground tabular-nums">
            <CountFigure n={98} />
            <span className="ml-0.5 align-top text-xl font-medium text-muted-foreground">%</span>
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">up from 85%</p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Rebuilt through scenario planning and rapid replanning, across 9 products in 6 countries.</p>
    </Tile>
  );
}

/* ------------------------------- KPI tiles ------------------------------ */

function Kpi({ icon: Icon, value, prefix, suffix, label, note, children }: { icon: typeof Coins; value: number; prefix?: string; suffix?: string; label: string; note: string; children?: React.ReactNode }) {
  return (
    <Tile className="lg:col-span-3">
      <Icon aria-hidden className="absolute right-4 top-4 h-5 w-5 text-foreground/15" strokeWidth={1.5} />
      <p className="text-4xl font-semibold leading-none tracking-[-0.045em] text-primary tabular-nums">
        {prefix}
        <CountFigure n={value} />
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs leading-snug text-muted-foreground">{note}</p>
      {children && (
        <div aria-hidden className="mt-auto pt-4">
          {children}
        </div>
      )}
    </Tile>
  );
}

/* ------------------------------- the network ---------------------------- */

function Network() {
  const h = hub;
  return (
    <Tile title="The network" note="Planned across, coordinated from Lund." className="lg:col-span-6 sm:col-span-2">
      <svg viewBox="0 0 600 260" className="mt-2 h-auto w-full" role="img" aria-label={`Schematic of the supply network planned across ${nodes.map((n) => n.name).join(", ")}, coordinated from Lund`}>
        <defs>
          <pattern id="cb-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" className="fill-foreground/10" />
          </pattern>
        </defs>
        <rect width="600" height="260" fill="url(#cb-grid)" />
        {nodes.map((n, i) => {
          const mx = (n.x + h.x) / 2;
          const my = (n.y + h.y) / 2 - 22 - Math.abs(n.x - h.x) * 0.08;
          const d = `M${h.x},${h.y} Q${mx},${my} ${n.x},${n.y}`;
          return (
            <g key={n.name}>
              <path d={d} fill="none" className="stroke-primary/25" strokeWidth={1.5} />
              <path d={d} fill="none" className="stroke-amber-500 motion-safe:animate-[bento-flow_2.4s_linear_infinite]" strokeWidth={2} strokeDasharray="4 14" style={{ animationDelay: `${i * -0.4}s` }} />
              <circle cx={n.x} cy={n.y} r={5} className={n.role === "Factory" ? "fill-teal-600" : "fill-primary"} stroke="white" strokeWidth={2} />
              <text x={n.x} y={n.y + 21} textAnchor="middle" className="fill-foreground text-[12px]">
                {n.name}
              </text>
            </g>
          );
        })}
        <circle cx={h.x} cy={h.y} r={10} fill="none" className="stroke-amber-500 motion-safe:animate-ping" strokeWidth={1.5} style={{ transformOrigin: `${h.x}px ${h.y}px` }} />
        <circle cx={h.x} cy={h.y} r={6.5} className="fill-amber-500" stroke="white" strokeWidth={2} />
        <text x={h.x + 13} y={h.y + 4} className="fill-foreground text-[12px] font-semibold">
          Lund
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-teal-600" />Factory</span>
        <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-primary" />Supplier</span>
        <span>9 key products · 2 factories · 12+ suppliers · 6 countries</span>
      </div>
    </Tile>
  );
}

/* --------------------------------- bento -------------------------------- */

export default function CareerBento() {
  const principles = useMemo(() => beliefs.map((b) => b.title), []);
  return (
    <section aria-labelledby="bento-heading" className="mb-12 rounded-3xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4">
        <h2 id="bento-heading" className="font-semibold text-foreground">Career at a glance</h2>
        <p className="text-xs text-muted-foreground">Where the work sat, how much of it, and what changed.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <Stream />
        <Gauge />

        <Kpi icon={Coins} value={450} suffix="M+" label="EUR purchasing a year" note="250,000+ purchase orders across 1,000+ suppliers.">
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="h-1.5 flex-1 rounded-full bg-primary" style={{ opacity: 0.25 + i * 0.075 }} />
            ))}
          </div>
        </Kpi>
        <Kpi icon={TrendingDown} value={20} prefix="−" suffix="%" label="Sourcing lead time" note="On 1,500+ parts a year, through direct CAD-drawing access.">
          <div className="space-y-1.5">
            <div className="h-1.5 rounded-full bg-foreground/15" />
            <div className="h-1.5 w-[80%] rounded-full bg-teal-600" />
          </div>
        </Kpi>
        <Kpi icon={Clock3} value={2200} prefix="~" label="Hours saved a year" note="About one full-time person, from order-confirmation automation.">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-1.5 flex-1 rounded-full bg-amber-500" />
            <span>≈ 1 FTE</span>
          </div>
        </Kpi>
        <Kpi icon={Users} value={10} label="Specialists led" note="Purchasing and sourcing, with full headcount and budget ownership.">
          <div className="flex gap-1.5">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-primary" />
            ))}
          </div>
        </Kpi>

        <Network />

        <Tile title="What changed" note="Outcomes from the work so far." className="lg:col-span-6 sm:col-span-2">
          <ul className="mt-3 space-y-2.5">
            {wins.map((w) => (
              <li key={w.text} className="flex items-start gap-3 text-sm">
                <span className={cn("mt-px w-[5.5rem] shrink-0 rounded-full py-0.5 text-center text-[11px] font-medium", toneClass[w.tone])}>{w.tag}</span>
                <span className="leading-snug text-foreground/90">{w.text}</span>
              </li>
            ))}
          </ul>
        </Tile>

        <Tile title="How I work" className="lg:col-span-7 sm:col-span-2">
          <ul className="mt-3 flex flex-wrap gap-2">
            {principles.map((p) => (
              <li key={p} className="rounded-full border border-foreground/10 bg-muted/60 px-3 py-1.5 text-sm text-foreground/90">
                {p}
              </li>
            ))}
          </ul>
          <ul className="sr-only">
            {beliefs.map((b) => (
              <li key={b.title}>
                {b.title}. {b.body}
              </li>
            ))}
          </ul>
        </Tile>

        <Tile title="What I bring" className="lg:col-span-5 sm:col-span-2">
          <ul className="mt-3 flex flex-wrap gap-2">
            {experience.competencies.map((c) => (
              <li key={c.area} title={c.detail} className="rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary">
                {c.area}
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </section>
  );
}
