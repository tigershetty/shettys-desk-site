"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { siteById } from "@/lib/command/data";
import { layouts, ROAD_Z } from "@/lib/command/layout";
import { useCommand } from "@/lib/command/store";
import type { Selection, SiteId } from "@/lib/command/types";
import { Instances, type Inst } from "./Instances";
import { C, corrugatedTexture, signTexture } from "./look";

const H = 7;

export function clickSelect(sel: Selection) {
  return (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 6) return;
    useCommand.getState().select(sel);
  };
}

export const hover = {
  onPointerOver: (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  },
  onPointerOut: () => {
    document.body.style.cursor = "";
  },
};

function useStatic(site: SiteId, lite: boolean) {
  return useMemo(() => {
    const def = siteById[site];
    const l = layouts[site];
    const f = l.frontZ;
    const dashes: Inst[] = [];
    const posts: Inst[] = [];
    const panels: Inst[] = [];
    const boxes: Inst[] = [];
    const pallets: Inst[] = [];
    const crates: Inst[] = [];
    const roofUnits: Inst[] = [];

    // Yellow dashed bay lines either side of every dock, and at staging.
    for (const x of l.dockX) {
      for (const side of [-1, 1]) {
        for (let k = 0; k < 6; k++) dashes.push([x + side * 2.3, 0.03, f + 1.2 + k * 2.1, 0.16, 0.02, 1.2]);
      }
    }
    const sx0 = -l.width / 2 - 17.2;
    for (let c = 0; c <= 4; c++) for (let k = 0; k < 4; k++) dashes.push([sx0 + c * 2.4, 0.03, f - 3.5 + k * 2.1, 0.12, 0.02, 1.1]);
    for (let r = 0; r <= 3; r++) for (let k = 0; k < 4; k++) dashes.push([sx0 + 1.2 + k * 2.4, 0.03, f + 0.2 - r * 2.4, 1.1, 0.02, 0.12]);
    // Forklift parking
    for (const [hx, hz] of l.forkliftHome) dashes.push([hx, 0.03, hz + 1.5, 1.8, 0.02, 0.12]);

    // Fence with a gate gap on the road side.
    const { minX, maxX, minZ, maxZ } = l.fence;
    const run = (x1: number, z1: number, x2: number, z2: number) => {
      const len = Math.hypot(x2 - x1, z2 - z1);
      const n = Math.max(1, Math.round(len / 3));
      for (let i = 0; i <= n; i++) posts.push([x1 + ((x2 - x1) * i) / n, 0.9, z1 + ((z2 - z1) * i) / n, 0.12, 1.8, 0.12]);
      panels.push([(x1 + x2) / 2, 0.9, (z1 + z2) / 2, Math.abs(x2 - x1) || 0.04, 1.6, Math.abs(z2 - z1) || 0.04]);
    };
    run(minX, minZ, maxX, minZ);
    run(minX, minZ, minX, maxZ);
    run(maxX, minZ, maxX, maxZ);
    run(minX, maxZ, l.gateX - 7, maxZ);
    run(l.gateX + 7, maxZ, maxX, maxZ);

    // Decorative stock in staging bays (the inspectable pallets are drawn separately).
    l.staging.forEach(([x, z], i) => {
      if (i % 2 === 1 && i < 7) return;
      if ((i * 7) % 5 === 0) return;
      pallets.push([x, 0.08, z, 1.2, 0.16, 1.2]);
      if (i % 3 === 0) crates.push([x, 0.6, z, 1.1, 0.9, 1.1]);
      else boxes.push([x, 0.55, z, 1.1, 0.8, 1.1]);
    });

    // Outdoor racks
    const uprights: Inst[] = [];
    const beams: Inst[] = [];
    for (const [rx, rz] of l.racks) {
      for (const dx of [-3, 0, 3]) for (const dz of [-0.6, 0.6]) uprights.push([rx + dx, 2, rz + dz, 0.15, 4, 0.15]);
      for (const y of [0.2, 1.6, 3.0]) {
        beams.push([rx, y, rz - 0.6, 6.1, 0.12, 0.12]);
        beams.push([rx, y, rz + 0.6, 6.1, 0.12, 0.12]);
        if (y < 3) for (const dx of [-1.6, 1.6]) boxes.push([rx + dx, y + 0.55, rz, 1.2, 0.9, 1.1]);
      }
    }

    if (def.type === "cold") {
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) roofUnits.push([-l.width / 2 + 6 + i * ((l.width - 12) / 3), H + 1.5, l.centerZ - 6 + j * 5, 2.4, 1, 2.4]);
    }
    if (def.type === "dc" || def.type === "robotics") {
      for (let i = 0; i < 3; i++) roofUnits.push([-l.width / 2 + 7 + i * 5, H + 0.75, l.centerZ - l.depth / 4, 2, 0.7, 2]);
    }

    return { def, l, dashes, posts, panels, boxes, pallets, crates, roofUnits, uprights, beams, lite };
  }, [site, lite]);
}

