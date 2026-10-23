"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CatmullRomCurve3, Vector3, type Group, type Mesh, type PerspectiveCamera } from "three";
import { islandOrder, islands, thread, type IslandId } from "@/lib/scor";

// The SCOR model as an archipelago. Four process islands ring the Enable
// island at the centre, bridges join them, and a red thread runs between
// them in the order the career actually went. Display only: the page owns
// the selection.

const ISLAND_R: Record<IslandId, number> = { plan: 10, source: 10, make: 10, deliver: 10, enable: 11 };

const box = (x: number, y: number, z: number, w: number, h: number, d: number, color: string, key?: string) => (
  <mesh key={key} position={[x, y, z]} castShadow receiveShadow>
    <boxGeometry args={[w, h, d]} />
    <meshStandardMaterial color={color} roughness={0.8} />
  </mesh>
);

function Tree({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 1.6, 6]} />
        <meshStandardMaterial color="#8b6b4a" />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#5ccf7e" flatShading />
      </mesh>
    </group>
  );
}

function PlanLandmark() {
  // a planning tower: the control room with a glowing schedule on its face
  const screen = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const m = screen.current?.material as { emissiveIntensity: number } | undefined;
    if (m) m.emissiveIntensity = 0.7 + Math.sin(clock.elapsedTime * 2) * 0.2;
  });
  return (
    <group>
      {box(0, 3, 0, 4, 6, 4, "#f1f5f9")}
      {box(0, 7.2, 0, 6.4, 2.4, 6.4, "#e0e7ff")}
      {box(0, 8.6, 0, 6.8, 0.4, 6.8, "#4f46e5")}
      <mesh ref={screen} position={[0, 7.2, 3.22]}>
        <planeGeometry args={[5.4, 1.8]} />
        <meshStandardMaterial color="#312e81" emissive="#6366f1" emissiveIntensity={0.8} />
      </mesh>
      {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
        <mesh key={x} position={[x, 6.8 + [0.3, 0.6, 0.2, 0.8][i] / 2, 3.24]}>
          <planeGeometry args={[0.7, 0.3 + [0.3, 0.6, 0.2, 0.8][i]]} />
          <meshBasicMaterial color="#a5b4fc" />
        </mesh>
      ))}
      <mesh position={[0, 10.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 3.2, 6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 12.1, 0]}>
        <sphereGeometry args={[0.3, 10, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function SourceLandmark() {
  const containers: [number, number, number, string][] = [
    [-2.6, 0.75, 2.4, "#0d9488"],
    [0.6, 0.75, 2.4, "#f59e0b"],
    [-2.6, 2.25, 2.4, "#4f46e5"],
    [3.6, 0.75, 2.4, "#0d9488"],
    [0.6, 2.25, 2.4, "#14b8a6"],
  ];
  return (
    <group>
      {box(-1, 2, -2.4, 7, 4, 4.4, "#e7e9ef")}
      {box(-1, 4.25, -2.4, 7.4, 0.5, 4.8, "#0d9488")}
      {containers.map(([x, y, z, c], i) => (
        <group key={i}>
          {box(x, y, z, 3, 1.5, 1.4, c)}
        </group>
      ))}
      {/* crane */}
      {box(5, 3.5, -1, 0.4, 7, 0.4, "#f59e0b")}
      {box(3.2, 7, -1, 4, 0.4, 0.4, "#f59e0b")}
    </group>
  );
}

function MakeLandmark() {
  const smoke = useRef<Group>(null);
  useFrame(({ clock }) => {
    smoke.current?.children.forEach((c, i) => {
      const t = (clock.elapsedTime * 0.4 + i / 3) % 1;
      c.position.y = 8 + t * 4;
      c.scale.setScalar(0.6 + t * 1.2);
      ((c as Mesh).material as { opacity: number }).opacity = 0.6 * (1 - t);
    });
  });
  return (
    <group>
      {box(0, 2, 0, 9, 4, 6, "#e7e9ef")}
      {[-3, 0, 3].map((x) => (
        <mesh key={x} position={[x, 4.9, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[2.1, 2.1, 6]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      ))}
      {[2.6, 4].map((x) => (
        <mesh key={x} position={[x, 5, -2.2]} castShadow>
          <cylinderGeometry args={[0.45, 0.55, 6, 10]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      ))}
      <group ref={smoke} position={[3.3, 0, -2.2]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.7, 10, 8]} />
            <meshStandardMaterial color="#e2e8f0" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function DeliverLandmark() {
  const truck = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (truck.current) truck.current.position.x = -5 + ((clock.elapsedTime * 1.5) % 10);
  });
  return (
    <group>
      {box(0, 2.2, -2, 8, 4.4, 5, "#e7e9ef")}
      {box(0, 4.6, -2, 8.4, 0.4, 5.4, "#e11d48")}
      {[-2.5, 0, 2.5].map((x) => box(x, 1.4, 0.52, 1.8, 2.6, 0.1, "#2b2f45", "d" + x))}
      <group ref={truck} position={[0, 0, 3.4]}>
        {box(-0.6, 1.1, 0, 3, 1.8, 1.4, "#ffffff")}
        {box(1.4, 0.9, 0, 1.1, 1.4, 1.4, "#4f46e5")}
        {[-1.6, 0.4, 1.5].map((x) => (
          <mesh key={x} position={[x, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 1.5, 10]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function EnableLandmark() {
  // a lighthouse: what guides the other processes
  const beam = useRef<Group>(null);
  useFrame((_, dt) => {
    if (beam.current) beam.current.rotation.y += dt * 0.8;
  });
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 1.4 + i * 2.4, 0]} castShadow>
          <cylinderGeometry args={[1.5 - i * 0.18, 1.68 - i * 0.18, 2.4, 14]} />
          <meshStandardMaterial color={i % 2 ? "#4f46e5" : "#f8fafc"} />
        </mesh>
      ))}
      <mesh position={[0, 11, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 1.4, 12]} />
        <meshStandardMaterial color="#fde68a" emissive="#f59e0b" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 12.1, 0]}>
        <coneGeometry args={[1.3, 1.2, 12]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      <group ref={beam} position={[0, 11, 0]}>
        <mesh position={[5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[1.6, 10, 16, 1, true]} />
          <meshBasicMaterial color="#fde68a" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      </group>
      {/* the people on the island */}
      {[
        [-4, 3],
        [-3, 4.4],
        [4, 3.5],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.7, 0]}>
            <capsuleGeometry args={[0.35, 0.7, 4, 8]} />
            <meshStandardMaterial color={["#0d9488", "#f59e0b", "#4f46e5"][i]} />
          </mesh>
          <mesh position={[0, 1.6, 0]}>
            <sphereGeometry args={[0.3, 10, 8]} />
            <meshStandardMaterial color="#f1c7a3" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const landmarks: Record<IslandId, () => React.ReactElement> = {
  plan: PlanLandmark,
  source: SourceLandmark,
  make: MakeLandmark,
  deliver: DeliverLandmark,
  enable: EnableLandmark,
};

function IslandMesh({ id, selected, onSelect }: { id: IslandId; selected: boolean; onSelect: (id: IslandId) => void }) {
  const isl = islands[id];
  const r = ISLAND_R[id];
  const Landmark = landmarks[id];
  const ring = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const s = selected ? 1 + Math.sin(clock.elapsedTime * 3) * 0.02 : 1;
    ring.current.scale.set(s, s, 1);
  });
  const trees = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + id.length;
      out.push([Math.cos(a) * (r - 2), Math.sin(a) * (r - 2), 0.8 + (i % 3) * 0.15]);
    }
    return out;
  }, [id, r]);
  return (
    <group
      position={[isl.pos[0], 0, isl.pos[1]]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (e.delta < 6) onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      {/* cliff and grass */}
      <mesh position={[0, -1.6, 0]} receiveShadow>
        <cylinderGeometry args={[r, r * 0.82, 3.2, 9]} />
        <meshStandardMaterial color="#e7d6b1" flatShading />
      </mesh>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[r + 0.2, r, 0.5, 9]} />
        <meshStandardMaterial color="#a7e3a1" flatShading />
      </mesh>
      <mesh ref={ring} position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r - 0.6, r + 0.1, 9]} />
        <meshBasicMaterial color={isl.color} transparent opacity={selected ? 0.9 : 0.35} />
      </mesh>
      {trees.map(([x, z, s], i) => (
        <Tree key={i} x={x} z={z} s={s} />
      ))}
      <group position={[0, 0.4, 0]}>
        <Landmark />
      </group>
    </group>
  );
}

