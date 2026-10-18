"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { siteIds } from "./data";
import {
  assignForkliftToDock,
  buyUpgrade,
  chooseEvent,
  createWorld,
  defaultProgress,
  nextShiftProgress,
  respondOrder,
  sendForkliftToCharge,
  sendTruckToDock,
  tick,
  toggleDockService,
  UPGRADE_COST,
} from "./sim";
import type { GameProgress, Selection, SiteId, World } from "./types";

export const SAVE_KEY = "shettysdesk.command.v1";

function loadProgress(): GameProgress {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(SAVE_KEY) : null;
    if (raw) return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {}
  return defaultProgress;
}

function saveProgress(p: GameProgress) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(p));
  } catch {}
}

export type CommandStore = World & {
  tick: (dt: number) => void;
  select: (s: Selection | null, fly?: boolean) => void;
  setSite: (site: SiteId) => void;
  cycleSite: (dir: 1 | -1) => void;
  setView: (v: World["view"]) => void;
  setSpeed: (s: World["speed"]) => void;
  setAutopilot: (on: boolean) => void;
  respondOrder: (id: string, answer: "accept" | "rush" | "decline") => void;
  chooseEvent: (option: 0 | 1) => void;
  sendTruckToDock: (truck: string, dock: string) => void;
  assignForklift: (forklift: string, dock: string) => void;
  chargeForklift: (forklift: string) => void;
  toggleDock: (dock: string) => void;
  buyUpgrade: (kind: keyof typeof UPGRADE_COST, site: SiteId) => void;
  nextShift: () => void;
  restart: () => void;
  hydrate: () => void;
};

export const useCommand = create<CommandStore>()(
  immer((set, get) => ({
    ...createWorld(),
    tick: (dt) =>
      set((w) => {
        const wasOver = w.shiftOver;
        tick(w, dt);
        if (!wasOver && w.shiftOver) saveProgress(JSON.parse(JSON.stringify(w.progress)));
      }),
    select: (s, fly = true) =>
      set((w) => {
        w.selection = s;
        if (s && s.kind !== "site") {
          const site = s.id.slice(0, 5) as SiteId;
          const owner =
            w.trucks[s.id]?.site ?? w.forklifts[s.id]?.site ?? w.pallets[s.id]?.site ?? w.docks[s.id]?.site ?? w.chargers[s.id]?.site ?? site;
          if (siteIds.includes(owner)) {
            w.activeSite = owner;
            w.view = "site";
          }
        } else if (s?.kind === "site") {
          w.activeSite = s.id;
          w.view = "site";
        }
        if (fly) w.focusNonce++;
      }),
    setSite: (site) =>
      set((w) => {
        w.activeSite = site;
        w.view = "site";
        w.selection = { kind: "site", id: site };
        w.focusNonce++;
      }),
    cycleSite: (dir) => {
      const i = siteIds.indexOf(get().activeSite);
      get().setSite(siteIds[(i + dir + siteIds.length) % siteIds.length]);
    },
    setView: (v) =>
      set((w) => {
        w.view = v;
        w.focusNonce++;
      }),
    setSpeed: (s) => set((w) => void (w.speed = w.shiftOver ? 0 : s)),
    setAutopilot: (on) => set((w) => void (w.autopilot = on)),
    respondOrder: (id, answer) => set((w) => respondOrder(w, id, answer)),
    chooseEvent: (option) => set((w) => chooseEvent(w, option)),
    sendTruckToDock: (truck, dock) => set((w) => void sendTruckToDock(w, truck, dock)),
    assignForklift: (forklift, dock) => set((w) => void assignForkliftToDock(w, forklift, dock)),
    chargeForklift: (forklift) => set((w) => void sendForkliftToCharge(w, forklift)),
    toggleDock: (dock) => set((w) => toggleDockService(w, dock)),
    buyUpgrade: (kind, site) =>
      set((w) => {
        if (buyUpgrade(w, kind, site)) saveProgress(JSON.parse(JSON.stringify(w.progress)));
      }),
    nextShift: () => {
      const progress = nextShiftProgress(get() as World);
      saveProgress(progress);
      set(() => ({ ...createWorld(Date.now() % 100000, progress), speed: 1 as const }));
    },
    restart: () => {
      saveProgress(defaultProgress);
      set(() => createWorld(7, defaultProgress));
    },
    hydrate: () => {
      const progress = loadProgress();
      set(() => createWorld(7 + progress.shift, progress));
    },
  }))
);
