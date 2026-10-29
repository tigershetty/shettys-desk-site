"use client";

import { useEffect, useRef } from "react";

// A slowly turning sphere of particles, drawn on a 2D canvas. Dots are
// spread evenly (a Fibonacci lattice), shaded by depth, and tinted from teal
// at the south to indigo at the north. Two pins mark where the story starts
// (Bangalore) and where it went (Malmö), joined by a great-circle arc.
// Drawing pauses off-screen and stops for people who prefer reduced motion.

type Vec = [number, number, number];

const toVec = (lat: number, lng: number): Vec => {
  const la = (lat * Math.PI) / 180;
  const lo = (lng * Math.PI) / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};

const BANGALORE = toVec(12.97, 77.59);
const MALMO = toVec(55.6, 13.0);

/** Points along the great circle between two unit vectors, lifted off the surface. */
function arc(a: Vec, b: Vec, steps = 56, lift = 0.16): Vec[] {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const out: Vec[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const k1 = Math.sin((1 - t) * omega) / Math.sin(omega);
    const k2 = Math.sin(t * omega) / Math.sin(omega);
    const r = 1 + lift * Math.sin(Math.PI * t);
    out.push([(a[0] * k1 + b[0] * k2) * r, (a[1] * k1 + b[1] * k2) * r, (a[2] * k1 + b[2] * k2) * r]);
  }
  return out;
}

const ARC = arc(BANGALORE, MALMO);
const TILT = -0.5; // radians; tips the north pole toward the viewer
const SPEED = 0.16; // radians per second

function buildPoints(count: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pts: Vec[] = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const th = i * golden;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return pts;
}

export default function ParticleSphereAnimation({ className, count = 1500 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pts = buildPoints(count);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let yaw = 4.1; // starts with Bangalore turning into view
    let t = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let w = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      const px = Math.max(1, Math.round(w * dpr));
      if (canvas.width !== px || canvas.height !== px) {
        canvas.width = px;
        canvas.height = px;
      }
    };

    const spin = (v: Vec): Vec => {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const x = v[0] * cy + v[2] * sy;
      const z = -v[0] * sy + v[2] * cy;
      const ct = Math.cos(TILT);
      const st = Math.sin(TILT);
      return [x, v[1] * ct - z * st, v[1] * st + z * ct];
    };

    const draw = () => {
      resize();
      const S = canvas.width;
      const R = S * 0.46;
      const c = S / 2;
      ctx.clearRect(0, 0, S, S);

      // soft body
      const g = ctx.createRadialGradient(c, c, R * 0.1, c, c, R * 1.05);
      g.addColorStop(0, "rgba(79,70,229,0.07)");
      g.addColorStop(0.8, "rgba(79,70,229,0.03)");
      g.addColorStop(1, "rgba(79,70,229,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(c, c, R * 1.05, 0, Math.PI * 2);
      ctx.fill();

      const unit = (S / 580) * 1; // dot size scales with the canvas
      for (const p of pts) {
        const [x, y, z] = spin(p);
        const d = (z + 1) / 2; // 0 back, 1 front
        const a = 0.1 + 0.8 * Math.pow(d, 1.7);
        const m = (y + 1) / 2; // 0 south, 1 north
        const r = Math.round(20 + (79 - 20) * m);
        const gg = Math.round(184 + (70 - 184) * m);
        const b = Math.round(166 + (229 - 166) * m);
        ctx.fillStyle = `rgba(${r},${gg},${b},${a.toFixed(3)})`;
        const rad = (0.7 + 1.5 * d) * unit * 1.7;
        ctx.beginPath();
        ctx.arc(c + x * R, c - y * R, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // the arc from Bangalore to Malmö
      ctx.lineWidth = 1.6 * unit * 1.7;
      ctx.lineCap = "round";
      let prev: { x: number; y: number; z: number } | null = null;
      for (const v of ARC) {
        const [x, y, z] = spin(v);
        const cur = { x: c + x * R, y: c - y * R, z };
        if (prev && cur.z > -0.05 && prev.z > -0.05) {
          ctx.strokeStyle = `rgba(245,158,11,${(0.25 + 0.7 * ((cur.z + 1) / 2)).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(cur.x, cur.y);
          ctx.stroke();
        }
        prev = cur;
      }

      // the two pins, with a slow pulse
      for (const pin of [BANGALORE, MALMO]) {
        const [x, y, z] = spin(pin);
        if (z < -0.05) continue;
        const px = c + x * R;
        const py = c - y * R;
        const pulse = (Math.sin(t * 2.2) + 1) / 2;
        ctx.fillStyle = `rgba(245,158,11,${(0.18 * (1 - pulse)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, (6 + 10 * pulse) * unit * 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(px, py, 3.4 * unit * 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1.2 * unit * 1.7;
        ctx.stroke();
      }
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      yaw += dt * SPEED;
      t += dt;
      draw();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || reduce) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);

    draw();
    start();
    return () => {
      io.disconnect();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);

  return <canvas ref={ref} aria-hidden className={className ?? "block h-full w-full"} />;
}