function Bridges() {
  return (
    <>
      {islandOrder
        .filter((id) => id !== "enable")
        .map((id) => {
          const p = islands[id].pos;
          const len = Math.hypot(p[0], p[1]) - ISLAND_R[id] - ISLAND_R.enable + 2;
          const mid = [(p[0] / 2) * 1, (p[1] / 2) * 1];
          const ang = Math.atan2(p[0], p[1]);
          return (
            <group key={id} position={[mid[0], 0.25, mid[1]]} rotation={[0, ang, 0]}>
              {box(0, 0, 0, 2.2, 0.35, len, "#b0865a")}
              {[-1.1, 1.1].map((x) => box(x, 0.6, 0, 0.12, 0.9, len, "#8b6b4a", "rail" + x))}
            </group>
          );
        })}
    </>
  );
}

function RedThread() {
  const curve = useMemo(() => {
    const pts = thread.map(({ island }, i) => {
      const p = islands[island].pos;
      const jitter = island === "enable" ? (i % 2 ? 4 : -4) : 0;
      return new Vector3(p[0] + jitter, 15 + (i % 2) * 2, p[1] + jitter);
    });
    return new CatmullRomCurve3(pts, false, "catmullrom", 0.4);
  }, []);
  const bead = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!bead.current) return;
    bead.current.position.copy(curve.getPointAt((clock.elapsedTime * 0.05) % 1));
  });
  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 220, 0.22, 8, false]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.35} />
      </mesh>
      <mesh ref={bead}>
        <sphereGeometry args={[0.7, 14, 12]} />
        <meshStandardMaterial color="#fff1f2" emissive="#ef4444" emissiveIntensity={1.2} />
      </mesh>
    </>
  );
}

