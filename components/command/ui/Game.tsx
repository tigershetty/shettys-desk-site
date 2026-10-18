"use client";

import { AlertTriangle, PackagePlus, Star, Zap } from "lucide-react";
import { siteById } from "@/lib/command/data";
import { scoreSummary } from "@/lib/command/kpis";
import { EVENT_SECONDS, ORDER_SECONDS, shiftStars } from "@/lib/command/sim";
import { useCommand } from "@/lib/command/store";
import { cn } from "@/lib/utils";
import { Card } from "./bits";

function Timer({ left, total }: { left: number; total: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={cn("h-full rounded-full transition-[width] duration-100", left < total * 0.3 ? "bg-rose-500" : "bg-amber-400")} style={{ width: `${(left / total) * 100}%` }} />
    </div>
  );
}

export function OrderCards() {
  const orders = useCommand((s) => s.orders);
  const respond = useCommand((s) => s.respondOrder);
  const shiftOver = useCommand((s) => s.shiftOver);
  if (shiftOver || orders.length === 0) return null;
  return (
    <div className="flex w-full flex-col gap-2" aria-live="polite">
      {orders.map((o) => {
        const def = siteById[o.site];
        const sku = def.skus.find((s) => s.id === o.sku);
        return (
          <Card key={o.id} className="px-3 py-2.5">
            <div className="flex items-start gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <PackagePlus className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-600">New order · {o.site}</p>
                <p className="truncate text-[13px] font-semibold text-slate-900">
                  {o.customer} · {o.pallets} pallets
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {sku?.name} to {o.destination} · ships from {def.name}
                </p>
              </div>
              <span className="font-mono text-[11px] text-slate-400">{Math.ceil(o.timeLeft)}s</span>
            </div>
            <Timer left={o.timeLeft} total={ORDER_SECONDS} />
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <button type="button" onClick={() => respond(o.id, "accept")} className="min-h-9 rounded-lg bg-indigo-600 text-[12px] font-semibold text-white hover:bg-indigo-700">
                Accept · +{o.points}
              </button>
              <button type="button" onClick={() => respond(o.id, "rush")} className="min-h-9 rounded-lg border border-amber-300 bg-amber-50 text-[12px] font-semibold text-amber-800 hover:bg-amber-100">
                Rush · ×2
              </button>
              <button type="button" onClick={() => respond(o.id, "decline")} className="min-h-9 rounded-lg border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50">
                Decline
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function EventCard() {
  const e = useCommand((s) => s.event);
  const choose = useCommand((s) => s.chooseEvent);
  const credits = useCommand((s) => s.progress.credits);
  const select = useCommand((s) => s.select);
  if (!e) return null;
  return (
    <Card className="border-rose-200 px-3 py-3">
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
          <AlertTriangle className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-rose-600">Incident · {e.site}</p>
          <p className="text-[13px] font-semibold text-slate-900">{e.title}</p>
          <p className="text-[12px] text-slate-500">{e.body}</p>
          {e.target && (
            <button type="button" onClick={() => select(e.target)} className="mt-0.5 text-[11px] font-semibold text-indigo-600 hover:underline">
              Show me
            </button>
          )}
        </div>
        <span className="font-mono text-[11px] text-slate-400">{Math.ceil(e.timeLeft)}s</span>
      </div>
      <div className="mt-2">
        <Timer left={e.timeLeft} total={EVENT_SECONDS} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {e.options.map((o, i) => (
          <button
            key={o.label}
            type="button"
            onClick={() => choose(i as 0 | 1)}
            disabled={o.cost > credits}
            className={cn(
              "min-h-11 rounded-lg px-2 py-1.5 text-left disabled:cursor-not-allowed disabled:opacity-45",
              i === 0 ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <span className="block text-[12px] font-semibold">
              {o.label}
              {o.cost > 0 && <span className="ml-1 font-mono text-[11px] opacity-80">{o.cost} cr</span>}
            </span>
            <span className={cn("block text-[11px]", i === 0 ? "text-indigo-100" : "text-slate-500")}>{o.detail}</span>
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[10px] text-slate-400">No answer picks the second option.</p>
    </Card>
  );
}

export function ShiftSummary() {
  const w = useCommand();
  if (!w.shiftOver) return null;
  const s = scoreSummary(w);
  const stars = shiftStars(w.stats);
  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-slate-900/25 p-4 backdrop-blur-[2px]">
      <Card className="w-full max-w-sm px-5 py-5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">Shift {w.progress.shift} complete</p>
        <div className="mt-2 flex justify-center gap-1" aria-label={`${stars} of 3 stars`}>
          {[0, 1, 2].map((i) => (
            <Star key={i} className={cn("h-9 w-9", i < stars ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
          ))}
        </div>
        <p className="mt-2 font-mono text-3xl font-bold text-slate-900">{s.score.toLocaleString("en-US")}</p>
        <p className="text-[12px] text-slate-500">points · best {Math.max(w.progress.bestScore, s.score).toLocaleString("en-US")}</p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
          <div className="rounded-xl bg-slate-50 p-2">
            <dt className="text-slate-500">Delivered</dt>
            <dd className="font-bold text-slate-900">{s.delivered}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-2">
            <dt className="text-slate-500">On time</dt>
            <dd className="font-bold text-slate-900">{Math.round(s.onTimeRate * 100)}%</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-2">
            <dt className="text-slate-500">Lost</dt>
            <dd className="font-bold text-slate-900">{s.lost}</dd>
          </div>
        </dl>
        <p className="mt-3 flex items-center justify-center gap-1 text-[12px] text-slate-600">
          <Zap className="h-3.5 w-3.5 text-amber-500" /> {Math.floor(s.score / 10)} credits earned · {w.progress.credits} to spend
        </p>
        <p className="mt-1 text-[11px] text-slate-400">Open a site&apos;s inspector to buy bays, forklifts and chargers.</p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={w.restart} className="min-h-10 flex-1 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            Reset progress
          </button>
          <button type="button" onClick={w.nextShift} className="min-h-10 flex-1 rounded-lg bg-indigo-600 text-[13px] font-semibold text-white hover:bg-indigo-700">
            Start shift {w.progress.shift + 1}
          </button>
        </div>
      </Card>
    </div>
  );
}

export function AutopilotToggle() {
  const on = useCommand((s) => s.autopilot);
  const set = useCommand((s) => s.setAutopilot);
  return (
    <Card className="flex items-center gap-2 px-3 py-2">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => set(!on)}
        className={cn("relative h-5 w-9 shrink-0 rounded-full transition", on ? "bg-indigo-600" : "bg-slate-300")}
      >
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all", on ? "left-[18px]" : "left-0.5")} />
      </button>
      <span className="text-[12px] leading-tight">
        <span className="block font-semibold text-slate-900">Autopilot {on ? "on" : "off"}</span>
        <span className="block text-[11px] text-slate-500">{on ? "Bays and forklifts auto-assigned" : "You dispatch · points ×1.25"}</span>
      </span>
    </Card>
  );
}
