# Shetty's Desk → World-Class Upgrade — Breakdown & Plan

**Date:** 2026-06-20
**Status:** Plan for review (no code shipped yet)
**Targets:** match the feel of `https://www.carmen-elena.space` while keeping the
Shetty's Desk logo, brand colours and content.

> **Honesty note:** `carmen-elena.space` returns **HTTP 403** to automated
> fetchers and web search was unavailable during this pass, so the "Carmen"
> column below describes the **archetype** her site belongs to (the Awwwards
> "creative-developer portfolio" pattern: cinematic preloader → WebGL hero →
> GSAP scroll choreography → custom cursor → inertia/smooth scroll). If any
> specific detail is wrong, correct me and I'll adjust the build.

---

## 1. TL;DR

We are **not** rebuilding the site from scratch. We keep the content, the bento
layout idea, the logo and the palette, and we replace the *motion layer* — the
preloader, the scroll behaviour, the hero background and the card interactions —
with the techniques that make award-winning sites feel premium.

Three explicit asks from you, all incorporated:

1. **Preloader** showing **"a(gent) is thinking"** via your `TextTypewriter`
   component — logo kept, original colours kept.
2. **GSAP + ScrollTrigger** as the scroll/animation engine (your choice).
3. **`Folder` component** evaluated for the bento boxes (verdict: **yes, with a
   brand re-skin** — see §7).

---

## 2. The three sites side by side

| Dimension | **Carmen (archetype/target)** | **Current shettys-desk** | **What we're building** |
|---|---|---|---|
| **First impression** | Full-screen cinematic **preloader**: counter 0→100 and/or typed text, then a **curtain/mask reveal** into the hero | `BrandMoment` colour-flash (1.5s) + a CSS "washing-machine" spinner on route loads | **"a(gent) is thinking"** typed preloader (your `TextTypewriter`), logo centered, **GSAP mask-wipe** hand-off into the hero |
| **Hero** | **WebGL** centerpiece (shader gradient / particle field / 3D object) reacting to cursor | Static card with CSS `radial-gradient` "mesh" + `DecryptedText` heading | **three.js logistics-node particle field** in brand colours behind the existing hero copy |
| **Scroll** | **Inertia/smooth scroll** (Lenis) + **GSAP ScrollTrigger** pins, parallax, staggered reveals, progress-driven sequences | Framer `BlurFade` fade-up on mount; native scroll | **Lenis** smooth scroll + **ScrollTrigger** reveals/pins/parallax replacing the static fades |
| **Cards / content** | Editorial grid, magnetic hover, image-reveal masks | Bento grid, `cobe` globe, stat counters, radar section | Same grid + **`Folder` cards (brand-reskinned)** with spring hover; keep globe/stats |
| **Cursor** | Custom cursor + magnetic buttons | Native cursor | Optional custom cursor + magnetic CTAs (desktop only) |
| **Typography** | Oversized display type, `SplitText` line/char reveals | Geist / Geist Mono / Source Code Pro | Same fonts; add `SplitText`-style line reveals on headings |
| **Transitions** | Animated page-to-page transitions | Hard route changes | View-Transition / overlay page transitions |
| **Palette** | Her own (usually high-contrast dark or warm neutral) | Cream `#f7f9f3`, indigo `#4f46e5`, amber `#f59e0b`, teal `#14b8a6`, black | **Identical** — we reuse the exact CSS variables already in `globals.css` |
| **Stack** | Likely Next/Nuxt + three.js + GSAP + Lenis | Next 16, React 19, Tailwind v4, Framer Motion 12, three.js 0.183, cobe | Next 16 + **three.js (already in)** + **GSAP+ScrollTrigger (new)** + **Lenis (new)** + Framer (kept) |

**The gap in one sentence:** the current site has good *content and layout* but
its motion is **mount-triggered and CSS-only**; award-winning sites are
**scroll-driven, WebGL-backed, and choreographed on a timeline** — and they open
with a *moment* before they show you anything.

