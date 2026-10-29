"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plane } from "lucide-react";
import { useRef } from "react";
import { lines, milestones, type JourneyStatus } from "@/data/journey";
import { passes } from "@/data/passes";
import { cn } from "@/lib/utils";

// The journey as boarding passes: one pass per leg, from where the trip left
// to where it landed. Dates, summaries and results come from data/journey.ts.

const byId = Object.fromEntries(milestones.map((m) => [m.id, m]));

const statusLabel: Record<JourneyStatus, string> = {
  LANDED: "Landed",
  "NOW BOARDING": "Now boarding",
  "IN FLIGHT": "In flight",
  SCHEDULED: "Scheduled",
};

/** A short barcode, the same every render for the same pass. */
function Barcode({ seed }: { seed: string }) {
  const bars = Array.from({ length: 26 }, (_, i) => 1 + ((seed.charCodeAt(i % seed.length) + i * 7) % 3));
  return (
    <div aria-hidden className="flex w-12 flex-col gap-[2px]">
      {bars.map((h, i) => (
        <span key={i} className="block w-full bg-foreground/80" style={{ height: h }} />
      ))}
    </div>
  );
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 whitespace-nowrap text-[13px] font-medium text-foreground tabular-nums sm:text-sm">{value}</p>
    </div>
  );
}

function Notch({ at }: { at: "top" | "bottom" }) {
  // A half circle cut into the card's edge where the stub tears off.
  return (
    <span
      aria-hidden
      className={cn(
        "absolute right-[5.75rem] z-10 h-5 w-5 translate-x-1/2 rounded-full border border-foreground/10 bg-card",
        at === "top" ? "-top-2.5 [clip-path:inset(50%_0_0_0)]" : "-bottom-2.5 [clip-path:inset(0_0_50%_0)]"
      )}
    />
  );
}

function PassCard({ index }: { index: number }) {
  const leg = passes[index];
  const m = byId[leg.milestone];
  const line = lines[m.line];
  const live = m.status === "NOW BOARDING";
  const next = m.status === "SCHEDULED";
  const chips = leg.chips ?? m.metrics.slice(0, 2);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.08, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        "group relative flex w-[min(88vw,430px)] shrink-0 snap-start rounded-2xl border bg-gradient-to-b from-white to-neutral-50/70",
        "shadow-[0_1px_0_rgba(0,0,0,.03),0_18px_36px_-26px_rgba(30,27,75,.35)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.32,.72,0,1)]",
        "hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(0,0,0,.03),0_26px_44px_-24px_rgba(30,27,75,.4)] motion-reduce:transition-none",
        next ? "border-dashed border-foreground/25" : "border-foreground/10",
        live && "ring-1 ring-primary/40"
      )}
      aria-label={`${leg.from.name} to ${leg.to.name}, ${m.time}`}
    >
      <Notch at="top" />
      <Notch at="bottom" />

      {/* main section */}
      <div className="min-w-0 flex-1 overflow-hidden rounded-l-2xl">
        <div className="h-1 w-full" style={{ background: line.color }} />
        <div className="p-4 pb-3.5 sm:p-5 sm:pb-4">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/80">Shetty&apos;s Desk</span>
            <span>Boarding pass</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-3xl font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-4xl">{leg.from.code}</p>
              <p className="mt-1.5 truncate text-xs text-muted-foreground">{leg.from.name}</p>
            </div>
            <div aria-hidden className="relative flex min-w-6 flex-1 items-center">
              <span className="h-px w-full bg-foreground/15" />
              <Plane className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white text-primary" strokeWidth={1.75} style={{ color: line.color }} />
            </div>
            <div className="min-w-0 text-right">
              <p className="text-3xl font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-4xl">{leg.to.code}</p>
              <p className="mt-1.5 truncate text-xs text-muted-foreground">{leg.to.name}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-foreground/10 pt-3">
            <Field label="Boards" value={m.time} />
            <Field label="Class" value={line.label} />
            <Field label="Gate" value={line.gate} />
          </div>

          <p className="mt-3 text-sm font-medium leading-snug text-foreground">{m.destination}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{leg.summary ?? m.summary}</p>
          {chips.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((x) => (
                <li key={x} className="rounded-full border border-foreground/10 bg-white px-2.5 py-1 text-[11px] text-foreground/80">
                  {x}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* tear line */}
      <div aria-hidden className="absolute bottom-3 right-[5.75rem] top-3 w-px border-l border-dashed border-foreground/20" />

      {/* stub */}
      <div className="flex w-[5.75rem] shrink-0 flex-col items-center justify-between gap-3 px-2 py-4">
        <div className="text-center">
          <p className="text-[11px] text-muted-foreground">Status</p>
          <p
            className={cn(
              "mt-0.5 inline-flex items-center justify-center gap-1.5 text-center text-xs font-medium",
              live ? "text-primary" : m.status === "IN FLIGHT" ? "text-amber-600" : next ? "text-muted-foreground" : "text-teal-700"
            )}
          >
            {live && <span className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse" />}
            {statusLabel[m.status]}
          </p>
        </div>
        <Barcode seed={leg.milestone + leg.to.code} />
        <p className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(passes.length).padStart(2, "0")}
        </p>
      </div>
    </motion.article>
  );
}

export default function BoardingPasses() {
  const scroller = useRef<HTMLDivElement>(null);
  const go = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 460), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section className="mb-12 rounded-3xl border border-border bg-card p-4 sm:p-6" aria-labelledby="journey-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 id="journey-heading" className="font-semibold text-foreground">The journey so far</h2>
          <p className="text-xs text-muted-foreground">Each leg of the trip, from Bangalore to here. Scroll sideways.</p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => go(-1)} aria-label="Earlier passes" className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:bg-muted">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Later passes" className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:bg-muted">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        role="region"
        aria-label="Boarding passes for each leg of the journey"
        tabIndex={0}
        className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-5 pt-2 [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {passes.map((p, i) => (
          <PassCard key={p.milestone} index={i} />
        ))}
      </div>
    </section>
  );
}
