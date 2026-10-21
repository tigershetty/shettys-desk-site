"use client";

import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BufferGeometry, Float32BufferAttribute, Vector3, type Group, type LineSegments, type PerspectiveCamera } from "three";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { siteById, siteIds } from "@/lib/command/data";
import { truckStatus, forkliftStatus } from "@/lib/command/kpis";
import { dockPaths } from "@/lib/command/layout";
import { focusOf, selectionHeading } from "@/lib/command/poses";
import { useCommand } from "@/lib/command/store";
import type { SiteId, World } from "@/lib/command/types";
import { City } from "./City";
import { mapLabelPoints, NET, NetworkBoard } from "./Network";
import { Vehicles } from "./Vehicles";
import { Yard } from "./Yard";

// ---------- camera controls shared with the UI buttons ----------

export const useView = create<{ zoom: number; azimuth: number; zoomBy: (k: number) => void; rotate: (d: number) => void; home: () => void }>((set) => ({
  zoom: 1,
  azimuth: 0,
  zoomBy: (k) => set((s) => ({ zoom: Math.min(2.2, Math.max(0.45, s.zoom * k)) })),
  rotate: (d) => set((s) => ({ azimuth: s.azimuth + d })),
  home: () => set({ zoom: 1, azimuth: 0 }),
}));

const BASE_AZ = 0.62;

function CameraRig() {
  const { camera, size } = useThree();
  const target = useRef(new Vector3(2, 0, 12));
  const dist = useRef(80);
  const az = useRef(BASE_AZ);
  const nonce = useRef(-1);
  const tmp = useMemo(() => new Vector3(), []);

  // On wide screens the panels cover the right and bottom edges, so shift the
  // picture so the focus sits in the middle of the open canvas.
  useEffect(() => {
    const cam = camera as PerspectiveCamera;
    if (size.width >= 900) cam.setViewOffset(size.width, size.height, size.width * 0.09, size.height * 0.04, size.width, size.height);
    else cam.clearViewOffset();
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.2);
    const w = useCommand.getState();
    const v = useView.getState();
    const narrow = size.width / Math.max(1, size.height) < 0.9;
    let goal: Vector3;
    let goalDist: number;
    let elev: number;
    if (w.view === "network") {
      goal = tmp.set(NET.x + 10, 0, NET.z - 20);
      goalDist = (narrow ? 600 : 400) * v.zoom;
      elev = 1.0;
    } else {
      const f = focusOf(w, w.selection);
      goal = tmp.set(f.x, 0, f.z);
      const close = w.selection && w.selection.kind !== "site";
      goalDist = (close ? 46 : 112) * (narrow ? 1.6 : 1) * v.zoom;
      elev = 0.72;
    }
    if (nonce.current === -1) {
      target.current.copy(goal);
      dist.current = goalDist;
    }
    nonce.current = w.focusNonce;
    const gap = target.current.distanceTo(goal);
    const k = 1 - Math.exp(-dt * 2.4);
    target.current.lerp(goal, k);
    // Pull back while travelling far, so switching sites feels like a fly-over.
    const travel = Math.min(140, gap * 0.55);
    dist.current += (goalDist + travel - dist.current) * k;
    az.current += (BASE_AZ + v.azimuth - az.current) * k;
    const d = dist.current;
    camera.position.set(
      target.current.x + Math.sin(az.current) * Math.cos(elev) * d,
      Math.sin(elev) * d,
      target.current.z + Math.cos(az.current) * Math.cos(elev) * d
    );
    camera.lookAt(target.current);
  });
  return null;
}

// ---------- selection ----------

function bracketGeometry() {
  const pts: number[] = [];
  const L = 0.22;
  for (const x of [-0.5, 0.5])
    for (const y of [0, 1])
      for (const z of [-0.5, 0.5]) {
        const sx = -Math.sign(x) * L;
        const sy = y === 0 ? L : -L;
        const sz = -Math.sign(z) * L;
        pts.push(x, y, z, x + sx, y, z);
        pts.push(x, y, z, x, y + sy, z);
        pts.push(x, y, z, x, y, z + sz);
      }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pts, 3));
  return g;
}