function CameraRig({ focus }: { focus: IslandId | null }) {
  const { camera, size } = useThree();
  const target = useRef(new Vector3(0, 0, 0));
  const dist = useRef(120);
  const goal = useMemo(() => new Vector3(), []);
  useEffect(() => {
    (camera as PerspectiveCamera).updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.2);
    const narrow = size.width / Math.max(1, size.height) < 1;
    if (focus) {
      const p = islands[focus].pos;
      goal.set(p[0], 3, p[1]);
    } else goal.set(0, 0, 2);
    const goalDist = focus ? (narrow ? 64 : 52) : narrow ? 205 : 150;
    const k = 1 - Math.exp(-dt * 2.4);
    target.current.lerp(goal, k);
    dist.current += (goalDist - dist.current) * k;
    const elev = 0.78;
    const az = 0.42;
    const d = dist.current;
    camera.position.set(target.current.x + Math.sin(az) * Math.cos(elev) * d, target.current.y + Math.sin(elev) * d, target.current.z + Math.cos(az) * Math.cos(elev) * d);
    camera.lookAt(target.current);
  });
  return null;
}

// DOM labels follow the islands.
const dom: (HTMLButtonElement | null)[] = [];
function Labels() {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    islandOrder.forEach((id, i) => {
      const el = dom[i];
      if (!el) return;
      const p = islands[id].pos;
      v.set(p[0], 15, p[1]).project(camera);
      el.style.opacity = v.z < 1 ? "1" : "0";
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px) translate(-50%, -100%)`;
    });
  });
  return null;
}

export default function ScorScene({ focus, onSelect, lite }: { focus: IslandId | null; onSelect: (id: IslandId | null) => void; lite: boolean }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        flat
        shadows={lite ? false : "percentage"}
        dpr={lite ? [1, 1.25] : [1, 1.75]}
        camera={{ fov: 32, near: 1, far: 800, position: [40, 90, 90] }}
        onPointerMissed={() => onSelect(null)}
        aria-label="The SCOR model as islands: Plan, Source, Make and Deliver around Enable"
      >
        <color attach="background" args={["#e8f1fb"]} />
        <hemisphereLight args={["#ffffff", "#b8c4e6", 0.85]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[40, 80, 30]}
          intensity={1.1}
          castShadow={!lite}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-70}
          shadow-camera-right={70}
          shadow-camera-top={70}
          shadow-camera-bottom={-70}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
          <circleGeometry args={[260, 64]} />
          <meshBasicMaterial color="#cfe3fb" />
        </mesh>
        <CameraRig focus={focus} />
        <Labels />
        <Bridges />
        {islandOrder.map((id) => (
          <IslandMesh key={id} id={id} selected={focus === id} onSelect={onSelect} />
        ))}
        <RedThread />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {islandOrder.map((id, i) => (
          <button
            key={id}
            type="button"
            ref={(el) => {
              dom[i] = el;
            }}
            onClick={() => onSelect(id)}
            className="pointer-events-auto absolute left-0 top-0 rounded-full border-2 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-foreground opacity-0 shadow-md transition-colors hover:bg-neutral-50"
            style={{ borderColor: islands[id].color }}
          >
            {islands[id].label}
          </button>
        ))}
      </div>
    </div>
  );
}
