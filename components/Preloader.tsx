"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TextTypewriter from "./TextTypewriter";

const SESSION_KEY = "agent-intro-played";

// Warm brand backdrop for the intro — a deepened tone of the logo's terracotta
// (the bright `--accent` amber is too light for the logo's white wordmark, and a
// lighter terracotta hides the scribble mark). This shade keeps the mark legible,
// the wordmark crisp, and the feel warm. Single source of truth — tweak here.
const PRELOADER_BG = "#9e4526";

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
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoTopRef = useRef<HTMLImageElement>(null);
  const logoBottomRef = useRef<HTMLImageElement>(null);
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
        gsap.set(
          [logoTopRef.current, logoBottomRef.current, contentRef.current],
          { opacity: 1, y: 0 }
        );
        if (glowRef.current) gsap.set(glowRef.current, { autoAlpha: 0 });
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

      // Dramatic assembly: the two halves fly in (offset, rotated, blurred,
      // scaled) and lock together, with a soft glow flash and an elastic settle.
      tl.from(
        logoTopRef.current,
        {
          yPercent: -85,
          rotation: -12,
          scale: 0.82,
          autoAlpha: 0,
          filter: "blur(12px)",
          duration: 0.95,
          ease: "power4.out",
        },
        0
      )
        .from(
          logoBottomRef.current,
          {
            yPercent: 85,
            rotation: 10,
            scale: 0.82,
            autoAlpha: 0,
            filter: "blur(12px)",
            duration: 0.95,
            ease: "power4.out",
          },
          0
        )
        // Glow flash as the halves meet.
        .fromTo(
          glowRef.current,
          { scale: 0.4, autoAlpha: 0 },
          { scale: 1.15, autoAlpha: 0.7, duration: 0.45, ease: "power2.out" },
          0.6
        )
        .to(
          glowRef.current,
          { autoAlpha: 0, scale: 1.4, duration: 0.6, ease: "power2.in" },
          1.0
        )
        // Snap-together pulse with an elastic settle.
        .to(logoBoxRef.current, { scale: 1.05, duration: 0.16, ease: "power2.out" }, 0.86)
        .to(
          logoBoxRef.current,
          { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
          1.02
        )
        .from(
          contentRef.current,
          { autoAlpha: 0, y: 10, duration: 0.5, ease: "power2.out" },
          1.0
        )
        .to(
          counter,
          {
            v: 100,
            duration: 2.4,
            ease: "power1.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(Math.round(counter.v));
              }
            },
          },
          1.15
        )
        .to(
          barRef.current,
          { scaleX: 1, duration: 2.4, ease: "power1.inOut" },
          1.15
        )
        // Hold on the finished state so the full line stays readable.
        .to({}, { duration: 0.5 })
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

      // Gentle continuous float once the mark has assembled.
      gsap.to(logoBoxRef.current, {
        y: -6,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.3,
      });
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
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{ clipPath: "inset(0 0 0% 0)", backgroundColor: PRELOADER_BG }}
    >
      <div
        ref={logoBoxRef}
        className="relative aspect-square w-[clamp(150px,40vw,208px)]"
      >
        {/* Glow that flashes as the halves meet */}
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.55) 0%, rgba(255,231,200,0.25) 35%, transparent 65%)",
            filter: "blur(8px)",
          }}
        />
        <Image
          ref={logoTopRef}
          src="/images/logo-mark-top.png"
          alt="Shetty's Desk"
          fill
          priority
          sizes="208px"
          className="relative select-none object-contain"
          draggable={false}
        />
        <Image
          ref={logoBottomRef}
          src="/images/logo-mark-bottom.png"
          alt=""
          fill
          sizes="208px"
          className="relative select-none object-contain"
          draggable={false}
        />
      </div>

      <div
        ref={contentRef}
        className="mt-2 flex w-[min(78vw,320px)] flex-col items-center"
      >
        <TextTypewriter
          duration={2}
          className="text-center font-mono text-base text-white/90 sm:text-lg"
        >
          a(gent) is thinking....
        </TextTypewriter>

        <div className="mt-6 flex w-full items-center gap-3">
          <div className="h-px flex-1 overflow-hidden bg-white/25">
            <div
              ref={barRef}
              className="h-full w-full origin-left bg-white"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-white/70">
            <span ref={counterRef}>0</span>
          </span>
        </div>
      </div>
    </div>
  );
}
