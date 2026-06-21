"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type SplitHeadingProps = {
  text: string;
  className?: string;
};

/**
 * Heading whose characters mask-reveal up, line by line, on scroll, via GSAP
 * SplitText + ScrollTrigger. Renders plain text (and stays fully visible) under
 * reduced motion or before hydration, so it's accessible without JS.
 */
export default function SplitHeading({ text, className }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const split = new SplitText(el, { type: "words,chars" });
    const ctx = gsap.context(() => {
      gsap.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.018,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, ref);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [text]);

  return (
    <h2 ref={ref} className={className}>
      {text}
    </h2>
  );
}