function Building({ site }: { site: SiteId }) {
  const def = siteById[site];
  const l = layouts[site];
  const tex = useMemo(() => {
    const t = corrugatedTexture()?.clone();
    if (t) {
      t.repeat.set(l.width / 1.2, 1);
      t.needsUpdate = true;
    }
    return t;
  }, [l.width]);
  const whiteRoof = def.type === "cold" || def.type === "robotics";
  const h = def.type === "cold" ? H + 1 : H;
  const sign = useMemo(() => signTexture(def.name, `${def.id} · ${def.typeLabel}`), [def]);
  const wallClick = clickSelect({ kind: "site", id: site });

  return (
    <group>
      <mesh position={[0, h / 2, l.centerZ]} castShadow receiveShadow onClick={wallClick} {...hover}>
        <boxGeometry args={[l.width, h, l.depth]} />
        <meshStandardMaterial color={C.wall} map={tex ?? undefined} roughness={0.8} />
      </mesh>
      {/* Roof slab and trim */}
      <mesh position={[0, h + 0.2, l.centerZ]} castShadow onClick={wallClick}>
        <boxGeometry args={[l.width + 0.8, 0.4, l.depth + 0.8]} />
        <meshStandardMaterial color={whiteRoof ? C.white : C.roof} roughness={0.7} />
      </mesh>
      <mesh position={[0, h - 0.2, l.frontZ + 0.42]}>
        <boxGeometry args={[l.width + 0.8, 0.4, 0.06]} />
        <meshStandardMaterial
          color={C.trim}
          emissive={def.type === "robotics" ? "#6366f1" : "#000000"}
          emissiveIntensity={def.type === "robotics" ? 1.4 : 0}
        />
      </mesh>
      {def.type === "robotics" && (
        <mesh position={[0, h + 0.45, l.centerZ]}>
          <boxGeometry args={[l.width + 0.9, 0.08, l.depth + 0.9]} />
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1.2} />
        </mesh>
      )}
      {/* Facade sign */}
      <mesh position={[l.width / 2 - 8, h - 1.5, l.frontZ + 0.03]}>
        <planeGeometry args={[9, 2.25]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {def.type === "plant" && (
        <>
          <mesh position={[-l.width / 4, h + 3, l.centerZ - 4]} castShadow>
            <boxGeometry args={[l.width / 2, 6, l.depth / 2]} />
            <meshStandardMaterial color={C.wall} map={tex ?? undefined} />
          </mesh>
          <mesh position={[-l.width / 4, h + 6.2, l.centerZ - 4]} castShadow>
            <boxGeometry args={[l.width / 2 + 0.6, 0.4, l.depth / 2 + 0.6]} />
            <meshStandardMaterial color={C.roof} />
          </mesh>
          {[0, 3].map((dx) => (
            <mesh key={dx} position={[l.width / 4 + dx, h + 4, l.centerZ - 6]} castShadow>
              <cylinderGeometry args={[0.6, 0.75, 8, 14]} />
              <meshStandardMaterial color="#cbd5e1" />
            </mesh>
          ))}
        </>
      )}
      {def.type === "crossdock" &&
        l.dockX.map((x) => (
          <mesh key={x} position={[x, 2.1, l.centerZ - l.depth / 2 - 0.03]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[3.4, 3.9]} />
            <meshStandardMaterial color="#cbd0dc" />
          </mesh>
        ))}
    </group>
  );
}

