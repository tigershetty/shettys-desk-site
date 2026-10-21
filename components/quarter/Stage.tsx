"use client";

import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef } from "react";
import { QuadraticBezierCurve3, Vector3, type Group, type Mesh, type MeshStandardMaterial, type PerspectiveCamera } from "three";
import { siteById, sites } from "@/lib/command/data";
import { layouts } from "@/lib/command/layout";
import type { SiteId } from "@/lib/command/types";
import type { Week } from "@/lib/quarter/engine";
import { City } from "../command/scene/City";
import { C } from "../command/scene/look";
import { AmbientYard } from "../command/scene/Vehicles";
import { Yard } from "../command/scene/Yard";

// The 3D stage for One Quarter. The network board shows the state of the
// current week: stock cover per site, flow along each lane, and the
// disruption. Clicking a site flies into its yard for a closer look.

export const NET = { x: 340, z: -420, scale: 6 };
const mapPoint = (p: [number, number], y = 0.4) => new Vector3(NET.x + p[0] * NET.scale, y, NET.z + p[1] * NET.scale);

type NodeId = SiteId | "ASIA" | "EU2";
const extra: Record<"ASIA" | "EU2", [number, number]> = { ASIA: [-30, 6], EU2: [16, 4] };
const pos = (id: NodeId) => mapPoint(id === "ASIA" || id === "EU2" ? extra[id] : siteById[id].mapPos);

type Lane = { from: NodeId; to: NodeId; kind: "sea" | "road" | "air" | "second" };
const lanes: Lane[] = [
  { from: "ASIA", to: "NL-01", kind: "sea" },
  { from: "NL-01", to: "SE-01", kind: "road" },
  { from: "SE-01", to: "DE-01", kind: "road" },
  { from: "SE-01", to: "IT-01", kind: "road" },
  { from: "DE-01", to: "PL-01", kind: "road" },
  { from: "ASIA", to: "DE-01", kind: "air" },
  { from: "EU2", to: "SE-01", kind: "second" },
];

function curveOf(l: Lane) {
  const a = pos(l.from);
  const b = pos(l.to);
  const mid = a.clone().lerp(b, 0.5);
  const side = new Vector3(-(b.z - a.z), 0, b.x - a.x).normalize().multiplyScalar(a.distanceTo(b) * 0.16);
  mid.add(side);
  if (l.kind === "air") mid.y = 30;
  return new QuadraticBezierCurve3(a, mid, b);
}

/** Share of network stock each site holds, for the stock columns. */
const stockShare: Partial<Record<SiteId, number>> = { "NL-01": 0.15, "SE-01": 0.2, "DE-01": 0.3, "IT-01": 0.2, "PL-01": 0.15 };

export type StageProps = {
  week: Week | null;
  drill: SiteId | null;
  onDrill: (site: SiteId | null) => void;
  lite: boolean;
};

const hover = {
  onPointerOver: (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  },
  onPointerOut: () => {
    document.body.style.cursor = "";
  },
};

function coverColor(cover: number) {
  return cover < 0.3 ? C.red : cover < 1 ? C.amber : C.green;
}

function SiteNode({ id, week, onDrill }: { id: SiteId; week: Week | null; onDrill: StageProps["onDrill"] }) {
  const def = siteById[id];
  const p = pos(id);
  const cover = (week?.cover ?? 1) * (stockShare[id] ?? 0.2) * 5;
  const h = Math.max(0.4, Math.min(16, cover * 6));
  const whiteRoof = def.type === "cold" || def.type === "robotics";
  const ring = useRef<Mesh>(null);
  const alert =
    (week?.disruption === "spike" && def.type !== "plant" && def.type !== "cold") ||
    (week?.disruption === "shortage" && id === "SE-01") ||
    (week?.disruption === "outage" && id === "NL-01");
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const s = alert ? 1 + ((clock.elapsedTime * 0.8) % 1) * 0.8 : 1;
    ring.current.scale.set(s, s, 1);
    (ring.current.material as MeshStandardMaterial).opacity = alert ? 0.7 * (1 - ((clock.elapsedTime * 0.8) % 1)) : 0;
  });
  return (
    <group
      position={[p.x, 0, p.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta < 6) onDrill(id);
      }}
      {...hover}
    >
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[8, 8, 0.3, 40]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-1.5, 2.1, 0]} castShadow>
        <boxGeometry args={[7, 3.6, 5]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>
      <mesh position={[-1.5, 4.05, 0]} castShadow>
        <boxGeometry args={[7.4, 0.3, 5.4]} />
        <meshStandardMaterial color={whiteRoof ? C.white : C.roof} />
      </mesh>
      {def.type === "plant" && (
        <mesh position={[0.5, 5.6, -1.2]} castShadow>
          <cylinderGeometry args={[0.4, 0.5, 3.4, 10]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      )}
      {/* stock column: height is weeks of cover held here */}
      <mesh position={[4.6, h / 2 + 0.3, 0]} castShadow>
        <boxGeometry args={[1.6, h, 1.6]} />
        <meshStandardMaterial color={coverColor(cover)} />
      </mesh>
      <mesh ref={ring} position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.4, 9.4, 48]} />
        <meshStandardMaterial color={week?.disruption === "spike" ? C.amber : C.red} transparent opacity={0} />
      </mesh>
    </group>
  );
}