---

## 3. Anatomy of "award-winning" (what we're actually copying)

Five ingredients, in priority order:

1. **The opening moment.** A preloader that buys 1.5–2.5s to (a) hide asset/load
   jank and (b) set tone. The *reveal* out of the preloader is the single most
   memorable frame. → This is your `TextTypewriter` "a(gent) is thinking" + a
   GSAP wipe.
2. **Smooth scroll.** Native scroll feels "cheap" next to Lenis inertia. It also
   gives GSAP a clean progress value to drive everything else.
3. **Scroll choreography (GSAP ScrollTrigger).** Things *enter as you arrive*,
   pin while you read, parallax at different depths, and headings split into
   lines that stagger in. This is 70% of the "premium" feeling.
4. **One WebGL hero.** A single, tasteful three.js scene — not WebGL everywhere.
   For a *supply-chain* brand, a **network of nodes/routes** (points + lines,
   gently drifting, reacting to the pointer) is on-theme and cheap to run.
5. **Micro-interactions.** Magnetic buttons, custom cursor, card spring physics
   (your `Folder`), link underlines that wipe. Small, everywhere, consistent.

---

## 4. three.js breakdown

**Where:** one scene, behind the hero (`HeroBento`), full-bleed, `pointer-events:none`.

**What (recommended): a logistics-node particle field.**
- A `THREE.Points` cloud (≈ 600 desktop / ≈ 200 mobile) positioned in a shallow
  3D volume.
- `THREE.LineSegments` connecting nearby nodes (distance threshold) → "routes".
- Colours sampled from the brand tokens: indigo `#4f46e5`, teal `#14b8a6`,
  amber `#f59e0b` on the cream `#f7f9f3` background.
- Slow constant drift + a subtle parallax toward the pointer (lerp the camera or
  a group rotation). On scroll, ScrollTrigger nudges camera Z for depth.

**How it plugs in:** dynamic import with `ssr:false` (the repo already does this
in `OrbitingSkillsLoader.tsx`), wrapped in a component that owns its own
`renderer`, `requestAnimationFrame` loop and a `ResizeObserver`.

