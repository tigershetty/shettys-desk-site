"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Vector3, type Mesh } from "three";
import type { Twin } from "@/lib/twin/engine";
import type { Shipment, Site } from "@/lib/twin/model";

const KIND_COLOR: Record<Site["kind"], string> = {
  supplier: "#64748b",
  plant: "#4f46e5",
  dc: "#14b8a6",
  market: "#f59e0b",
};
const MODE_COLOR = { sea: "#38bdf8", road: "#94a3b8", air: "#f43f5e" } as const;

type Props = {
  twin: Twin;
  tick: number;
  /** Bumped every simulated day so the scene re-reads the mutable twin. */
  /** Fraction of the current day elapsed, for smooth shipment motion. */
  dayFraction: React.MutableRefObject<number>;
  selected: string | null;
  onSelect: (id: string | null) => void;
  lite?: boolean;
};

function pos(site: Site, y = 0): [number, number, number] {
  return [site.pos[0], y, site.pos[1]];
}

// Height encodes the stock that matters at each kind of site.
function nodeHeight(twin: Twin, site: Site) {
  if (site.kind === "market") return 0.2;
  const st = twin.sites[site.id];
  const mu = Math.max(twin.meanDemand(site.id), 1);
  const level = site.kind === "dc" ? st.onHand / (mu * 10) : site.kind === "plant" ? st.components / (mu * 30) : 0.4;
  return Math.max(0.15, Math.min(2.4, 0.3 + level * 2));
}

function Node({ site, twin, selected, onSelect }: { site: Site; twin: Twin; selected: boolean; onSelect: (id: string) => void }) {
  const color = twin.sites[site.id].stockoutToday ? "#ef4444" : KIND_COLOR[site.kind];
  const [x, , z] = pos(site);
  const h = nodeHeight(twin, site);

  return (
    <group
      position={[x, 0, z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(site.id);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      {site.kind === "market" ? (
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.2, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ) : (
        <mesh position={[0, h / 2, 0]} castShadow>
          <boxGeometry args={[1.1, h, 1.1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
      {site.kind === "plant" && (
        <mesh position={[0.35, h + 0.35, 0.35]}>
          <cylinderGeometry args={[0.12, 0.15, 0.7, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      )}
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.1, 40]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      )}
    </group>
  );
}

function ShipmentMesh({ s, twin, dayFraction }: { s: Shipment; twin: Twin; dayFraction: Props["dayFraction"] }) {
  const ref = useRef<Mesh>(null);
  const from = twin.site(s.from);
  const to = twin.site(s.to);
  useFrame(() => {
    if (!ref.current) return;
    const t = Math.min(1, Math.max(0, (twin.day - 1 - s.dispatched + dayFraction.current) / Math.max(1, s.arrives - s.dispatched)));
    const lift = s.mode === "air" ? Math.sin(Math.PI * t) * 2.2 : 0;
    ref.current.position.set(from.pos[0] + (to.pos[0] - from.pos[0]) * t, 0.2 + lift, from.pos[1] + (to.pos[1] - from.pos[1]) * t);
  });
  const size = Math.min(0.55, 0.18 + s.qty / 6000);
  return (
    <mesh ref={ref}>
      <boxGeometry args={[size, size * 0.7, size]} />
      <meshStandardMaterial color={s.mode === "air" ? MODE_COLOR.air : "#fbbf24"} />
    </mesh>
  );
}

function Network({ twin, dayFraction, selected, onSelect }: Omit<Props, "lite" | "tick">) {
  const lanes = useMemo(
    () =>
      twin.network.lanes.map((l) => ({
        key: l.from + l.to,
        points: [pos(twin.site(l.from), 0.05), pos(twin.site(l.to), 0.05)] as [number, number, number][],
        color: MODE_COLOR[l.mode],
        dashed: l.mode === "sea",
      })),
    [twin]
  );
  // Market deliveries are short and numerous; draw only the inbound flows.
  const moving = twin.shipments.filter((s) => twin.site(s.to).kind !== "market").slice(0, 80);

  return (
    <group>
      {lanes.map((l) => (
        <Line key={l.key} points={l.points} color={l.color} lineWidth={2} dashed={l.dashed} dashSize={0.4} gapSize={0.3} />
      ))}
      {twin.network.sites.map((s) => (
        <Node key={s.id} site={s} twin={twin} selected={selected === s.id} onSelect={onSelect} />
      ))}
      {moving.map((s) => (
        <ShipmentMesh key={s.id} s={s} twin={twin} dayFraction={dayFraction} />
      ))}
    </group>
  );
}

// Positions the DOM labels over their sites every frame (cheaper and more
// reliable than one React root per label).
function LabelProjector({ twin, labels }: { twin: Twin; labels: React.MutableRefObject<(HTMLSpanElement | null)[]> }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    twin.network.sites.forEach((site, i) => {
      const el = labels.current[i];
      if (!el) return;
      v.set(site.pos[0], nodeHeight(twin, site) + (site.kind === "plant" ? 0.9 : 0.35), site.pos[1]).project(camera);
      const visible = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
      el.style.opacity = visible ? "1" : "0";
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -100%)`;
    });
  });
  return null;
}

// Pull the camera back on narrow canvases so the whole board stays in frame.
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const k = Math.max(1.08, 1.8 / aspect);
    camera.position.set(0, 13 * k, 13 * k);
    camera.lookAt(0, 0, 0);
  }, [camera, size.width, size.height]);
  return null;
}

export default function Scene3D(props: Props) {
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows={!props.lite}
        dpr={props.lite ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 13, 13], fov: 42 }}
        onPointerMissed={() => props.onSelect(null)}
        aria-label="3D supply chain network"
      >
        <color attach="background" args={["#f8fafc"]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[6, 12, 4]} intensity={1.1} castShadow={!props.lite} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 20]} />
          <meshStandardMaterial color="#eef2f7" />
        </mesh>
        <gridHelper args={[30, 30, "#cbd5e1", "#e2e8f0"]} position={[0, 0.01, 0]} />
        <CameraRig />
        <LabelProjector twin={props.twin} labels={labels} />
        <Network {...props} />
        <OrbitControls enablePan={false} minDistance={9} maxDistance={48} maxPolarAngle={Math.PI / 2.3} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {props.twin.network.sites.map((site, i) => (
          <span
            key={site.id}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="absolute left-0 top-0 whitespace-nowrap rounded-md border border-black/10 bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-900 shadow-sm opacity-0"
          >
            {site.name}
          </span>
        ))}
      </div>
    </div>
  );
}
