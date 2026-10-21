"use client";

import { ArrowLeft, Check, RotateCcw, Undo2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { siteById } from "@/lib/command/data";
import type { SiteId } from "@/lib/command/types";
import { ACT_WEEKS, acts, scorecard, simulate, WEEKS, type Choice, type Grade, type Metric, type Quarter, type Week } from "@/lib/quarter/engine";
import { industries, industryList, type IndustryId } from "@/lib/quarter/industries";
import { cn } from "@/lib/utils";

const Stage = dynamic(() => import("./Stage"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading the network…</div>,
});

type Phase = "pick" | "act" | "run" | "debrief";
const WEEK_MS = 850;
const actEnd = (act: number) => (act < 3 ? ACT_WEEKS[act + 1] : WEEKS);

/** Future acts are padded with the do-nothing card; they cannot affect earlier weeks. */
function pad(choices: Choice[]): Choice[] {
  return [0, 1, 2, 3].map((i) => choices[i] ?? 2) as Choice[];
}

function useLite() {
  const [lite, setLite] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(max-width: 1023px), (prefers-reduced-motion: reduce)");
    const on = () => setLite(q.matches);
    on();
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return lite;
}

const eur = (n: number) => {
  const a = Math.abs(n);
  const s = a >= 1e6 ? `€${(a / 1e6).toFixed(1)}m` : `€${Math.round(a / 1e3)}k`;
  return n < 0 ? `−${s}` : s;
};

const disruptionLabel: Record<Week["disruption"], string> = { none: "", spike: "Demand spike", outage: "Supplier down", shortage: "Shortage" };
const disruptionTone: Record<Week["disruption"], string> = { none: "bg-slate-200", spike: "bg-amber-400", outage: "bg-rose-500", shortage: "bg-violet-500" };

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("pointer-events-auto rounded-2xl border border-black/[0.06] bg-white/95 shadow-[0_10px_30px_rgba(30,27,75,0.10)] backdrop-blur", className)}>{children}</div>;
}

function Timeline({ shown, weeks }: { shown: number; weeks: Week[] }) {
  return (
    <div className="flex gap-0.5" aria-label={`Week ${shown} of ${WEEKS}`}>
      {weeks.map((w, i) => (
        <div key={i} className="flex-1">
          <div className={cn("h-1.5 rounded-full transition-opacity", disruptionTone[w.disruption], i < shown ? "opacity-100" : "opacity-25")} />
        </div>
      ))}
    </div>
  );
}

