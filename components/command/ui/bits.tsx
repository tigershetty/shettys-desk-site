"use client";

import { cn } from "@/lib/utils";

export type Tone = "work" | "dock" | "route" | "wait" | "idle" | "bad" | "good";

const pill: Record<Tone, string> = {
  work: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  good: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  dock: "bg-indigo-600 text-white ring-indigo-600",
  route: "bg-white text-indigo-600 ring-indigo-300",
  wait: "bg-amber-50 text-amber-700 ring-amber-200",
  idle: "bg-slate-100 text-slate-600 ring-slate-200",
  bad: "bg-rose-50 text-rose-700 ring-rose-200",
};

const bar: Record<Tone, string> = {
  work: "bg-emerald-500",
  good: "bg-emerald-500",
  dock: "bg-indigo-600",
  route: "bg-indigo-500",
  wait: "bg-amber-500",
  idle: "bg-slate-300",
  bad: "bg-rose-500",
};

export function Pill({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", pill[tone], className)}>
      {children}
    </span>
  );
}

export function Bar({ value, tone = "dock", className }: { value: number; tone?: Tone; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div className={cn("h-full rounded-full transition-[width] duration-500", bar[tone])} style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` }} />
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("pointer-events-auto rounded-2xl border border-black/[0.06] bg-white/95 shadow-[0_10px_30px_rgba(30,27,75,0.10)] backdrop-blur", className)}>
      {children}
    </div>
  );
}

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 py-1.5 text-[12px] first:border-t-0">
      <span className="text-slate-500">{label}</span>
      <span className="min-w-0 truncate text-right font-medium text-slate-900">{children}</span>
    </div>
  );
}

export function IconTile({ children }: { children: React.ReactNode }) {
  return <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">{children}</div>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-600">{children}</p>;
}

export function minutes(simSeconds: number) {
  const m = Math.max(0, Math.round(simSeconds / 60));
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;
}
