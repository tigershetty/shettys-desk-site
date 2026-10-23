"use client";

import { useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import type { Group } from "three";
import { useShallow } from "zustand/react/shallow";
import { carriers } from "@/lib/command/data";
import { forkliftPose, truckPose } from "@/lib/command/poses";
import { useCommand } from "@/lib/command/store";
import type { Carrier, SiteId } from "@/lib/command/types";
import { C, liveryTexture } from "./look";
import { clickSelect, hover } from "./Yard";

// Vehicles are display-only: each one reads its pose from the store every
// frame instead of re-rendering React on every simulation tick.

function smoothAngle(from: number, to: number, k: number) {
  let d = to - from;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return from + d * k;
}

export function TruckModel({ carrier }: { carrier: Carrier }) {
  const c = carriers[carrier];
  const house = carrier === "house";
  const livery = useMemo(() => liveryTexture(c.name, c.stripe, house), [c, house]);
  const wheels = [-4.6, -3.4, 1.6, 4.4];
  return (
    <group>
      {/* trailer */}
      <mesh position={[0, 2.35, -1.3]} castShadow>
        <boxGeometry args={[2.6, 3.1, 8.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.305, 2.35, -1.3]} rotation={[0, (side * Math.PI) / 2, 0]}>
          <planeGeometry args={[8, 2]} />
          <meshStandardMaterial map={livery} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.85, -1.3]}>
        <boxGeometry args={[2.3, 0.3, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* cab */}
      <mesh position={[0, 1.85, 4.2]} castShadow>
        <boxGeometry args={[2.5, 2.5, 2.2]} />
        <meshStandardMaterial color={c.cab} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.35, 5.31]}>
        <planeGeometry args={[2.2, 1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.85, 5.35]}>
        <boxGeometry args={[2.5, 0.35, 0.12]} />
        <meshStandardMaterial color={house ? "#312e81" : c.stripe} />
      </mesh>
      {wheels.map((z) =>
        [-1, 1].map((side) => (
          <mesh key={`${z}${side}`} position={[side * 1.05, 0.48, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.48, 0.48, 0.4, 12]} />
            <meshStandardMaterial color={C.tyre} />
          </mesh>
        ))
      )}
    </group>
  );
}

const Truck = memo(function Truck({ id }: { id: string }) {
  const ref = useRef<Group>(null);
  const carrier = useCommand((s) => s.trucks[id]?.carrier ?? "house");
  const first = useRef(true);
  useFrame((_, dt) => {
    const g = ref.current;
    const w = useCommand.getState();
    const t = w.trucks[id];
    if (!g || !t) return;
    const p = truckPose(w, t);
    g.visible = p.visible;
    if (!p.visible) return;
    const k = first.current ? 1 : 1 - Math.exp(-dt * 10);
    first.current = false;
    g.position.x += (p.x - g.position.x) * k;
    g.position.z += (p.z - g.position.z) * k;
    g.rotation.y = smoothAngle(g.rotation.y, p.heading, k);
  });
  return (
    <group ref={ref} visible={false} onClick={clickSelect({ kind: "truck", id })} {...hover}>
      <TruckModel carrier={carrier} />
    </group>
  );
});

export function ForkliftModel({ carrying }: { carrying: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.6, -0.1]} castShadow>
        <boxGeometry args={[1.1, 0.8, 1.6]} />
        <meshStandardMaterial color={C.forklift} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.85, -0.85]} castShadow>
        <boxGeometry args={[1.1, 0.7, 0.35]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
      {/* overhead guard */}
      {[
        [-0.48, -0.6],
        [0.48, -0.6],
        [-0.48, 0.45],
        [0.48, 0.45],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 1.55, z]}>
          <boxGeometry args={[0.07, 1.1, 0.07]} />
          <meshStandardMaterial color={C.mast} />
        </mesh>
      ))}
      <mesh position={[0, 2.12, -0.07]}>
        <boxGeometry args={[1.08, 0.06, 1.2]} />
        <meshStandardMaterial color={C.mast} />
      </mesh>
      {/* operator */}
      <mesh position={[0, 1.35, -0.25]}>
        <boxGeometry args={[0.45, 0.55, 0.32]} />
        <meshStandardMaterial color={C.vest} />
      </mesh>
      <mesh position={[0, 1.78, -0.25]}>
        <sphereGeometry args={[0.17, 12, 10]} />
        <meshStandardMaterial color="#f1c7a3" />
      </mesh>
      {/* mast and forks */}
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 1.3, 0.78]}>
          <boxGeometry args={[0.1, 2.4, 0.1]} />
          <meshStandardMaterial color={C.mast} />
        </mesh>
      ))}
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.18, 1.35]}>
          <boxGeometry args={[0.12, 0.05, 1.1]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
      ))}
      {[-0.45, 0.45].map((z) => (
        <mesh key={z} position={[0, 0.25, z - 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 1.15, 10]} />
          <meshStandardMaterial color={C.tyre} />
        </mesh>
      ))}
      {carrying && (
        <group position={[0, 0.28, 1.4]}>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[1.1, 0.12, 1.1]} />
            <meshStandardMaterial color={C.wood} />
          </mesh>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1, 0.8, 1]} />
            <meshStandardMaterial color={C.box} />
          </mesh>
        </group>
      )}
    </group>
  );
}

const Forklift = memo(function Forklift({ id }: { id: string }) {
  const ref = useRef<Group>(null);
  const carrying = useCommand((s) => s.forklifts[id]?.carrying ?? false);
  const first = useRef(true);
  useFrame((_, dt) => {
    const g = ref.current;
    const f = useCommand.getState().forklifts[id];
    if (!g || !f) return;
    const p = forkliftPose(f);
    const k = first.current ? 1 : 1 - Math.exp(-dt * 14);
    first.current = false;
    g.position.x += (p.x - g.position.x) * k;
    g.position.z += (p.z - g.position.z) * k;
    if (f.t < 1 || first.current) g.rotation.y = smoothAngle(g.rotation.y, p.heading, Math.min(1, k * 1.2));
  });
  return (
    <group ref={ref} onClick={clickSelect({ kind: "forklift", id })} {...hover}>
      <ForkliftModel carrying={carrying} />
    </group>
  );
});

/** Vehicles for the sites near the camera. */
export function Vehicles({ sites }: { sites: SiteId[] }) {
  const key = sites.join(",");
  const trucks = useCommand(
    useShallow((s) => Object.values(s.trucks).filter((t) => key.includes(t.site) && t.phase !== "enroute" && t.phase !== "gone").map((t) => t.id))
  );
  const forklifts = useCommand(useShallow((s) => Object.values(s.forklifts).filter((f) => key.includes(f.site)).map((f) => f.id)));
  return (
    <>
      {trucks.map((id) => (
        <Truck key={id} id={id} />
      ))}
      {forklifts.map((id) => (
        <Forklift key={id} id={id} />
      ))}
    </>
  );
}