**Performance rules (non-negotiable for "world class" = also fast):**
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`.
- Pause the RAF loop when the canvas is offscreen (`IntersectionObserver`) and on
  `document.hidden`.
- Mobile: fewer points, no line segments (or a much smaller threshold), lower DPR.
- `prefers-reduced-motion` → render one static frame, no animation.
- Single geometry + `BufferGeometry`, no per-frame allocations.

**Alternatives considered:** (a) a full-screen fragment-shader gradient (cheaper,
less on-theme); (b) elevate the existing `cobe` globe into the hero (nice, but
globe ≠ hero centerpiece). The node field wins on theme + cost.

---

## 5. GSAP breakdown

Add `gsap` (now fully free, incl. **ScrollTrigger**, **SplitText**, **Flip**).

| Technique | Where we use it |
|---|---|
| **Timeline** | The preloader sequence (logo in → type → counter → exit wipe) and the hero entrance after reveal |
| **ScrollTrigger reveals** | Replace `BlurFade` mount-fades with scroll-linked staggered reveals on every section |
| **ScrollTrigger pin** | Pin the hero / a stat block while a sub-sequence plays |
| **Parallax** | Background node-field depth + foreground cards moving at different rates |
| **SplitText** | Headings (`HeroBento` h1, section titles) reveal line-by-line / char-by-char |
| **scrub** | Tie the node-field camera + a progress bar to scroll position |
| **Flip** | (Optional) bento → detail layout transitions |

**Smooth scroll:** `lenis`, RAF-driven, with `ScrollTrigger.update` wired into
Lenis's `scroll` event and `gsap.ticker` driving Lenis. Disabled under
`prefers-reduced-motion` and optionally on touch.

**Next 16 / App Router notes:**
- Everything GSAP lives in `"use client"` components.
- Register plugins once (`gsap.registerPlugin(ScrollTrigger, SplitText)`).
- Use `gsap.context()` + `ctx.revert()` in `useEffect` cleanup so route changes
  don't leak triggers (critical in App Router).
- Call `ScrollTrigger.refresh()` after fonts/images load.

---

## 6. The preloader — "a(gent) is thinking" (your explicit ask)

**Component:** your `TextTypewriter` (one change: its import is
`from "motion/react"`; the repo ships **`framer-motion`**, so we point it at
`framer-motion` — same API, no behaviour change).

**Sequence (GSAP timeline):**
1. Overlay = full-screen, `z-[9999]`, background **`var(--background)`** (cream —
   original colour). 
2. Logo (`/images/logo.png`, kept) fades/scales in (blur→sharp), ~400ms.
3. `TextTypewriter` types **`a(gent) is thinking`** in mono (Geist Mono / Source
   Code Pro) with its glitch effect; cursor blinks.
   - *Optional polish:* tint the `(gent)` parenthetical in `--primary` so
     "a … is thinking" reads as the constant and **(gent)** pops. (Needs a tiny
     extension to `TextTypewriter` since it currently takes a plain string.)
4. Optional **0→100 counter** and/or a thin `--primary` progress line that fills
   while real load completes — the Carmen-genre signature.
5. **Exit reveal:** once typing finishes **and** a min display time has elapsed
   **and** the page is ready, a GSAP **mask/curtain wipe** (clip-path moving up,
   or two panels parting) uncovers the hero. `prefers-reduced-motion` → plain
   fade.

**Behaviour details that separate "good" from "janky":**
- **Show once per session** via `sessionStorage` so it doesn't replay on every
  internal navigation. Route-transition loads keep a *lightweight* inline loader.
- Lives as a dedicated `<Preloader/>` overlay mounted in `layout.tsx` (above
  everything), removing itself after the intro — *not* in `app/loading.tsx`
  (that file is the Suspense fallback for route transitions, a different job).
- Lock body scroll while visible; restore + `ScrollTrigger.refresh()` on exit.
- Colours stay 100% original: cream bg, indigo/amber accents, black text.

---

## 7. The `Folder` component for the bento boxes — verdict

**Verdict: yes — use it for the category/section cards, but re-skin to brand.**

**Fits:**
- Imports `motion` from `framer-motion` ✅ (matches repo) and `cn` from
  `@/lib/utils` ✅ (exists).
- Spring hover (papers fan/lift) is exactly the "premium micro-interaction" we
  want, and it suits a *desk/files* metaphor for "Shetty's **Desk**" — very
  on-brand conceptually.
- Tailwind v4 syntax it uses (`bg-linear-to-b`, `size-*`, `mask-[…]`) matches the
  repo's Tailwind v4 ✅.

**Needs adjusting:**
- Its `colorMap` uses generic Tailwind `blue/yellow/orange/red` — to honour
  "original colours" we'll **remap to the brand tokens** (indigo `--primary`,
  amber `--accent`, teal `--secondary`, plus `black`/`grey`). Best done with the
  CSS variables / `chart-*` colours already in `globals.css` rather than raw
  Tailwind palette, so light/dark themes both work.
- A couple of arbitrary spacings (`h-5.5`, `w-3.25`, `h-30`) should be
  sanity-checked against Tailwind v4's generated scale during the build.
- Accessibility: add real labels/links (each folder = a nav target: Articles,
  Approach, Experience, Workshop) and `aria-label`s; ensure keyboard focus +
  visible focus ring (hover-only today).

**Where it goes:** the secondary card row on the homepage and/or a "sections"
grid — Articles / Approach / About / Experience / Workshop as labelled folders.
Keep the globe, stats and radar as-is (they're already strong).

---

## 8. Colour & type system (unchanged)

We reuse the **exact** variables already in `app/globals.css`:
`--background #f7f9f3`, `--primary #4f46e5`, `--accent #f59e0b`,
`--secondary #14b8a6`, `--foreground #000`, plus the dark-mode set. Fonts stay
Geist / Geist Mono / Source Code Pro. **No palette or font changes** — the upgrade
is motion + depth, not a re-brand.

