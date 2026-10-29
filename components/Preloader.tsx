"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TextTypewriter from "./TextTypewriter";
import { GlassIconReveal } from "./ui/liquid-glass-logo-reveal";

const SESSION_KEY = "agent-intro-played";

// Intro backdrop: the site's own light field (`--background`). The logo keeps
// its own colours, and the glass reveal paints this colour behind it, so the
// curtain lifts onto a page that already matches. Single source of truth.
const PRELOADER_BG = "#f7f9f3";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Skip the intro for repeat visits within the same session, before paint.
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
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
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

      // The logo itself is revealed by the glass (its own WebGL timeline,
      // about 3.5 s); this timeline runs the caption, the counter and the exit.
      tl.from(
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
      <GlassIconReveal
        logo="/images/logo-full.png"
        label="Shetty's Desk"
        look="light"
        originalColors
        background={PRELOADER_BG}
        loop={false}
        tileSize={240}
        logoScale={0.8}
        finalScale={0.95}
        // A gentle start: at the default zoom the grainy scribble fills the
        // droplet as a flat orange blob before it reads as the mark.
        tuning={{ startZoom: 1.45, swell: 0 }}
        className="aspect-square w-[min(86vw,440px)] cursor-default"
      />

      <div
        ref={contentRef}
        className="-mt-6 flex w-[min(78vw,320px)] flex-col items-center"
      >
        <TextTypewriter
          duration={2}
          className="text-center font-mono text-base text-foreground/80 sm:text-lg"
        >
          a(gent) is thinking....
        </TextTypewriter>

        <div className="mt-6 flex w-full items-center gap-3">
          <div className="h-px flex-1 overflow-hidden bg-foreground/15">
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
