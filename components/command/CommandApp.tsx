"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCommand } from "@/lib/command/store";
import { cn } from "@/lib/utils";
import { OpsPanel, ShipmentTracking } from "./ui/Bottom";
import { AutopilotToggle, EventCard, OrderCards, ShiftSummary } from "./ui/Game";
import { Inspector, KpiCards, MapControls } from "./ui/Panels";
import { MobileStatus, TopBar } from "./ui/TopBar";
import { Card } from "./ui/bits";

const CommandScene = dynamic(() => import("./scene/CommandScene"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading the yards…</div>,
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

function StartCard({ onStart }: { onStart: () => void }) {
  const shift = useCommand((s) => s.progress.shift);
  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-[2px]">
      <Card className="w-full max-w-md px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">Shift {shift} · 06:00 to 14:00</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">Run the network for one shift</h2>
        <ul className="mt-3 space-y-1.5 text-[13px] leading-snug text-slate-600">
          <li>
            <b className="text-slate-900">Orders</b> pop up top left. Accept, Rush for double points if you can make the tighter promise, or Decline.
          </li>
          <li>
            <b className="text-slate-900">Incidents</b> need a call: pay credits to fix fast, or work around them.
          </li>
          <li>
            <b className="text-slate-900">Click anything</b> in the yard or the lists to inspect it. Turn autopilot off to dispatch trucks and forklifts yourself for ×1.25 points.
          </li>
          <li>
            <b className="text-slate-900">Deliver on time</b> to build a combo. Credits buy bays, forklifts and chargers for the next shift.
          </li>
        </ul>
        <button type="button" onClick={onStart} className="mt-4 min-h-11 w-full rounded-lg bg-indigo-600 text-[14px] font-semibold text-white hover:bg-indigo-700">
          Start the shift
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-400">One shift takes about eight minutes. Progress saves in this browser.</p>
      </Card>
    </div>
  );
}

export default function CommandApp() {
  const lite = useLite();
  const [started, setStarted] = useState(false);
  const [sheet, setSheet] = useState<"inspect" | "ops" | "track">("inspect");
  const view = useCommand((s) => s.view);

  useEffect(() => {
    useCommand.getState().hydrate();
    useCommand.getState().setSpeed(0);
  }, []);

  // A fresh selection on a phone brings the inspector sheet forward.
  useEffect(
    () =>
      useCommand.subscribe((s, prev) => {
        if (s.selection !== prev.selection && s.selection && s.selection.kind !== "site") setSheet("inspect");
      }),
    []
  );

  const start = () => {
    setStarted(true);
    useCommand.getState().setSpeed(1);
  };

  return (
    <div className="@container">
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-black bg-[#eef0fa] @5xl:h-[calc(100dvh-5rem)] @5xl:min-h-[640px]">
      <TopBar />
      <MobileStatus />
      <div className="relative h-[52vh] min-h-[340px] @5xl:h-auto @5xl:flex-1">
        <CommandScene lite={lite} />

        {/* Desktop overlays */}
        <div className="pointer-events-none absolute inset-0 hidden p-3 @5xl:block">
          <div className="absolute left-3 top-3 flex w-[min(600px,calc(100%-24rem))] flex-col gap-2">
            <KpiCards />
            <div className="flex w-[360px] flex-col gap-2">
              <AutopilotToggle />
              <EventCard />
              <OrderCards />
            </div>
          </div>
          <div className={cn("absolute bottom-[200px] right-3 top-3 flex items-start gap-2", view === "network" && "opacity-95")}>
            <MapControls />
            <div className="h-full max-h-full w-[310px] overflow-hidden">
              <Inspector />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 right-[452px] max-w-[760px]">
            <ShipmentTracking />
          </div>
          <div className="absolute bottom-3 right-3 h-[184px] w-[430px]">
            <OpsPanel />
          </div>
        </div>

        {/* Mobile overlays */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2 @5xl:hidden">
          <KpiCards />
          <div className="flex items-end gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <EventCard />
              <OrderCards />
            </div>
            <MapControls />
          </div>
        </div>
        {started ? <ShiftSummary /> : <StartCard onStart={start} />}
      </div>

      {/* Mobile bottom sheet */}
      <div className="border-t border-black/[0.06] bg-white @5xl:hidden">
        <div className="flex items-center gap-1 px-2 pt-2" role="tablist">
          {(
            [
              ["inspect", "Inspector"],
              ["ops", "Operations"],
              ["track", "Tracking"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={sheet === id}
              onClick={() => setSheet(id)}
              className={cn("min-h-10 flex-1 rounded-lg text-[13px] font-semibold", sheet === id ? "bg-indigo-50 text-indigo-700" : "text-slate-500")}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="space-y-2 p-2">
          {sheet === "inspect" && (
            <>
              <AutopilotToggle />
              <Inspector />
            </>
          )}
          {sheet === "ops" && (
            <div className="h-80">
              <OpsPanel />
            </div>
          )}
          {sheet === "track" && <ShipmentTracking compact />}
        </div>
      </div>
    </div>
    </div>
  );
}
