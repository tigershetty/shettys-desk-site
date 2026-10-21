"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { carriers, siteById } from "@/lib/command/data";
import { dockInsidePoint, dockPaths, dockWorkPoint, layouts } from "@/lib/command/layout";
import type { Carrier, SiteId } from "@/lib/command/types";
import { C, liveryTexture } from "./look";

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

/** Ambient life for a drilled-in yard: docked trucks and forklifts shuttling pallets. No game state. */
export function AmbientYard({ site }: { site: SiteId }) {
  const def = siteById[site];
  const l = layouts[site];
  const o = def.origin;
  const lifts = useRef<(Group | null)[]>([]);
  const carriersList = ["house", "nordline", "cargovia", "bluepeak"] as const;
  const docked = l.dockX.slice(0, def.docks).map((_, i) => i).filter((i) => i % 2 === 0);
  useFrame(({ clock }) => {
    docked.forEach((d, i) => {
      const g = lifts.current[i];
      if (!g) return;
      const a = dockWorkPoint(site, d);
      const b = dockInsidePoint(site, d, i);
      const t = (clock.elapsedTime * 0.25 + i * 0.37) % 2;
      const u = t < 1 ? t : 2 - t;
      const e = u * u * (3 - 2 * u);
      g.position.set(o[0] + a[0] + (b[0] - a[0]) * e, 0, o[1] + a[1] + (b[1] - a[1]) * e);
      g.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]) + (t < 1 ? 0 : Math.PI);
    });
  });
  return (
    <>
      {docked.map((d) => {
        const p = dockPaths[site][d].docked;
        return (
          <group key={`t${d}`} position={[o[0] + p[0], 0, o[1] + p[1]]}>
            <TruckModel carrier={carriersList[(d + site.charCodeAt(0)) % 4]} />
          </group>
        );
      })}
      {docked.map((d, i) => (
        <group
          key={`f${d}`}
          ref={(g) => {
            lifts.current[i] = g;
          }}
        >
          <ForkliftModel carrying={i % 2 === 0} />
        </group>
      ))}
      {l.forkliftHome.slice(0, Math.max(0, def.forklifts - docked.length)).map(([x, z], i) => (
        <group key={`p${i}`} position={[o[0] + x, 0, o[1] + z]} rotation={[0, Math.PI, 0]}>
          <ForkliftModel carrying={false} />
        </group>
      ))}
    </>
  );
}
