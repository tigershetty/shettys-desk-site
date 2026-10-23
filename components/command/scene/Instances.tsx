"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, CylinderGeometry, Euler, InstancedMesh, Matrix4, Quaternion, SphereGeometry, Vector3 } from "three";

/** [x, y, z, sx, sy, sz, rotY?] — a box or cylinder placed by its centre. */
export type Inst = [number, number, number, number, number, number, number?];

const geometries = {
  box: new BoxGeometry(1, 1, 1),
  cyl: new CylinderGeometry(0.5, 0.5, 1, 12),
  cone: new CylinderGeometry(0, 0.5, 1, 12),
  sphere: new SphereGeometry(0.5, 12, 10),
};

/** One draw call for many identical props. */
export function Instances({
  items,
  color,
  shape = "box",
  castShadow = true,
  receiveShadow = false,
  emissive,
  roughness = 0.85,
  opacity,
}: {
  items: Inst[];
  color: string;
  shape?: keyof typeof geometries;
  castShadow?: boolean;
  receiveShadow?: boolean;
  emissive?: string;
  roughness?: number;
  opacity?: number;
}) {
  const ref = useRef<InstancedMesh>(null);
  const tmp = useMemo(() => ({ m: new Matrix4(), q: new Quaternion(), e: new Euler(), p: new Vector3(), s: new Vector3() }), []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    items.forEach(([x, y, z, sx, sy, sz, r = 0], i) => {
      tmp.q.setFromEuler(tmp.e.set(0, r, 0));
      tmp.m.compose(tmp.p.set(x, y, z), tmp.q, tmp.s.set(sx, sy, sz));
      mesh.setMatrixAt(i, tmp.m);
    });
    mesh.count = items.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items, tmp]);
  if (!items.length) return null;
  return (
    <instancedMesh ref={ref} args={[geometries[shape], undefined, items.length]} castShadow={castShadow} receiveShadow={receiveShadow}>
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissive ? 0.9 : 0}
        transparent={opacity !== undefined}
        opacity={opacity ?? 1}
      />
    </instancedMesh>
  );
}
