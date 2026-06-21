"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Vertical offset (px) the content rises from. */
  y?: number;
  /** Start delay (s). */
  delay?: number;
  /** When > 0, stagger the direct children instead of the wrapper. */
  stagger?: number;
};

/**
 * Scroll-triggered reveal driven by GSAP ScrollTrigger (works with Lenis).
 * Content rises + fades in as it enters the viewport. Honors reduced motion.
 */
export default function Reveal({
  children,
  className,
  y = 24,
  delay = 0,
  stagger = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);
    const targets = stagger > 0 ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.7,
        delay,
        ease: "power3.out",
        stagger: stagger > 0 ? stagger : 0,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, ref);

    return () => ctx.revert();
  }, [y, delay, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
