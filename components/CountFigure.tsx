"use client";

import { useEffect, useRef } from "react";

/** Shows the real figure from the first render (for readers and parsers),
 * then counts up once when it scrolls into view. */
export default function CountFigure({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fmt = (v: number) => Math.round(v).toLocaleString("en-US");
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = () => {
          // performance.now(), not the frame timestamp: the two clocks can
          // disagree (a negative or huge step flashes wrong figures). Clamped
          // so the figure never counts below 0 or past n.
          const k = Math.max(0, Math.min(1, (performance.now() - t0) / 1200));
          el.textContent = fmt(n * (1 - Math.pow(1 - k, 4)));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        el.textContent = "0";
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [n]);
  return <span ref={ref}>{n.toLocaleString("en-US")}</span>;
}