function Dock({ site, index }: { site: SiteId; index: number }) {
  const l = layouts[site];
  const x = l.dockX[index];
  const f = l.frontZ;
  const id = `${site}-D${index + 1}`;
  const status: string = useCommand((s) => s.docks[id]?.status ?? "locked");
  const open = status === "available" || status === "busy";
  const light = status === "available" ? C.green : status === "busy" ? C.amber : status === "out" ? C.red : "#9ca3af";
  const select = clickSelect({ kind: "dock", id });
  return (
    <group position={[x, 0, f]}>
      {/* frame */}
      {[-1.9, 1.9].map((dx) => (
        <mesh key={dx} position={[dx, 2.2, 0.1]}>
          <boxGeometry args={[0.3, 4.4, 0.3]} />
          <meshStandardMaterial color={C.roof} />
        </mesh>
      ))}
      <mesh position={[0, 4.35, 0.1]}>
        <boxGeometry args={[4.1, 0.3, 0.3]} />
        <meshStandardMaterial color={C.roof} />
      </mesh>
      {/* opening or closed shutter */}
      <mesh position={[0, 2.1, 0.02]} onClick={status === "locked" ? undefined : select} {...(status === "locked" ? {} : hover)}>
        <planeGeometry args={[3.5, 4.1]} />
        <meshStandardMaterial color={open ? C.doorDark : "#c3c8d4"} roughness={0.9} />
      </mesh>
      {open && (
        <>
          <mesh position={[-0.8, 0.5, -0.6]}>
            <boxGeometry args={[1, 0.9, 1]} />
            <meshStandardMaterial color={C.box} />
          </mesh>
          <mesh position={[0.6, 0.45, -1.2]}>
            <boxGeometry args={[1, 0.8, 1]} />
            <meshStandardMaterial color={C.boxDark} />
          </mesh>
        </>
      )}
      {/* dock leveller and bumpers */}
      <mesh position={[0, 0.6, 0.45]} receiveShadow>
        <boxGeometry args={[3.4, 1.2, 0.9]} />
        <meshStandardMaterial color="#9aa3b5" />
      </mesh>
      <mesh position={[0, 4.75, 0.25]}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color={light} emissive={light} emissiveIntensity={1.2} />
      </mesh>
      {status === "locked" && (
        <mesh position={[0, 2.4, 0.04]}>
          <planeGeometry args={[2.2, 0.5]} />
          <meshBasicMaterial color="#6b7280" />
        </mesh>
      )}
    </group>
  );
}

function StagedPallets({ site }: { site: SiteId }) {
  const ids = useCommand(useShallow((s) => Object.values(s.pallets).filter((p) => p.site === site).map((p) => p.id)));
  const pallets = useCommand.getState().pallets;
  return (
    <>
      {ids.map((id) => {
        const p = pallets[id];
        if (!p) return null;
        return (
          <group key={id} position={[p.slot[0], 0, p.slot[1]]} onClick={clickSelect({ kind: "pallet", id })} {...hover}>
            <mesh position={[0, 0.08, 0]} castShadow>
              <boxGeometry args={[1.2, 0.16, 1.2]} />
              <meshStandardMaterial color={C.wood} />
            </mesh>
            <mesh position={[0, 0.62, 0]} castShadow>
              <boxGeometry args={[1.1, 0.9, 1.1]} />
              <meshStandardMaterial color={C.box} />
            </mesh>
            <Pin y={2.1} />
          </group>
        );
      })}
    </>
  );
}

