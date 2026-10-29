"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { GlassIconReveal, preloadGlassLogo } from "./ui/liquid-glass-logo-reveal";

const SESSION_KEY = "agent-intro-played";

// Intro backdrop: the page's primary accent (indigo `--primary`). The glass
// canvas paints the same colour, so the screen is one flat field and the logo
// (orange scribble, white wordmark) is the only thing on it. Single source of
// truth; tweak here.
const PRELOADER_BG = "#4f46e5";
const LOGO = "/images/logo-on-dark.png";

// The glass reveal runs on its own clock (about this long on a fast device).
// The counter and the exit follow the glass's own progress, so a slow device
// can never wipe the curtain before the logo has finished.
const GLASS = { present: 1.9, tail: 1.1 };
const GLASS_END = GLASS.present + GLASS.tail;
// Calmer than the default: the droplet grows on a slower spring, starts from a
// smaller bead, and the logo begins magnified against the rim then eases back
// onto the flat face, so the wordmark never sits on the bending edge.
const GLASS_TUNING = {
  present: GLASS.present,
  response: 0.6,
  startSize: 0.14,
  startZoom: 1.12,
  glide: 1.5,
  vivid: 0.4,
  swell: 0,
  opticalDepth: 0.6,
  dispersion: 0.7,
};

// Start fetching the logo and building its distance field as soon as this
// module loads, so it overlaps hydration instead of following it.
if (typeof window !== "undefined") {
  try {
    // Repeat visits in a session skip the intro, so skip the work too.
    if (!sessionStorage.getItem(SESSION_KEY)) preloadGlassLogo(LOGO);
  } catch {
    // Storage blocked: the intro will still play, just without the head start.
  }
}

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
  // The glass (and its WebGL context) only mounts when the intro really plays.
  const [play, setPlay] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hooks = useRef({
    ready: () => {},
    progress: (() => {}) as (p: number) => void,
    complete: () => {},
  });

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Skip the intro for repeat visits within the same session, before paint.
    if (sessionStorage.getItem(SESSION_KEY)) {
      setActive(false);
      return;
    }

    setPlay(true);
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

    const setProgress = (p: number) => {
      const v = Math.max(0, Math.min(1, p));
      if (barRef.current) barRef.current.style.transform = `scaleX(${v})`;
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(v * 100));
      }
    };

    let began = false;
    let leaving = false;
    let failsafe = 0;
    let hardCap = 0;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Minimal, accessible version: the glass shows one still frame; hold
        // briefly, then fade out.
        setProgress(1);
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 0.4,
          delay: 1.6,
          ease: "power2.out",
          onComplete: finish,
        });
        return;
      }

      // The glass has let go and the finished logo has had a beat: fade the
      // caption, then wipe the curtain upward to expose the page.
      const leave = () => {
        if (leaving) return;
        leaving = true;
        window.clearTimeout(failsafe);
        window.clearTimeout(hardCap);
        gsap
          .timeline()
          .to(
            contentRef.current,
            { autoAlpha: 0, y: -12, duration: 0.45, ease: "power2.in" },
            0.3
          )
          .to(
            rootRef.current,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.9,
              ease: "expo.inOut",
              onComplete: finish,
            },
            0.5
          );
      };

      const begin = () => {
        if (began) return;
        began = true;
        window.clearTimeout(failsafe);
      };

      hooks.current = { ready: begin, progress: setProgress, complete: leave };

      // If the glass never reports (no WebGL, very slow network), run the
      // counter on a clock instead so the intro still ends.
      failsafe = window.setTimeout(() => {
        if (began) return;
        begin();
        const t = { v: 0 };
        gsap.to(t, {
          v: 1,
          duration: GLASS_END,
          ease: "none",
          onUpdate: () => setProgress(t.v),
          onComplete: leave,
        });
      }, 2500);

      // Never let the intro hold the page hostage.
      hardCap = window.setTimeout(leave, 8000);
    }, rootRef);

    return () => {
      window.clearTimeout(failsafe);
      window.clearTimeout(hardCap);
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
      className="preloader-root fixed inset-0 z-[10000] overflow-hidden"
      style={{ clipPath: "inset(0 0 0% 0)", backgroundColor: PRELOADER_BG }}
    >
      {/* Without JavaScript the intro could never end, so it steps aside. */}
      <noscript>
        <style>{".preloader-root{display:none!important}"}</style>
      </noscript>
      {play && (
        <GlassIconReveal
          logo={LOGO}
          label="Shetty's Desk"
          look="dark"
          iconPlate={false}
          originalColors
          rasterAlpha
          // Fallback (no WebGL): a plain white mark.
          logoColor="#ffffff"
          background={PRELOADER_BG}
          loop={false}
          interactive={false}
          onReady={() => hooks.current.ready()}
          onRevealProgress={(p) => hooks.current.progress(p)}
          onRevealComplete={() => hooks.current.complete()}
          maxDpr={1.75}
          fit={1.35}
          tileSize={350}
          logoScale={0.62}
          finalScale={1.5}
          tuning={GLASS_TUNING}
          className="absolute inset-0 h-full w-full"
        />
      )}

      {/* The caption is plain markup, typed by CSS: it is in the server HTML, so
          it shows on the very first paint, before any script has run. */}
      <div
        className="pointer-events-none absolute inset-x-0 flex justify-center"
        style={{ top: "calc(50% + min(222px, 47vmin))" }}
      >
        <div ref={contentRef} className="flex w-[min(78vw,320px)] flex-col items-center">
          <div className="w-[23ch] text-left font-mono text-base text-white/90 sm:text-lg">
            <span className="preloader-type">a(gent) is thinking....</span>
          </div>

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
    </div>
  );
}