function SelectionBox() {
  const ref = useRef<Group>(null);
  const lines = useRef<LineSegments>(null);
  const geom = useMemo(() => bracketGeometry(), []);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const w = useCommand.getState();
    const sel = w.selection;
    g.visible = !!sel && w.view === "site" && !(sel.kind === "truck" && ["enroute", "gone"].includes(w.trucks[sel.id]?.phase ?? "gone"));
    if (!g.visible) return;
    const f = focusOf(w, sel);
    g.position.set(f.x, 0.05, f.z);
    g.rotation.y = selectionHeading(w, sel);
    g.scale.set(f.size[0], f.size[1], f.size[2]);
  });
  return (
    <group ref={ref} visible={false}>
      <lineSegments ref={lines} geometry={geom}>
        <lineBasicMaterial color="#4f46e5" linewidth={2} />
      </lineSegments>
    </group>
  );
}

/** Dotted planned path for the selected inbound truck. */
function PlannedPath() {
  const info = useCommand(
    useShallow((s) => {
      const t = s.selection?.kind === "truck" ? s.trucks[s.selection.id] : null;
      if (!t || !["enroute", "atGate", "arriving"].includes(t.phase)) return null;
      const dock = t.dock ? s.docks[t.dock].index : Object.values(s.docks).filter((d) => d.site === t.site && d.status === "available")[0]?.index ?? 0;
      return [t.site, dock] as const;
    })
  );
  const pts = useMemo(() => {
    if (!info) return null;
    const [site, dock] = info;
    const o = siteById[site as SiteId].origin;
    const p = dockPaths[site as SiteId][dock];
    return [...p.arrive.getSpacedPoints(60), ...p.reverse.getSpacedPoints(12)].map((v) => new Vector3(v.x + o[0], 0.25, v.z + o[1]));
  }, [info]);
  if (!pts) return null;
  return <Line points={pts} color="#4f46e5" lineWidth={3} dashed dashSize={0.9} gapSize={0.9} />;
}

// ---------- DOM labels projected from 3D ----------

function chipText(w: World) {
  const sel = w.selection;
  if (!sel || w.view !== "site") return null;
  if (sel.kind === "truck" && w.trucks[sel.id]) {
    const t = w.trucks[sel.id];
    const s = truckStatus(w, t);
    return `${t.id} · ${t.phase === "reversing" ? "Reversing" : s.label}`;
  }
  if (sel.kind === "forklift" && w.forklifts[sel.id]) return `${sel.id} · ${forkliftStatus(w, sel.id).label}`;
  if (sel.kind === "pallet" && w.pallets[sel.id]) return `${sel.id} · Staged`;
  if (sel.kind === "charger" && w.chargers[sel.id]) return `${sel.id.split("-").pop()} · ${w.chargers[sel.id].forklift ? "In use" : "Free"}`;
  if (sel.kind === "dock" && w.docks[sel.id]) return `${w.docks[sel.id].label} · ${w.docks[sel.id].status === "out" ? "Out of service" : w.docks[sel.id].truck ?? "Available"}`;
  return null;
}

// DOM overlay nodes, filled by ref callbacks and positioned every frame.
const dom: { chip: HTMLDivElement | null; labels: (HTMLDivElement | null)[] } = { chip: null, labels: [] };

function Projector() {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  const last = useRef("");
  useFrame(() => {
    const w = useCommand.getState();
    const el = dom.chip;
    if (el) {
      const text = chipText(w);
      const truck = w.selection?.kind === "truck" ? w.trucks[w.selection.id] : null;
      const hiddenTruck = truck && (truck.phase === "enroute" || truck.phase === "gone");
      if (!text) el.style.opacity = "0";
      else {
        let f = focusOf(w, w.selection);
        let y = f.size[1] + 1.2;
        if (hiddenTruck && truck) {
          const p = dockPaths[truck.site][0].arrive.getPointAt(0.35);
          const o = siteById[truck.site].origin;
          f = { ...f, x: p.x + o[0], z: p.z + o[1] };
          y = 2;
        }
        v.set(f.x, y, f.z).project(camera);
        el.style.opacity = v.z < 1 ? "1" : "0";
        el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -100%)`;
        const t = hiddenTruck ? `${text}` : text;
        if (t !== last.current) {
          el.textContent = t;
          last.current = t;
        }
      }
    }
    const els = dom.labels;
    mapLabelPoints.forEach((m, i) => {
      const lab = els?.[i];
      if (!lab) return;
      if (w.view !== "network") {
        lab.style.opacity = "0";
        return;
      }
      v.copy(m.p).project(camera);
      lab.style.opacity = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05 ? "1" : "0";
      lab.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -100%)`;
    });
  });
  return null;
}