---

## 9. Mobile strategy

- Preloader: same, but smaller logo/type, shorter min-display, simpler exit wipe.
- three.js: lower point count, no/*fewer* line segments, DPR capped at ~1.5,
  pause when offscreen.
- Lenis: keep but with touch-tuned settings (or fall back to native on low-end).
- Magnetic cursor effects: **desktop/pointer-fine only** (`@media (pointer:fine)`).
- `Folder` hover → tap/`whileTap` affordance on touch; ensure tap targets ≥ 44px.
- Respect `prefers-reduced-motion` everywhere (your components already do).

---

## 10. Chrome DevTools verification plan (build phase)

When we build, each phase is checked with:
- **Lighthouse** (mobile + desktop): Performance, Accessibility, Best-Practices;
  target Perf ≥ 90 mobile, CLS ≈ 0 (watch the preloader→hero hand-off for layout
  shift), LCP < 2.5s.
- **Performance panel:** record the intro + a scroll pass; require ~60fps, no long
  tasks > 50ms, no forced reflows during scroll.
- **Rendering panel:** Frame-rendering-stats overlay + Paint-flashing to catch
  needless repaints from the WebGL/scroll layers.
- **Device toolbar:** 360 / 390 / 768 / 1280 widths; throttle to "Mid-tier mobile"
  + 4× CPU for the node field.
- **Coverage:** confirm GSAP/three are code-split and not loaded before the hero.
- Headless run via a script so results are reproducible and shown to you.

*(This pass is breakdown-only, so none of the above has run yet — it's the
acceptance gate for each build phase.)*

---

## 11. Phased roadmap

| Phase | Deliverable | New deps | Effort |
|---|---|---|---|
| **0** | Add `gsap`, `lenis`; register plugins; smooth-scroll provider | gsap, lenis | S |
| **1** | **Preloader "a(gent) is thinking"** + GSAP exit wipe + session gate *(your headline ask)* | — | M |
| **2** | Lenis + ScrollTrigger reveals/pins/parallax across existing sections (retire static `BlurFade`s) | — | M |
| **3** | **three.js** logistics-node hero field (brand colours, perf-budgeted) | — (three already in) | M |
| **4** | **`Folder`** bento cards, brand-reskinned + accessible | — | S |
| **5** | Custom cursor + magnetic CTAs + page transitions | — | M |
| **6** | a11y + mobile QA + Lighthouse/DevTools pass + polish | — | M |

Recommended first PR = **Phase 0 + Phase 1** (the preloader you asked for, on a
proper GSAP/Lenis foundation), verified in DevTools, then iterate.

---

## 12. Risks & honest caveats

- **403/blocked research:** the "Carmen" column is the *archetype*, not a literal
  scrape. Specific timings/colours of her site may differ.
- **Brand-colour constraint:** keeping the cream/indigo palette means we won't
  *look* identical to Carmen (likely a different palette) — we match the *feel*,
  not the skin. That's the right call for your brand.
- **Perf budget:** WebGL + smooth scroll + cursor all at once can hurt mobile;
  the budgets in §9/§10 are mandatory, not optional.
- **App-Router lifecycle:** GSAP triggers must be cleaned up per route or they
  leak; handled via `gsap.context()`.
- **Preloader fatigue:** gated to once-per-session so repeat visits aren't slowed.

---

## 13. New dependencies

- `gsap` (^3.13) — ScrollTrigger, SplitText, Flip all included & free.
- `lenis` (smooth scroll).
- `three`, `framer-motion`, `cobe` — **already installed**, reused.