export function Pin({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.38, 16, 12]} />
        <meshStandardMaterial color={C.pin} emissive={C.pin} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, -0.15, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.26, 0.6, 12]} />
        <meshStandardMaterial color={C.pin} />
      </mesh>
      <mesh position={[0, 0.38, 0.3]}>
        <sphereGeometry args={[0.13, 10, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Chargers({ site }: { site: SiteId }) {
  const def = siteById[site];
  const l = layouts[site];
  const busy = useCommand(useShallow((s) => Array.from({ length: def.chargers }, (_, i) => !!s.chargers[`${site}-C${i + 1}`]?.forklift)));
  return (
    <>
      {busy.map((inUse, i) => {
        const [x, z] = l.chargers[i];
        return (
          <group key={i} position={[x, 0, z]} onClick={clickSelect({ kind: "charger", id: `${site}-C${i + 1}` })} {...hover}>
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[0.7, 1.8, 0.5]} />
              <meshStandardMaterial color={C.white} />
            </mesh>
            <mesh position={[0.36, 1.2, 0]}>
              <boxGeometry args={[0.02, 0.5, 0.36]} />
              <meshStandardMaterial color={inUse ? C.amber : C.teal} emissive={inUse ? C.amber : C.teal} emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[-1.6, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.6, 1.8]} />
              <meshStandardMaterial color={inUse ? "#fde68a" : "#ccfbf1"} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

export const Yard = memo(function Yard({ site, lite }: { site: SiteId; lite: boolean }) {
  const s = useStatic(site, lite);
  const { def, l } = s;
  const slots = def.docks + def.spareDocks;
  const { minX, maxX, minZ, maxZ } = l.fence;
  return (
    <group position={[def.origin[0], 0, def.origin[1]]}>
      {/* yard slab and driveway */}
      <mesh position={[(minX + maxX) / 2, 0.01, (minZ + maxZ) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[maxX - minX, maxZ - minZ]} />
        <meshStandardMaterial color={C.yard} />
      </mesh>
      <mesh position={[l.gateX, 0.015, (maxZ + ROAD_Z) / 2 - 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13, ROAD_Z - maxZ]} />
        <meshStandardMaterial color={C.road} />
      </mesh>
      <Building site={site} />
      {Array.from({ length: slots }, (_, i) => (
        <Dock key={i} site={site} index={i} />
      ))}
      <Instances items={s.dashes} color={C.bay} castShadow={false} emissive="#b45309" />
      <Instances items={s.posts} color={C.steel} castShadow={!lite} />
      <Instances items={s.panels} color="#9fb0c8" castShadow={false} opacity={0.28} />
      <Instances items={s.pallets} color={C.wood} />
      <Instances items={s.boxes} color={C.box} />
      <Instances items={s.crates} color={C.crate} />
      <Instances items={s.uprights} color={C.rack} />
      <Instances items={s.beams} color={C.steel} />
      <Instances items={s.roofUnits} color="#dfe3ec" />
      {(def.type === "plant" || def.type === "dc") && (
        <mesh position={[maxX - 6, 1.3, minZ + 5]} castShadow>
          <boxGeometry args={[6, 2.6, 2.4]} />
          <meshStandardMaterial color={C.teal} />
        </mesh>
      )}
      {def.type === "cold" &&
        [0, 3.2].map((dz) => (
          <mesh key={dz} position={[maxX - 5, 3, minZ + 4 + dz]} castShadow>
            <cylinderGeometry args={[1.3, 1.3, 6, 16]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        ))}
      <StagedPallets site={site} />
      <Chargers site={site} />
    </group>
  );
});