function LaneView({ lane, week }: { lane: Lane; week: Week | null }) {
  const curve = useMemo(() => curveOf(lane), [lane]);
  const pts = useMemo(() => curve.getPoints(40), [curve]);
  const tokens = useRef<(Group | null)[]>([]);
  const outage = week?.disruption === "outage";
  const active = lane.kind === "air" ? !!week?.air : lane.kind === "second" ? !!week?.secondSource : true;
  const blocked = lane.kind === "sea" && outage;
  const flow = week ? Math.max(0.15, week.supplied / Math.max(1, week.demand)) : 1;
  const n = lane.kind === "sea" ? 3 : 2;
  useFrame(({ clock }) => {
    tokens.current.forEach((g, i) => {
      if (!g) return;
      g.visible = active;
      const speed = blocked ? 0.01 : lane.kind === "air" ? 0.12 : 0.05 * flow;
      const u = (clock.elapsedTime * speed + i / n) % 1;
      const p = curve.getPointAt(u);
      const d = curve.getTangentAt(u);
      g.position.copy(p);
      g.rotation.y = Math.atan2(d.x, d.z);
    });
  });
  if (!active) return null;
  const color = blocked ? C.red : lane.kind === "sea" ? "#60a5fa" : lane.kind === "air" ? C.amber : lane.kind === "second" ? C.teal : C.roof;
  return (
    <>
      <Line points={pts} color={color} lineWidth={blocked ? 3 : 2} dashed dashSize={2.2} gapSize={1.6} />
      {Array.from({ length: n }, (_, i) => (
        <group
          key={i}
          ref={(g) => {
            tokens.current[i] = g;
          }}
        >
          {lane.kind === "sea" ? (
            <>
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[2.6, 1, 8]} />
                <meshStandardMaterial color="#1e3a8a" />
              </mesh>
              <mesh position={[0, 1.4, 0.5]}>
                <boxGeometry args={[2.2, 0.9, 4.5]} />
                <meshStandardMaterial color={C.teal} />
              </mesh>
            </>
          ) : lane.kind === "air" ? (
            <>
              <mesh>
                <boxGeometry args={[1, 1, 6]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
              <mesh>
                <boxGeometry args={[7, 0.2, 1.4]} />
                <meshStandardMaterial color={C.amber} />
              </mesh>
            </>
          ) : (
            <>
              <mesh position={[0, 0.8, -0.5]}>
                <boxGeometry args={[1.5, 1.5, 3.4]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0.7, 1.7]}>
                <boxGeometry args={[1.5, 1.3, 1]} />
                <meshStandardMaterial color={lane.kind === "second" ? C.teal : C.roof} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </>
  );
}

const Board = memo(function Board({ week, onDrill }: { week: Week | null; onDrill: StageProps["onDrill"] }) {
  return (
    <group>
      <mesh position={[NET.x, -0.05, NET.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[320, 240]} />
        <meshBasicMaterial color={C.land} />
      </mesh>
      {[
        [-17, -11, 8, 9, 0],
        [-27, 2, 8, 14, 0],
        [6, -11.5, 10, 3, -0.25],
        [-1, -20, 3, 6, 0.4],
        [-6, 22, 14, 3, 0],
      ].map(([x, z, rx, rz, r], i) => (
        <mesh key={i} position={[NET.x + x * NET.scale, 0.02, NET.z + z * NET.scale]} rotation={[0, r, 0]} scale={[rx * NET.scale, 1, rz * NET.scale]}>
          <cylinderGeometry args={[1, 1, 0.1, 48]} />
          <meshBasicMaterial color={C.water} />
        </mesh>
      ))}
      {lanes.map((l, i) => (
        <LaneView key={i} lane={l} week={week} />
      ))}
      {sites.map((s) => (
        <SiteNode key={s.id} id={s.id} week={week} onDrill={onDrill} />
      ))}
      {(["ASIA", "EU2"] as const).map((id) =>
        id === "EU2" && !week?.secondSource ? null : (
          <mesh key={id} position={pos(id).setY(1.5)}>
            <cylinderGeometry args={[3.2, 3.2, 3, 6]} />
            <meshStandardMaterial color={id === "ASIA" ? (week?.disruption === "outage" ? C.red : "#94a3b8") : C.teal} />
          </mesh>
        )
      )}
    </group>
  );
});

// ---------- camera ----------

function CameraRig({ drill }: { drill: SiteId | null }) {
  const { camera, size } = useThree();
  const target = useRef(new Vector3(NET.x, 0, NET.z));
  const dist = useRef(380);
  const first = useRef(true);
  const goal = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const cam = camera as PerspectiveCamera;
    if (size.width >= 900) cam.setViewOffset(size.width, size.height, size.width * 0.12, 0, size.width, size.height);
    else cam.clearViewOffset();
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.2);
    const narrow = size.width / Math.max(1, size.height) < 0.9;
    let goalDist: number;
    let elev: number;
    if (drill) {
      const o = siteById[drill].origin;
      goal.set(o[0] + 2, 0, o[1] + layouts[drill].frontZ + 6);
      goalDist = narrow ? 170 : 115;
      elev = 0.72;
    } else {
      goal.set(NET.x + 6, 0, NET.z - 4);
      goalDist = narrow ? 470 : 390;
      elev = 1.0;
    }
    if (first.current) {
      target.current.copy(goal);
      dist.current = goalDist;
      first.current = false;
    }
    const gap = target.current.distanceTo(goal);
    const k = 1 - Math.exp(-dt * 2.6);
    target.current.lerp(goal, k);
    dist.current += (goalDist + Math.min(160, gap * 0.4) - dist.current) * k;
    const az = 0.55;
    const d = dist.current;
    camera.position.set(target.current.x + Math.sin(az) * Math.cos(elev) * d, Math.sin(elev) * d, target.current.z + Math.cos(az) * Math.cos(elev) * d);
    camera.lookAt(target.current);
  });
  return null;
}

// ---------- labels ----------

const dom: { labels: (HTMLDivElement | null)[] } = { labels: [] };
const labelPoints = sites.map((s) => ({ id: s.id, p: mapPoint(s.mapPos, 7) }));

function Projector({ drill }: { drill: SiteId | null }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    labelPoints.forEach((m, i) => {
      const el = dom.labels[i];
      if (!el) return;
      if (drill) {
        el.style.opacity = "0";
        return;
      }
      v.copy(m.p).project(camera);
      el.style.opacity = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05 ? "1" : "0";
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -100%)`;
    });
  });
  return null;
}

function Sun({ lite }: { lite: boolean }) {
  const ref = useRef<import("three").DirectionalLight>(null);
  const { camera } = useThree();
  useFrame(() => {
    const l = ref.current;
    if (!l) return;
    const t = camera.position;
    l.position.set(t.x - 20, 160, t.z - 60);
    l.target.position.set(t.x - 60, 0, t.z - 160);
    l.target.updateMatrixWorld();
  });
  return (
    <directionalLight
      ref={ref}
      intensity={1.15}
      castShadow={!lite}
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-120}
      shadow-camera-right={120}
      shadow-camera-top={120}
      shadow-camera-bottom={-120}
      shadow-camera-near={10}
      shadow-camera-far={400}
      shadow-bias={-0.0004}
    />
  );
}

export default function Stage({ week, drill, onDrill, lite }: StageProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        flat
        shadows={lite ? false : "percentage"}
        dpr={lite ? [1, 1.25] : [1, 1.75]}
        camera={{ fov: 30, near: 1, far: 2400, position: [500, 330, -100] }}
        gl={{ antialias: !lite, powerPreference: "high-performance" }}
        aria-label="3D map of the supply network"
      >
        <color attach="background" args={["#eef0fa"]} />
        <hemisphereLight args={["#ffffff", "#c7cbe6", 0.75]} />
        <ambientLight intensity={0.3} />
        <Sun lite={lite} />
        <CameraRig drill={drill} />
        <Projector drill={drill} />
        <Board week={week} onDrill={onDrill} />
        {drill && (
          <>
            <City lite />
            <Yard site={drill} lite={lite} />
            <AmbientYard site={drill} />
          </>
        )}
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {labelPoints.map((m, i) => (
          <div
            key={m.id}
            ref={(el) => {
              dom.labels[i] = el;
            }}
            className="absolute left-0 top-0 whitespace-nowrap rounded-lg border border-black/5 bg-white/95 px-2 py-1 text-[11px] leading-tight text-slate-900 opacity-0 shadow-[0_6px_18px_rgba(30,27,75,0.12)]"
          >
            <span className="mr-1 rounded bg-indigo-50 px-1 font-mono text-[10px] font-semibold text-indigo-600">{m.id}</span>
            <span className="font-semibold">{siteById[m.id].name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
