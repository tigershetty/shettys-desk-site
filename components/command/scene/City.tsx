"use client";

import { memo, useMemo } from "react";
import { sites } from "@/lib/command/data";
import { layouts, ROAD_Z } from "@/lib/command/layout";
import { Instances, type Inst } from "./Instances";
import { C } from "./look";

const MIN_X = -150;
const MAX_X = sites[sites.length - 1].origin[0] + 150;

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/** Ground, the shared road, and the low city blocks and trees around each yard. */
export const City = memo(function City({ lite }: { lite: boolean }) {
  const d = useMemo(() => {
    const dashes: Inst[] = [];
    for (let x = MIN_X; x < MAX_X; x += 6) dashes.push([x, 0.04, ROAD_Z, 2.6, 0.02, 0.18]);
    const kerbs: Inst[] = [
      [(MIN_X + MAX_X) / 2, 0.08, ROAD_Z - 5.2, MAX_X - MIN_X, 0.16, 0.5],
      [(MIN_X + MAX_X) / 2, 0.08, ROAD_Z + 5.2, MAX_X - MIN_X, 0.16, 0.5],
    ];
    const blocks: Inst[] = [];
    const roofs: Inst[] = [];
    const windows: Inst[] = [];
    const trunks: Inst[] = [];
    const crowns: Inst[] = [];
    const tree = (x: number, z: number, s = 1) => {
      trunks.push([x, 0.6 * s, z, 0.3 * s, 1.2 * s, 0.3 * s]);
      crowns.push([x, 2.1 * s, z, 2.2 * s, 2.4 * s, 2.2 * s]);
    };
    let n = 1;
    // Trees along both sides of the road
    for (let x = MIN_X + 4; x < MAX_X; x += 9) {
      const near = sites.some((s) => Math.abs(x - (s.origin[0] + layouts[s.id].gateX)) < 10);
      if (!near) tree(x, ROAD_Z - 7.5, 0.9 + hash(n++) * 0.25);
      tree(x + 4, ROAD_Z + 8, 0.9 + hash(n++) * 0.3);
    }
    // City blocks across the road and behind each yard
    const step = lite ? 22 : 15;
    for (let x = MIN_X + 10; x < MAX_X - 10; x += step) {
      for (const [z0, rows] of [
        [ROAD_Z + 18, lite ? 1 : 2],
        [-46, lite ? 1 : 2],
      ] as const) {
        for (let r = 0; r < rows; r++) {
          const h = 4 + hash(n++) * 10;
          const w = 8 + hash(n++) * 4;
          const dd = 7 + hash(n++) * 4;
          const z = z0 + (z0 > 0 ? r * 14 : -r * 14);
          const bx = x + hash(n++) * 3;
          blocks.push([bx, h / 2, z, w, h, dd]);
          roofs.push([bx, h + 0.15, z, w + 0.3, 0.3, dd + 0.3]);
          if (!lite) for (let k = 1; k < h / 3; k++) windows.push([bx, k * 3, z + (z0 > 0 ? -dd / 2 - 0.02 : dd / 2 + 0.02), w * 0.8, 0.9, 0.04]);
          if (hash(n++) > 0.5) tree(bx + w / 2 + 2, z + 2, 1.1);
        }
      }
    }
    // Gaps between yards get a few trees
    for (let i = 0; i < sites.length - 1; i++) {
      const a = sites[i].origin[0] + layouts[sites[i].id].fence.maxX;
      const b = sites[i + 1].origin[0] + layouts[sites[i + 1].id].fence.minX;
      for (let x = a + 5; x < b - 4; x += 7) for (let z = -20; z < 24; z += 9) tree(x + hash(n++) * 2, z, 1 + hash(n++) * 0.3);
    }
    return { dashes, kerbs, blocks, roofs, windows, trunks, crowns };
  }, [lite]);

  return (
    <group>
      <mesh position={[(MIN_X + MAX_X) / 2, 0, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[MAX_X - MIN_X + 400, 400]} />
        <meshStandardMaterial color={C.ground} />
      </mesh>
      <mesh position={[(MIN_X + MAX_X) / 2, 0.02, ROAD_Z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[MAX_X - MIN_X, 10]} />
        <meshStandardMaterial color={C.road} />
      </mesh>
      <Instances items={d.dashes} color={C.dash} castShadow={false} />
      <Instances items={d.kerbs} color={C.kerb} castShadow={false} />
      <Instances items={d.blocks} color={C.block} castShadow={!lite} receiveShadow />
      <Instances items={d.roofs} color={C.blockRoof} castShadow={false} />
      <Instances items={d.windows} color={C.glass} castShadow={false} />
      <Instances items={d.trunks} color={C.trunk} castShadow={false} />
      <Instances items={d.crowns} color={C.leaf} shape="sphere" castShadow={!lite} />
    </group>
  );
});
