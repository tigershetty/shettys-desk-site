"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import { QuadraticBezierCurve3, Vector3, type Group } from "three";
import { useShallow } from "zustand/react/shallow";
import { siteById, sites } from "@/lib/command/data";
import { useCommand } from "@/lib/command/store";
import type { SiteId } from "@/lib/command/types";
import { C } from "./look";
import { hover } from "./Yard";

// The zoomed-out network: a stylised North Europe board far from the yards,
// with each site as a small building, lanes between them, and trucks and a
// ship moving along the lanes.

export const NET = { x: 340, z: -420, scale: 6 };

export function mapPoint(p: [number, number]): Vector3 {
  return new Vector3(NET.x + p[0] * NET.scale, 0.4, NET.z + p[1] * NET.scale);
}

const ASIA: [number, number] = [-30, 6];

type Lane = { from: SiteId | "ASIA"; to: SiteId; sea?: boolean };
export const lanes: Lane[] = [
  { from: "ASIA", to: "NL-01", sea: true },
  { from: "SE-01", to: "DE-01" },
  { from: "SE-01", to: "IT-01" },
  { from: "DE-01", to: "PL-01" },
  { from: "NL-01", to: "DE-01" },
];

function laneCurve(l: Lane) {
  const a = l.from === "ASIA" ? mapPoint(ASIA) : mapPoint(siteById[l.from].mapPos);
  const b = mapPoint(siteById[l.to].mapPos);
  const mid = a.clone().lerp(b, 0.5);
  const side = new Vector3(-(b.z - a.z), 0, b.x - a.x).normalize().multiplyScalar(a.distanceTo(b) * 0.18);
  mid.add(side);
  return new QuadraticBezierCurve3(a, mid, b);
}

function MapSite({ id }: { id: SiteId }) {
  const def = siteById[id];
  const p = mapPoint(def.mapPos);
  const active = useCommand((s) => s.activeSite === id);
  const whiteRoof = def.type === "cold" || def.type === "robotics";
  return (
    <group
      position={[p.x, 0, p.z]}
      scale={1.4}
      onClick={(e) => {
        e.stopPropagation();
        useCommand.getState().setSite(id);
      }}
      {...hover}
    >
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[6.5, 6.5, 0.3, 40]} />
        <meshStandardMaterial color={active ? "#e0e7ff" : "#ffffff"} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[6, 3, 4]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>
      <mesh position={[0, 3.45, 0]} castShadow>
        <boxGeometry args={[6.4, 0.3, 4.4]} />
        <meshStandardMaterial color={whiteRoof ? C.white : C.roof} />
      </mesh>
      {def.type === "plant" && (
        <mesh position={[2, 4.6, -1]} castShadow>
          <cylinderGeometry args={[0.35, 0.45, 3, 10]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      )}
      {def.type === "cold" && (
        <mesh position={[-1.5, 3.9, 0]}>
          <boxGeometry args={[1.2, 0.6, 1.2]} />
          <meshStandardMaterial color="#dfe3ec" />
        </mesh>
      )}
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.6, 7.1, 48]} />
        <meshBasicMaterial color={active ? C.roof : "#c7d2fe"} />
      </mesh>
    </group>
  );
}

function LaneLine({ lane }: { lane: Lane }) {
  const pts = useMemo(() => laneCurve(lane).getPoints(40), [lane]);
  return <Line points={pts} color={lane.sea ? "#60a5fa" : C.roof} lineWidth={2} dashed dashSize={2.2} gapSize={1.6} />;
}

/** Tokens for trucks heading to each site, placed by how far along their ETA they are. */
function Movers() {
  const curves = useMemo(() => lanes.map(laneCurve), []);
  const ids = useCommand(useShallow((s) => Object.values(s.trucks).filter((t) => t.phase === "enroute" && t.direction === "inbound").map((t) => t.id)));
  const refs = useRef<(Group | null)[]>([]);
  const ship = useRef<Group>(null);
  useFrame(({ clock }) => {
    const w = useCommand.getState();
    ids.forEach((id, i) => {
      const g = refs.current[i];
      const t = w.trucks[id];
      if (!g || !t) return;
      const li = lanes.findIndex((l) => l.to === t.site && !l.sea);
      const curve = curves[li >= 0 ? li : 0];
      const u = Math.min(0.98, Math.max(0.02, 1 - t.eta / Math.max(1, t.etaTotal)));
      const p = curve.getPointAt(u);
      const d = curve.getTangentAt(u);
      g.position.set(p.x, 0.5, p.z);
      g.rotation.y = Math.atan2(d.x, d.z);
    });
    if (ship.current) {
      const u = (clock.elapsedTime * 0.02) % 1;
      const p = curves[0].getPointAt(u);
      const d = curves[0].getTangentAt(u);
      ship.current.position.set(p.x, 0.2, p.z);
      ship.current.rotation.y = Math.atan2(d.x, d.z);
    }
  });
  return (
    <>
      {ids.map((id, i) => (
        <group
          key={id}
          ref={(g) => {
            refs.current[i] = g;
          }}
          onClick={(e) => {
            e.stopPropagation();
            useCommand.getState().select({ kind: "truck", id }, false);
          }}
          {...hover}
        >
          <mesh position={[0, 0.7, -0.4]} castShadow>
            <boxGeometry args={[1.3, 1.3, 3.2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.6, 1.6]} castShadow>
            <boxGeometry args={[1.3, 1.1, 1]} />
            <meshStandardMaterial color={C.roof} />
          </mesh>
        </group>
      ))}
      <group ref={ship}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2.6, 1, 9]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
        {[-2.5, 0, 2.5].map((z, i) => (
          <mesh key={z} position={[0, 1.4, z]} castShadow>
            <boxGeometry args={[2.2, 0.9, 2]} />
            <meshStandardMaterial color={[C.teal, C.amber, "#f97316"][i]} />
          </mesh>
        ))}
        <mesh position={[0, 2.1, -3.6]}>
          <boxGeometry args={[1.8, 1.6, 1.2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </>
  );
}

export const NetworkBoard = memo(function NetworkBoard() {
  return (
    <group>
      {/* land board, with the North Sea, the Baltic and the Atlantic cut in as water */}
      <mesh position={[NET.x, -0.05, NET.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[300, 230]} />
        <meshBasicMaterial color={C.land} />
      </mesh>
      {[
        // [x, z, rx, rz, rotation] water, in map units
        [-17, -11, 8, 9, 0],
        [-26, 2, 8, 14, 0],
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
        <LaneLine key={i} lane={l} />
      ))}
      {sites.map((s) => (
        <MapSite key={s.id} id={s.id} />
      ))}
      <Movers />
    </group>
  );
});

export const mapLabelPoints = [
  ...sites.map((s) => ({ id: s.id as string, p: mapPoint(s.mapPos).setY(6) })),
  { id: "ASIA", p: mapPoint(ASIA).setY(3) },
];