function Ticker() {
  const tick = useCommand((s) => s.tick);
  useEffect(() => {
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      tick((now - last) / 1000);
      last = now;
    }, 100);
    return () => window.clearInterval(id);
  }, [tick]);
  return null;
}

function NearbyVehicles() {
  const active = useCommand((s) => s.activeSite);
  const view = useCommand((s) => s.view);
  const i = siteIds.indexOf(active);
  const near = view === "network" ? [] : siteIds.filter((_, j) => Math.abs(j - i) <= 1);
  return <Vehicles sites={near} />;
}

function MapLabels() {
  const info = useCommand(
    useShallow((s) =>
      siteIds.map((id) => {
        const stock = Object.values(s.stock[id]).reduce((a, b) => a + b, 0);
        return `${Math.round((stock / siteById[id].capacity) * 100)}`;
      })
    )
  );
  return (
    <>
      {mapLabelPoints.map((m, i) => (
        <div
          key={m.id}
          ref={(el) => {
            dom.labels[i] = el;
          }}
          className="absolute left-0 top-0 whitespace-nowrap rounded-lg border border-black/5 bg-white/95 px-2 py-1 text-[11px] leading-tight text-slate-900 opacity-0 shadow-[0_6px_18px_rgba(30,27,75,0.12)]"
        >
          {m.id === "ASIA" ? (
            <span className="font-semibold text-sky-700">Asia lane · sea freight</span>
          ) : (
            <>
              <span className="mr-1 rounded bg-indigo-50 px-1 font-mono text-[10px] font-semibold text-indigo-600">{m.id}</span>
              <span className="font-semibold">{siteById[m.id as SiteId].name}</span>
              <span className="ml-1 text-slate-500">{info[i]}% full</span>
            </>
          )}
        </div>
      ))}
    </>
  );
}

export default function CommandScene({ lite }: { lite: boolean }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        flat
        shadows={lite ? false : "percentage"}
        dpr={lite ? [1, 1.25] : [1, 2]}
        camera={{ fov: 30, near: 1, far: 2400, position: [60, 70, 90] }}
        gl={{ antialias: !lite, powerPreference: "high-performance" }}
        onPointerMissed={() => {
          const s = useCommand.getState();
          if (s.view === "site") s.select({ kind: "site", id: s.activeSite }, false);
        }}
        onWheel={(e) => useView.getState().zoomBy(e.deltaY > 0 ? 1.08 : 0.93)}
        aria-label="3D view of the supply chain yards"
      >
        <color attach="background" args={["#eef0fa"]} />
        <fog attach="fog" args={["#eef0fa", 650, 1800]} />
        <hemisphereLight args={["#ffffff", "#c7cbe6", 0.75]} />
        <ambientLight intensity={0.3} />
        <SunLight lite={lite} />
        <CameraRig />
        <Ticker />
        <City lite={lite} />
        {siteIds.map((id) => (
          <Yard key={id} site={id} lite={lite} />
        ))}
        <NearbyVehicles />
        <NetworkBoard />
        <SelectionBox />
        <PlannedPath />
        <Projector />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          ref={(el) => {
            dom.chip = el;
          }}
          className="absolute left-0 top-0 whitespace-nowrap rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-[0_6px_16px_rgba(79,70,229,0.35)]"
        />
        <MapLabels />
      </div>
    </div>
  );
}

/** Sun that follows the camera target so shadows stay crisp wherever you look. */
function SunLight({ lite }: { lite: boolean }) {
  const ref = useRef<import("three").DirectionalLight>(null);
  const { camera } = useThree();
  const dir = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const l = ref.current;
    if (!l) return;
    camera.getWorldDirection(dir);
    const t = camera.position.clone().add(dir.multiplyScalar(camera.position.y / Math.max(0.2, -dir.y) || 80));
    l.position.set(t.x + 40, 90, t.z + 30);
    l.target.position.set(t.x, 0, t.z);
    l.target.updateMatrixWorld();
  });
  return (
    <directionalLight
      ref={ref}
      intensity={1.15}
      castShadow={!lite}
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-90}
      shadow-camera-right={90}
      shadow-camera-top={90}
      shadow-camera-bottom={-90}
      shadow-camera-near={10}
      shadow-camera-far={260}
      shadow-bias={-0.0004}
    />
  );
}
