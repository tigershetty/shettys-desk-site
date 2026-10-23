"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, SRGBColorSpace, type Group } from "three";
import { books, type Book } from "@/data/books";

// A wooden bookcase with every book on it. Spines are drawn to canvas
// textures in each book's colours. Hover pulls a book out a little; the
// picked book slides out, lifts and turns its cover toward you.

const PER_SHELF = 9;
const SHELF_W = 7.4;
const SHELF_GAP = 3.1;

function spineTexture(b: Book) {
  const c = document.createElement("canvas");
  c.width = 96;
  c.height = 640;
  const g = c.getContext("2d")!;
  g.fillStyle = b.color;
  g.fillRect(0, 0, 96, 640);
  g.fillStyle = b.ink;
  g.globalAlpha = 0.85;
  g.fillRect(0, 40, 96, 4);
  g.fillRect(0, 596, 96, 4);
  g.globalAlpha = 1;
  g.save();
  g.translate(48, 320);
  g.rotate(Math.PI / 2);
  g.textAlign = "center";
  g.textBaseline = "middle";
  let size = 40;
  g.font = `700 ${size}px system-ui, sans-serif`;
  while (g.measureText(b.title).width > 440 && size > 18) {
    size -= 2;
    g.font = `700 ${size}px system-ui, sans-serif`;
  }
  g.fillText(b.title, -30, -6);
  g.font = `500 22px system-ui, sans-serif`;
  g.globalAlpha = 0.8;
  g.fillText(b.author.split(" & ")[0].split(" ").slice(-1)[0].toUpperCase(), 230, -4);
  g.restore();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function layout() {
  let seed = 7;
  const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const out: { book: Book; x: number; y: number; w: number; h: number }[] = [];
  const rows = Math.ceil(books.length / PER_SHELF);
  for (let row = 0; row < rows; row++) {
    const items = books.slice(row * PER_SHELF, row * PER_SHELF + PER_SHELF);
    const widths = items.map(() => 0.42 + r() * 0.26);
    const total = widths.reduce((a, b) => a + b, 0) + (items.length - 1) * 0.05;
    let x = -total / 2 - 0.6;
    items.forEach((book, i) => {
      const w = widths[i];
      const h = 2.15 + r() * 0.55;
      out.push({ book, x: x + w / 2, y: (rows - 1 - row) * SHELF_GAP - SHELF_GAP / 2 + 0.12 + h / 2, w, h });
      x += w + 0.05;
    });
  }
  return out;
}

function BookMesh({
  item,
  picked,
  onPick,
}: {
  item: ReturnType<typeof layout>[number];
  picked: boolean;
  onPick: (id: string) => void;
}) {
  const ref = useRef<Group>(null);
  const hover = useRef(false);
  const tex = useMemo(() => spineTexture(item.book), [item.book]);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const k = 1 - Math.exp(-dt * 8);
    const tz = picked ? 1.6 : hover.current ? 0.35 : 0;
    const ty = picked ? 0.5 : 0;
    const ry = picked ? 0.35 : 0;
    g.position.z += (tz - g.position.z) * k;
    g.position.y += (item.y + ty - g.position.y) * k;
    g.rotation.y += (ry - g.rotation.y) * k;
  });
  return (
    <group
      ref={ref}
      position={[item.x, item.y, 0]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onPick(item.book.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        hover.current = true;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hover.current = false;
        document.body.style.cursor = "";
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[item.w, item.h, 1.55]} />
        {/* +x, -x, +y, -y, +z (spine, facing you), -z */}
        <meshStandardMaterial attach="material-0" color={item.book.color} />
        <meshStandardMaterial attach="material-1" color={item.book.color} />
        <meshStandardMaterial attach="material-2" color="#f5f0e6" />
        <meshStandardMaterial attach="material-3" color="#f5f0e6" />
        <meshStandardMaterial attach="material-4" map={tex} roughness={0.7} />
        <meshStandardMaterial attach="material-5" color={item.book.color} />
      </mesh>
    </group>
  );
}

/** Pull the camera back on narrow screens so the whole case fits. */
function Fit() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    camera.position.set(0, 1.6, 14.5 * Math.max(1, 1.38 / aspect));
    camera.lookAt(0, 0.6, 0);
  }, [camera, size.width, size.height]);
  return null;
}

/** Slides the whole case aside while a book is open, so the preview never hides it. */
function Slide({ open, children }: { open: boolean; children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  const { size } = useThree();
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const goal = open && size.width >= 1024 ? -3.4 : 0;
    g.position.x += (goal - g.position.x) * (1 - Math.exp(-dt * 6));
  });
  return <group ref={ref}>{children}</group>;
}

function Case() {
  const rows = Math.ceil(books.length / PER_SHELF);
  const height = rows * SHELF_GAP;
  const wood = "#b98a5a";
  const dark = "#8b6440";
  return (
    <group>
      {/* back panel */}
      <mesh position={[0, height / 2 - SHELF_GAP / 2, -0.9]} receiveShadow>
        <boxGeometry args={[SHELF_W + 0.6, height + 0.3, 0.1]} />
        <meshStandardMaterial color="#e9dcc8" />
      </mesh>
      {/* sides */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (SHELF_W / 2 + 0.25), height / 2 - SHELF_GAP / 2, 0]} castShadow>
          <boxGeometry args={[0.3, height + 0.3, 1.9]} />
          <meshStandardMaterial color={dark} />
        </mesh>
      ))}
      {/* shelves */}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <mesh key={i} position={[0, i * SHELF_GAP - SHELF_GAP / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[SHELF_W + 0.5, 0.22, 1.9]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      ))}
      {/* a plant and a bookend for company */}
      <group position={[SHELF_W / 2 - 0.75, SHELF_GAP * (rows - 1) - SHELF_GAP / 2 + 0.11, 0]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.38, 0.3, 0.7, 14]} />
          <meshStandardMaterial color="#4f46e5" />
        </mesh>
        {[0, 1.2, 2.4, 3.6, 4.8].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.25, 1 + (i % 2) * 0.2, Math.sin(a) * 0.25]} rotation={[Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5]}>
            <coneGeometry args={[0.16, 0.9, 6]} />
            <meshStandardMaterial color="#22c55e" flatShading />
          </mesh>
        ))}
      </group>
      <mesh position={[SHELF_W / 2 - 0.8, -SHELF_GAP / 2 + 0.6, 0]} castShadow>
        <boxGeometry args={[0.18, 1, 1]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
}

export default function ShelfScene({ picked, onPick, lite }: { picked: string | null; onPick: (id: string | null) => void; lite: boolean }) {
  const items = useMemo(() => layout(), []);
  return (
    <Canvas
      flat
      shadows={lite ? false : "percentage"}
      dpr={lite ? [1, 1.5] : [1, 2]}
      camera={{ fov: 30, position: [0, 1.6, 14.5] }}
      onPointerMissed={() => onPick(null)}
      aria-label="A bookshelf of books I've read. Select a book to see its covers and summary."
    >
      <color attach="background" args={["#f7f3ec"]} />
      <hemisphereLight args={["#ffffff", "#d6c7b0", 0.9]} />
      <Fit />
      <directionalLight position={[4, 8, 9]} intensity={1.1} castShadow={!lite} shadow-mapSize={[1024, 1024]} />
      <Slide open={!!picked}>
        <group position={[0, -0.9, 0]}>
          <Case />
          {items.map((it) => (
            <BookMesh key={it.book.id} item={it} picked={picked === it.book.id} onPick={onPick} />
          ))}
        </group>
      </Slide>
    </Canvas>
  );
}
