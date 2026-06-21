"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TextTypewriter from "./TextTypewriter";

const SESSION_KEY = "agent-intro-played";

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function lockScroll(locked: boolean) {
  const root = document.documentElement;
  if (locked) {
    root.classList.add("intro-active");
  } else {
    root.classList.remove("intro-active");
  }
}

export default function Preloader() {
  // Render the overlay on first paint for everyone; repeat visits hide it
  // before paint via the layout effect below (so there's no content flash).
  const [active, setActive] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Skip the intro for repeat visits within the same session — before paint.
    if (sessionStorage.getItem(SESSION_KEY)) {
      setActive(false);
      return;
    }

    lockScroll(true);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      lockScroll(false);
      setActive(false);
      // Recalculate any scroll-driven animations now the page is interactive.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Minimal, accessible version: hold briefly, then fade out.
        gsap.set([logoRef.current, contentRef.current], { opacity: 1 });
        if (barRef.current) gsap.set(barRef.current, { scaleX: 1 });
        if (counterRef.current) counterRef.current.textContent = "100";
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 0.4,
          delay: 1.2,
          ease: "power2.out",
          onComplete: finish,
        });
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline();

      tl.from(logoRef.current, {
        opacity: 0,
        y: 10,
        scale: 0.94,
        filter: "blur(10px)",
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          contentRef.current,
          { opacity: 0, y: 8, duration: 0.5, ease: "power2.out" },
          "-=0.25"
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.9,
            ease: "power1.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(Math.round(counter.v));
              }
            },
          },
          0.3
        )
        .to(
          barRef.current,
          { scaleX: 1, duration: 1.9, ease: "power1.inOut" },
          0.3
        )
        // Hold on the finished state for a beat.
        .to({}, { duration: 0.35 })
        // Signature reveal: wipe the curtain upward to expose the page.
        .to(
          contentRef.current,
          { opacity: 0, y: -16, duration: 0.5, ease: "power2.in" },
          ">-0.1"
        )
        .to(
          rootRef.current,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.85,
            ease: "expo.inOut",
            onComplete: finish,
          },
          "<0.1"
        );
    }, rootRef);

    return () => {
      ctx.revert();
      lockScroll(false);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      aria-label="Loading"
      role="status"
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div ref={logoRef} className="flex flex-col items-center">
        <Image
          src="/images/logo.png"
          alt="Shetty's Desk"
          width={88}
          height={88}
          priority
          className="rounded-2xl"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}
        />
      </div>

      <div
        ref={contentRef}
        className="mt-6 flex w-[min(78vw,320px)] flex-col items-center"
      >
        <TextTypewriter
          duration={2.5}
          className="text-center font-mono text-base text-foreground sm:text-lg"
        >
          a (gent) is thinking
        </TextTypewriter>

        <div className="mt-6 flex w-full items-center gap-3">
          <div className="h-px flex-1 overflow-hidden bg-foreground/10">
            <div
              ref={barRef}
              className="h-full w-full origin-left bg-primary"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            <span ref={counterRef}>0</span>
          </span>
        </div>
      </div>
    </div>
  );
}
