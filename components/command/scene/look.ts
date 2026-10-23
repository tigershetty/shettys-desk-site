import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

// Palette for the low-poly world, tuned to the WareTrack look and re-skinned
// with Shetty's Desk indigo, teal and amber.
export const C = {
  ground: "#eef0fa",
  yard: "#e4e7f1",
  road: "#cfd5e4",
  kerb: "#f8fafc",
  dash: "#ffffff",
  bay: "#f5b301",
  wall: "#e7e9ef",
  roof: "#4f46e5",
  trim: "#4338ca",
  white: "#f8fafc",
  doorDark: "#2b2f45",
  box: "#d8b48a",
  boxDark: "#c49a6c",
  wood: "#b0865a",
  crate: "#6366f1",
  steel: "#94a3b8",
  rack: "#f97316",
  trunk: "#8b6b4a",
  leaf: "#5ccf7e",
  leafDark: "#3fb565",
  block: "#f3f4f8",
  blockRoof: "#d9ddeb",
  glass: "#c7d2fe",
  forklift: "#facc15",
  mast: "#1f2937",
  vest: "#f97316",
  tyre: "#1f2937",
  teal: "#0d9488",
  amber: "#f59e0b",
  green: "#22c55e",
  red: "#ef4444",
  pin: "#4f46e5",
  water: "#bfdbfe",
  land: "#f6f7fd",
};

let corrugated: CanvasTexture | null = null;
/** Vertical ribs for the warehouse cladding. */
export function corrugatedTexture() {
  if (corrugated || typeof document === "undefined") return corrugated;
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 8;
  const g = c.getContext("2d")!;
  g.fillStyle = C.wall;
  g.fillRect(0, 0, 64, 8);
  for (let x = 0; x < 64; x += 8) {
    g.fillStyle = "#d4d7e0";
    g.fillRect(x, 0, 2, 8);
    g.fillStyle = "#f4f5f9";
    g.fillRect(x + 2, 0, 2, 8);
  }
  corrugated = new CanvasTexture(c);
  corrugated.wrapS = RepeatWrapping;
  corrugated.wrapT = RepeatWrapping;
  corrugated.colorSpace = SRGBColorSpace;
  return corrugated;
}

const signs = new Map<string, CanvasTexture>();
/** A facade sign with the logo cube and a line of text. */
export function signTexture(title: string, sub: string, dark = false) {
  const key = `${title}|${sub}|${dark}`;
  if (signs.has(key)) return signs.get(key)!;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = dark ? "#1e1b4b" : "#ffffff";
  g.beginPath();
  g.roundRect(0, 0, 512, 128, 24);
  g.fill();
  // Logo cube
  g.fillStyle = "#4f46e5";
  g.beginPath();
  g.moveTo(64, 22);
  g.lineTo(104, 44);
  g.lineTo(104, 88);
  g.lineTo(64, 110);
  g.lineTo(24, 88);
  g.lineTo(24, 44);
  g.closePath();
  g.fill();
  g.fillStyle = "#a5b4fc";
  g.beginPath();
  g.moveTo(64, 22);
  g.lineTo(104, 44);
  g.lineTo(64, 66);
  g.lineTo(24, 44);
  g.closePath();
  g.fill();
  g.fillStyle = dark ? "#ffffff" : "#111827";
  g.font = "700 46px system-ui, sans-serif";
  g.textBaseline = "middle";
  g.fillText(title, 128, 50);
  g.fillStyle = dark ? "#c7d2fe" : "#4f46e5";
  g.font = "600 28px system-ui, sans-serif";
  g.fillText(sub, 130, 94);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  signs.set(key, t);
  return t;
}

const marks = new Map<string, CanvasTexture>();
/** Trailer side livery: stripe plus wordmark. */
export function liveryTexture(name: string, stripe: string, house: boolean) {
  const key = name;
  if (marks.has(key)) return marks.get(key)!;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 512, 128);
  g.fillStyle = stripe;
  if (house) {
    g.fillRect(0, 96, 512, 32);
  } else {
    g.fillRect(0, 100, 512, 14);
    g.fillRect(0, 118, 512, 6);
  }
  if (house) {
    g.fillStyle = "#4f46e5";
    g.beginPath();
    g.moveTo(70, 18);
    g.lineTo(100, 34);
    g.lineTo(100, 66);
    g.lineTo(70, 82);
    g.lineTo(40, 66);
    g.lineTo(40, 34);
    g.closePath();
    g.fill();
  }
  g.fillStyle = house ? "#1e1b4b" : stripe;
  g.font = `800 ${house ? 44 : 50}px system-ui, sans-serif`;
  g.textBaseline = "middle";
  g.fillText(house ? "SHETTY'S DESK" : name.toUpperCase(), house ? 120 : 40, 52);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  marks.set(key, t);
  return t;
}
