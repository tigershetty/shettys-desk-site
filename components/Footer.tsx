"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// The footer as a bill of materials: what this site is made of. The parts
// ride a conveyor as parcels; as each one passes the scanner its BOM line
// lights up as received. One rAF loop moves the belt and pauses off-screen.

const parts = [
  { pn: "PN-001", name: "Next.js", qty: "1", supplier: "Vercel" },
  { pn: "PN-002", name: "Claude Code", qty: "1", supplier: "Anthropic" },
  { pn: "PN-003", name: "Tailwind CSS", qty: "1", supplier: "Tailwind Labs" },
  { pn: "PN-004", name: "Hosting", qty: "1", supplier: "Vercel" },
  { pn: "PN-005", name: "Coffee", qty: "∞", supplier: "Lund" },
  { pn: "PN-006", name: "Curiosity", qty: "∞", supplier: "Bangalore → Lund" },
  { pn: "PN-007", name: "Trial & error", qty: "lots", supplier: "In-house" },
];

const SLOT = 168; // px between parcel centres
const SPEED = 46; // px per second

function Barcode({ seed }: { seed: number }) {
  const bars = Array.from({ length: 14 }, (_, i) => 1 + ((seed * 7 + i * 5) % 3));
  let x = 0;
  return (
    <svg viewBox="0 0 40 12" className="h-3 w-10" aria-hidden>
      {bars.map((w, i) => {
        const r = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w * 0.7} height={12} fill="currentColor" /> : null;
        x += w * 0.7 + 0.4;
        return r;
      })}
    </svg>
  );
}

export default function Footer() {
  const beltRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const [received, setReceived] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const belt = beltRef.current;
    const track = trackRef.current;
    const root = rootRef.current;
    if (!belt || !track || !root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No belt: everything has simply arrived.
      const id = requestAnimationFrame(() => setReceived(new Set(parts.map((_, i) => i))));
      return () => cancelAnimationFrame(id);
    }
    const loop = parts.length * SLOT;
    let offset = 0;
    let last = 0;
    let raf = 0;
    let visible = false;
    let current = -1;
    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      offset = (offset + dt * SPEED) % loop;
      track.style.transform = `translate3d(${-offset}px,0,0)`;
      // Which parcel is under the scanner (the centre of the belt)?
      const scanX = belt.clientWidth / 2 + offset;
      const nearest = Math.round((scanX - SLOT / 2) / SLOT);
      const centre = nearest * SLOT + SLOT / 2;
      const idx = Math.abs(centre - scanX) < 26 ? ((nearest % parts.length) + parts.length) % parts.length : -1;
      if (idx !== current) {
        current = idx;
        setActive(idx);
        if (idx >= 0) setReceived((r) => (r.has(idx) ? r : new Set(r).add(idx)));
      }
      if (visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Enough parcels to cover any belt width twice over.
  const parcels = Array.from({ length: parts.length * 3 }, (_, i) => i);

  return (
    <footer ref={rootRef} className="border-t border-foreground bg-background">
      <div className="grid gap-0 px-4 sm:px-6 lg:grid-cols-[minmax(0,26rem)_1fr] lg:pl-[calc(16rem+2rem)] lg:pr-12">
        {/* the bill of materials */}
        <div className="border-b border-border py-4 lg:border-b-0 lg:border-r lg:py-5 lg:pr-6">
          <div className="mb-2 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="font-semibold text-foreground">Bill of materials</span>
            <span>Shetty&apos;s Desk · Rev. 4</span>
          </div>
          <table className="w-full font-mono text-[11px]">
            <thead>
              <tr className="text-left text-[9px] uppercase tracking-wider text-muted-foreground/70">
                <th className="py-1 pr-2 font-medium">Part</th>
                <th className="py-1 pr-2 font-medium">Component</th>
                <th className="py-1 pr-2 text-right font-medium">Qty</th>
                <th className="hidden py-1 pr-2 font-medium sm:table-cell">Supplier</th>
                <th className="py-1 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, i) => (
                <tr
                  key={p.pn}
                  className={cn(
                    "border-t border-dashed border-border transition-colors duration-300",
                    active === i ? "bg-primary/10 text-foreground" : "text-muted-foreground"
                  )}
                >
                  <td className="py-1 pr-2 text-muted-foreground/70">{p.pn}</td>
                  <td className={cn("py-1 pr-2", active === i && "font-semibold text-primary")}>{p.name}</td>
                  <td className="py-1 pr-2 text-right">{p.qty}</td>
                  <td className="hidden py-1 pr-2 sm:table-cell">{p.supplier}</td>
                  <td className="py-1 text-right">
                    {received.has(i) ? (
                      <span className={cn("text-emerald-600", active === i && "font-semibold")}>✓ Received</span>
                    ) : (
                      <span className="text-muted-foreground/50">In transit</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* the conveyor */}
        <div ref={beltRef} className="relative -mx-4 h-[150px] overflow-hidden sm:-mx-6 lg:mx-0 lg:h-auto lg:min-h-[190px]" aria-hidden>
          {/* belt surface */}
          <div className="absolute inset-x-0 bottom-8 h-5 bg-neutral-800">
            <div
              className="absolute inset-0 opacity-40"
              style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 18px, rgba(255,255,255,.35) 18px 20px)" }}
            />
          </div>
          <div className="absolute inset-x-0 bottom-5 flex justify-between px-2">
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} className="h-3 w-3 rounded-full border border-neutral-700 bg-neutral-400" />
            ))}
          </div>

          {/* parcels */}
          <div ref={trackRef} className="absolute bottom-[3.25rem] left-0 flex will-change-transform">
            {parcels.map((n) => {
              const p = parts[n % parts.length];
              const i = n % parts.length;
              return (
                <div key={n} className="flex shrink-0 justify-center" style={{ width: SLOT }}>
                  <div
                    className={cn(
                      "relative h-[78px] w-[124px] rounded-[3px] border border-[#a07b4f] bg-[linear-gradient(180deg,#e2c196,#d2ab7a)] shadow-[0_6px_10px_-6px_rgba(0,0,0,.5)] transition-transform duration-200",
                      active === i && "-translate-y-1"
                    )}
                  >
                    <span className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-[#c49a6c]/70" />
                    <div className="absolute left-2 right-2 top-2.5 rounded-[2px] bg-white px-1.5 py-1 shadow-sm">
                      <p className="truncate font-mono text-[8px] uppercase tracking-wider text-neutral-500">{p.pn}</p>
                      <p className="truncate text-[11px] font-semibold leading-tight text-neutral-900">{p.name}</p>
                      <div className="mt-0.5 flex items-center justify-between text-neutral-900">
                        <Barcode seed={i + 1} />
                        <span className="font-mono text-[8px] text-neutral-500">×{p.qty}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* scanner gate at the centre */}
          <div className="pointer-events-none absolute bottom-6 left-1/2 top-3 w-[156px] -translate-x-1/2">
            <div className="absolute inset-x-0 top-0 h-4 rounded-t-lg bg-primary" />
            <div className="absolute bottom-0 left-0 top-0 w-1.5 rounded-bl bg-primary" />
            <div className="absolute bottom-0 right-0 top-0 w-1.5 rounded-br bg-primary" />
            <span className="absolute left-1/2 top-0.5 -translate-x-1/2 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
              Scan
            </span>
            <span
              className={cn(
                "absolute bottom-0 left-1/2 top-4 w-[2px] -translate-x-1/2 transition-all duration-200",
                active >= 0 ? "bg-amber-400 shadow-[0_0_12px_3px_rgba(251,191,36,.8)]" : "bg-rose-500/60"
              )}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
