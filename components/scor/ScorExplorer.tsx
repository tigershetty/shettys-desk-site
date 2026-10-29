"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { islandOrder, islands, thread, type IslandId } from "@/lib/scor";
import { cn } from "@/lib/utils";

const ScorScene = dynamic(() => import("./ScorScene"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Raising the islands…</div>,
});

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

export default function ScorExplorer() {
  const lite = useLite();
  const [focus, setFocus] = useState<IslandId | null>(null);
  const [step, setStep] = useState(-1);

  const select = (id: IslandId | null) => {
    setFocus(id);
    setStep(id ? thread.findIndex((t) => t.island === id) : -1);
  };
  const follow = () => {
    const next = (step + 1) % thread.length;
    setStep(next);
    setFocus(thread[next].island);
  };

  const isl = focus ? islands[focus] : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-foreground bg-[#e8f1fb]">
      <div className="grid lg:grid-cols-[1fr_400px]">
        <div className="relative h-[52vh] min-h-[360px] lg:h-[620px]">
          <ScorScene focus={focus} onSelect={select} lite={lite} />
          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground shadow-sm">
              SCOR model · my career
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] text-muted-foreground shadow-sm">
              <span className="h-0.5 w-4 bg-rose-500" /> the red thread
            </span>
          </div>
        </div>

        <aside className="flex flex-col border-t border-foreground/15 bg-white p-4 sm:p-5 lg:border-l lg:border-t-0">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Islands">
            <button
              type="button"
              onClick={() => select(null)}
              aria-pressed={!focus}
              className={cn("min-h-9 rounded-full border px-3 text-xs font-semibold", !focus ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}
            >
              Overview
            </button>
            {islandOrder.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => select(id)}
                aria-pressed={focus === id}
                className={cn("min-h-9 rounded-full border px-3 text-xs font-semibold", focus === id ? "text-white" : "border-border text-muted-foreground hover:text-foreground")}
                style={focus === id ? { background: islands[id].color, borderColor: islands[id].color } : undefined}
              >
                {islands[id].label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex-1 overflow-y-auto lg:max-h-[470px]" aria-live="polite">
            {isl ? (
              <>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: isl.color }}>
                  SCOR · {isl.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{isl.definition}</p>
                <ol className="mt-4 space-y-4">
                  {isl.entries.map((e) => (
                    <li key={e.role + e.period} className="border-l-2 pl-3" style={{ borderColor: isl.color }}>
                      <p className="font-mono text-[11px] text-muted-foreground">{e.period}</p>
                      <p className="text-sm font-semibold text-foreground">{e.role}</p>
                      <p className="text-xs text-muted-foreground">{e.org}</p>
                      <ul className="mt-1.5 space-y-1">
                        {e.points.map((pt) => (
                          <li key={pt} className="text-[13px] leading-relaxed text-foreground/85">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">How to read this</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  SCOR is the standard map of what a supply chain does: <b>Plan</b>, <b>Source</b>, <b>Make</b> and <b>Deliver</b>, all
                  resting on <b>Enable</b>. Each island holds the roles and results from that part of my work.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  The <span className="font-semibold text-rose-600">red thread</span> runs between them in the order I actually worked
                  through them: from the factory floor in Bangalore, through planning, to sourcing and delivering spare parts worldwide.
                </p>
              </>
            )}
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <div className="mb-2 flex gap-1" aria-hidden>
              {thread.map((t, i) => (
                <span key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-rose-500" : "bg-border")} />
              ))}
            </div>
            <button
              type="button"
              onClick={follow}
              className="flex min-h-11 w-full items-center justify-between rounded-lg bg-foreground px-4 text-sm font-semibold text-background hover:bg-foreground/85"
            >
              <span>{step < 0 ? "Follow the red thread" : step === thread.length - 1 ? "Start the thread again" : "Next stop on the thread"}</span>
              <span className="font-mono text-xs opacity-75">
                {step >= 0 ? `${thread[step].when} · ${islands[thread[step].island].label}` : `${thread.length} stops`} →
              </span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