function Hud({ q, shown }: { q: Quarter; shown: number }) {
  const w = shown > 0 ? q.weeks[shown - 1] : null;
  const fill = shown > 0 ? q.weeks.slice(0, shown).reduce((s, x) => s + x.fill, 0) / shown : 0;
  const stats = [
    { label: "Fill rate", value: w ? `${Math.round(w.fill * 100)}%` : "—", sub: w ? `avg ${Math.round(fill * 100)}%` : "this week", warn: !!w && w.fill < 0.9 },
    { label: "Profit", value: w ? eur(w.profit) : "—", sub: "quarter to date", warn: !!w && w.profit < 0 },
    { label: "Cash", value: w ? eur(w.cash) : "—", sub: "on hand", warn: !!w && w.cash < q.weeks[0].cash * 0.85 },
    { label: "Customer trust", value: w ? `${Math.round(w.trust)}` : "70", sub: "out of 100", warn: !!w && w.trust < 50 },
  ];
  return (
    <Card className="px-3 py-2.5">
      <div className="mb-2 flex items-center justify-between gap-2 text-[11px]">
        <span className="font-semibold text-slate-900">
          Week {Math.max(1, shown)} <span className="font-normal text-slate-400">/ {WEEKS}</span>
        </span>
        {w && w.disruption !== "none" && <span className="rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-700">{disruptionLabel[w.disruption]}</span>}
        {w?.air && <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">Air freight</span>}
      </div>
      <Timeline shown={shown} weeks={q.weeks} />
      <dl className="mt-2.5 grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="min-w-0">
            <dt className="truncate text-[10px] font-medium uppercase tracking-wide text-slate-400">{s.label}</dt>
            <dd className={cn("font-mono text-[15px] font-bold leading-tight", s.warn ? "text-rose-600" : "text-slate-900")}>{s.value}</dd>
            <dd className="truncate text-[10px] text-slate-400">{s.sub}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function Picker({ onPick }: { onPick: (id: IndustryId) => void }) {
  return (
    <Card className="w-full max-w-2xl px-5 py-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">One Quarter · about 3 minutes</p>
      <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Run a supply chain for 13 weeks</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
        Four crises, one decision each. Every choice carries into the next act, and there is no single right answer: you are graded on service, profit,
        cash and resilience. Pick your industry.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {industryList.map((ind) => (
          <button
            key={ind.id}
            type="button"
            onClick={() => onPick(ind.id)}
            className="group rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-indigo-400 hover:shadow-md"
          >
            <span className="block text-[14px] font-bold text-slate-900 group-hover:text-indigo-700">{ind.label}</span>
            <span className="block text-[12px] text-slate-500">
              {ind.company} · {ind.product}
            </span>
            <span className="mt-2 block text-[12px] leading-snug text-slate-600">{ind.stakes}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function ActPanel({ industry, act, onChoose }: { industry: IndustryId; act: number; onChoose: (c: Choice) => void }) {
  const a = acts(industries[industry])[act];
  return (
    <Card className="px-4 py-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">
        Act {act + 1} of 4 · {a.weeks}
      </p>
      <h2 className="mt-0.5 text-[18px] font-bold leading-tight text-slate-900">{a.title}</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{a.situation}</p>
      <div className="mt-3 space-y-2">
        {a.cards.map((c, i) => (
          <button
            key={c.title}
            type="button"
            onClick={() => onChoose(i as Choice)}
            className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:border-indigo-400 hover:bg-indigo-50/40 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <span className="block text-[14px] font-semibold text-slate-900">{c.title}</span>
            <span className="mt-0.5 block text-[12px] leading-snug text-slate-600">{c.detail}</span>
            <span className="mt-1.5 flex flex-wrap gap-1">
              {c.hints.map((h) => (
                <span
                  key={h}
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    h.startsWith("+") ? "bg-emerald-50 text-emerald-700" : h.startsWith("−") ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {h}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function RunPanel({ industry, act, choice, shown, q }: { industry: IndustryId; act: number; choice: Choice; shown: number; q: Quarter }) {
  const a = acts(industries[industry])[act];
  const from = ACT_WEEKS[act];
  const seen = q.weeks.slice(from, shown);
  return (
    <Card className="px-4 py-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">
        Act {act + 1} · playing out
      </p>
      <h2 className="mt-0.5 text-[16px] font-bold text-slate-900">You chose: {a.cards[choice].title}</h2>
      <ul className="mt-2 space-y-1 text-[12px] text-slate-600">
        {seen.map((w) => (
          <li key={w.week} className="flex items-center justify-between gap-2 border-t border-slate-100 pt-1 first:border-t-0 first:pt-0">
            <span className="font-mono text-slate-400">W{w.week}</span>
            <span className="flex-1">
              Sold {Math.round(w.sold).toLocaleString("en-US")} of {Math.round(w.demand).toLocaleString("en-US")}
            </span>
            <span className={cn("font-mono font-semibold", w.fill < 0.9 ? "text-rose-600" : "text-emerald-600")}>{Math.round(w.fill * 100)}%</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ---------- debrief ----------

const metricLabel: Record<Metric, string> = { service: "Service", profit: "Profit", cash: "Cash", resilience: "Resilience" };
const gradeTone: Record<Grade, string> = {
  A: "bg-emerald-500 text-white",
  B: "bg-emerald-100 text-emerald-800",
  C: "bg-amber-100 text-amber-800",
  D: "bg-orange-200 text-orange-900",
  F: "bg-rose-500 text-white",
};

function Chart({ main, alt }: { main: Quarter; alt: Quarter | null }) {
  const W = 760;
  const H = 110;
  const x = (i: number) => 10 + (i / (WEEKS - 1)) * (W - 20);
  const y = (f: number) => 10 + (1 - Math.max(0.3, Math.min(1, f)) - 0) * ((H - 20) / 0.7);
  const path = (q: Quarter) => q.weeks.map((w, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(w.fill).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full" role="img" aria-label="Fill rate by week">
      {main.weeks.map((w, i) =>
        w.disruption !== "none" ? <rect key={i} x={x(i) - (W - 20) / (WEEKS - 1) / 2} y={6} width={(W - 20) / (WEEKS - 1)} height={H - 8} className={cn("opacity-15", w.disruption === "spike" ? "fill-amber-400" : w.disruption === "outage" ? "fill-rose-500" : "fill-violet-500")} /> : null
      )}
      {[1, 0.9, 0.8, 0.7].map((g) => (
        <g key={g}>
          <line x1={10} x2={W - 10} y1={y(g)} y2={y(g)} stroke="#e2e8f0" strokeDasharray="3 3" />
          <text x={W - 8} y={y(g) + 3} fontSize={9} textAnchor="end" fill="#94a3b8">
            {g * 100}%
          </text>
        </g>
      ))}
      {alt && <path d={path(alt)} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 4" />}
      <path d={path(main)} fill="none" stroke="#4f46e5" strokeWidth={2.5} />
      {main.weeks.map((w, i) => (
        <text key={i} x={x(i)} y={H + 14} fontSize={9} textAnchor="middle" fill="#94a3b8">
          {w.week}
        </text>
      ))}
    </svg>
  );
}

function Debrief({ industry, choices, onReplayFrom, onRestart }: { industry: IndustryId; choices: Choice[]; onReplayFrom: (act: number) => void; onRestart: () => void }) {
  const [branch, setBranch] = useState<{ act: number; card: Choice } | null>(null);
  const main = useMemo(() => simulate(industry, choices), [industry, choices]);
  const s = useMemo(() => scorecard(main), [main]);
  const alt = useMemo(
    () => (branch ? simulate(industry, choices.map((c, i) => (i === branch.act ? branch.card : c)) as Choice[]) : null),
    [industry, choices, branch]
  );
  const altScore = useMemo(() => (alt ? scorecard(alt) : null), [alt]);
  const list = acts(industries[industry]);
  const metrics: Metric[] = ["service", "profit", "cash", "resilience"];
  const value: Record<Metric, (q: Quarter) => string> = {
    service: (q) => `${(q.totals.fill * 100).toFixed(1)}% fill · trust ${Math.round(q.totals.trust)}`,
    profit: (q) => eur(q.totals.profit),
    cash: (q) => `${eur(q.totals.cash)} vs start`,
    resilience: (q) => `${Math.round(q.totals.resilience)} / 100`,
  };
  return (
    <Card className="px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">
            Quarter complete · {industries[industry].company}
          </p>
          <h2 className="mt-0.5 text-2xl font-bold text-slate-900">{s.archetype.name}</h2>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-slate-600">{s.archetype.line}</p>
        </div>
        <button type="button" onClick={onRestart} className="flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[13px] font-semibold text-slate-700 hover:border-indigo-300">
          <RotateCcw className="h-4 w-4" /> New quarter
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m} className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-600">{metricLabel[m]}</span>
              <span className="flex items-center gap-1">
                {altScore && altScore.grades[m] !== s.grades[m] && (
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-md text-[12px] font-bold opacity-80 ring-2 ring-amber-400", gradeTone[altScore.grades[m]])}>{altScore.grades[m]}</span>
                )}
                <span className={cn("flex h-7 w-7 items-center justify-center rounded-md text-[15px] font-bold", gradeTone[s.grades[m]])}>{s.grades[m]}</span>
              </span>
            </div>
            <p className="mt-1 font-mono text-[12px] text-slate-800">{value[m](main)}</p>
            {alt && <p className="font-mono text-[11px] text-amber-700">what-if: {value[m](alt)}</p>}
            <p className="mt-0.5 text-[10px] text-slate-400">better than {Math.round(s.percentiles[m] * 100)}% of all 81 quarters</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-4 bg-indigo-600" /> Your quarter
          </span>
          {alt && (
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-4 border-t-2 border-dashed border-amber-500" /> What-if
            </span>
          )}
          <span className="ml-auto">Fill rate by week</span>
        </div>
        <Chart main={main} alt={alt} />
      </div>

      <h3 className="mt-4 text-[13px] font-bold text-slate-900">Replay a branch</h3>
      <p className="text-[12px] text-slate-500">Pick a card you didn&apos;t play to see how the quarter would have ended.</p>
      <ol className="mt-2 space-y-2">
        {list.map((a, i) => (
          <li key={a.id} className="rounded-xl border border-slate-100 p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[13px] font-semibold text-slate-900">
                <span className="mr-1.5 font-mono text-[11px] text-slate-400">Act {i + 1}</span>
                {a.title}
              </p>
              <button type="button" onClick={() => onReplayFrom(i)} className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline">
                <Undo2 className="h-3 w-3" /> Play again from here
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {a.cards.map((c, ci) => {
                const mine = choices[i] === ci;
                const on = branch?.act === i && branch.card === ci;
                return (
                  <button
                    key={c.title}
                    type="button"
                    disabled={mine}
                    onClick={() => setBranch(on ? null : { act: i, card: ci as Choice })}
                    className={cn(
                      "flex min-h-8 items-center gap-1 rounded-full px-2.5 text-[12px] font-semibold",
                      mine ? "bg-indigo-600 text-white" : on ? "bg-amber-100 text-amber-800 ring-2 ring-amber-400" : "border border-slate-200 text-slate-600 hover:border-amber-300"
                    )}
                  >
                    {mine && <Check className="h-3 w-3" />}
                    {c.title}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{a.principle}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}

// ---------- shell ----------

export default function QuarterGame() {
  const lite = useLite();
  const [phase, setPhase] = useState<Phase>("pick");
  const [industry, setIndustry] = useState<IndustryId>("food");
  const [choices, setChoices] = useState<Choice[]>([]);
  const [act, setAct] = useState(0);
  const [shown, setShown] = useState(0);
  const [drill, setDrill] = useState<SiteId | null>(null);

  const q = useMemo(() => simulate(industry, pad(choices)), [industry, choices]);

  // Play the weeks of the current act one by one.
  useEffect(() => {
    if (phase !== "run") return;
    const end = actEnd(act);
    if (shown >= end) {
      const t = window.setTimeout(() => {
        if (act === 3) setPhase("debrief");
        else {
          setAct(act + 1);
          setPhase("act");
        }
      }, 700);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setShown((s) => s + 1), WEEK_MS);
    return () => window.clearTimeout(t);
  }, [phase, shown, act]);

  const pick = (id: IndustryId) => {
    setIndustry(id);
    setChoices([]);
    setAct(0);
    setShown(0);
    setPhase("act");
  };
  const choose = (c: Choice) => {
    setChoices((cs) => [...cs.slice(0, act), c]);
    setPhase("run");
  };
  const replayFrom = (i: number) => {
    setChoices((cs) => cs.slice(0, i));
    setAct(i);
    setShown(ACT_WEEKS[i]);
    setPhase("act");
  };

  const week = shown > 0 ? q.weeks[shown - 1] : null;
  const panel =
    phase === "pick" ? null : phase === "act" ? (
      <ActPanel industry={industry} act={act} onChoose={choose} />
    ) : phase === "run" ? (
      <RunPanel industry={industry} act={act} choice={choices[act]} shown={shown} q={q} />
    ) : null;

  return (
    <div className="@container">
      <div className="relative overflow-hidden rounded-2xl border border-black bg-[#eef0fa]">
        <div className="relative h-[58vh] min-h-[380px] @5xl:h-[calc(100dvh-7rem)] @5xl:min-h-[620px]">
          <Stage week={week} drill={drill} onDrill={setDrill} lite={lite} />

          {drill && (
            <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDrill(null)}
                className="pointer-events-auto flex min-h-10 items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-semibold text-slate-800 shadow-md hover:text-indigo-700"
              >
                <ArrowLeft className="h-4 w-4" /> Network
              </button>
              <span className="rounded-full bg-white/90 px-3 py-2 text-[12px] text-slate-600 shadow-sm">
                {siteById[drill].name} · {siteById[drill].typeLabel}
              </span>
            </div>
          )}

          {phase === "pick" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/10 p-3 backdrop-blur-[1px]">
              <Picker onPick={pick} />
            </div>
          )}

          {phase !== "pick" && !drill && (
            <div className="pointer-events-none absolute left-3 top-3 hidden w-[380px] @5xl:block">
              <Hud q={q} shown={shown} />
              <p className="mt-2 rounded-lg bg-white/80 px-2 py-1 text-[11px] text-slate-500">Columns show weeks of stock at each site. Click a site to look inside.</p>
            </div>
          )}

          {panel && <div className="absolute bottom-3 right-3 top-3 hidden w-[400px] overflow-y-auto @5xl:block">{panel}</div>}

          {phase === "debrief" && (
            <div className="absolute inset-0 z-20 hidden overflow-y-auto bg-slate-900/10 p-4 backdrop-blur-[1px] @5xl:block">
              <div className="mx-auto max-w-3xl">
                <Debrief industry={industry} choices={choices} onReplayFrom={replayFrom} onRestart={() => setPhase("pick")} />
              </div>
            </div>
          )}
        </div>

        {/* Small screens: the HUD and panels sit under the map. */}
        {phase !== "pick" && (
          <div className="space-y-2 border-t border-black/[0.06] bg-white p-2 @5xl:hidden">
            {phase !== "debrief" && <Hud q={q} shown={shown} />}
            {panel}
            {phase === "debrief" && <Debrief industry={industry} choices={choices} onReplayFrom={replayFrom} onRestart={() => setPhase("pick")} />}
          </div>
        )}
      </div>
    </div>
  );
}
