# Premium Landing Page Rebuild - Design Doc

**Date:** 2026-03-08
**Status:** Design review
**Scope:** Landing page full rebuild + site-wide theme overhaul

## Problem Statement

The current landing page has three core issues:

1. **Sizing is inconsistent and forces scrolling.** Generous margins (`mb-12`) and large card aspect ratios push content below the fold. A visitor lands and sees just the greeting + top of one article card. They must scroll to discover stats, radar, or secondary articles.

2. **The design feels flat and basic.** Every card uses the same `brand-card` background + `brand-border`. Color accents exist but are subtle opacity tints. There is no visual hierarchy between sections. No motion, no depth, no layering.

3. **The theme palette lacks distinction.** Navy blue + electric blue is generic. It does not stand out from thousands of similar developer portfolios.

## Goals

- Everything visible above the fold on desktop (1440px viewport)
- Premium feel through animation, glassmorphism, and visual hierarchy
- Distinctive teal/cyan LIGHT theme replacing the current dark navy/blue
- Each section block has its own color personality
- A "brand moment" loading transition (gradient sweep on first load)
- Light mode default. Clean, airy, professional.

## Non-Goals

- Changing any page other than the landing page (About, Experience, etc. inherit the new theme tokens but keep their layouts)
- Adding Spline 3D (deferred, use CSS gradients for now)
- Changing the sidebar/nav structure

---

## 1. Theme Overhaul

Replace the current custom `brand-*` token system with a full shadcn-style teal/cyan theme. This supports both light and dark modes. The site defaults to dark mode (matching the `.dark` class).

### Token System

The new theme uses CSS custom properties with `:root` (light) and `.dark` (dark) scopes, wired to Tailwind v4 via `@theme inline`.

**The site defaults to LIGHT mode.** No `.dark` class on `<html>`.

**Migration from brand tokens to shadcn tokens (light mode values):**

| Old (brand-*) | New (shadcn) | Light value | Purpose |
|----------------|-------------|-------------|---------|
| `brand-dark` | `background` | `#e8f0f0` (soft teal-white) | Page background |
| `brand-card` | `card` | `#f2f7f7` (near-white teal tint) | Card surfaces |
| `brand-border` | `border` | `#cde0e2` (soft teal border) | Borders |
| `brand-accent` | `primary` | `#06858e` (rich teal) | Primary accent, links, badges |
| `brand-glow` | `chart-2` | `#1e9ea6` (medium teal) | Hover states, secondary accent |
| `brand-white` | `foreground` | `#0a4a55` (deep teal-black) | Primary text (dark on light!) |
| `brand-muted` | `muted-foreground` | `#427a7e` (teal-gray) | Secondary text |
| `brand-mid` | `secondary` | `#d9eaea` (light teal surface) | Secondary surfaces |

**Key color relationships in light mode:**
- Background is airy and clean: `#e8f0f0`
- Cards are slightly lighter than background: `#f2f7f7` (creates a "raised" feel)
- Text is deep teal: `#0a4a55` (high contrast on the light bg)
- Accent is saturated teal: `#06858e` (bold, distinctive)
- Sidebar is a dedicated tint: `#daebed`

**Additional tokens available from the theme:**
- `chart-1` through `chart-5`: `#06858e` → `#8ad8dd` graduated teal scale for data visualizations
- `muted`: `#e0eaea` - subtle surface for disabled/inactive states
- `accent`: `#c9e5e7` - interactive surface backgrounds (hover, selected)
- `input`: `#d9eaea` - form input backgrounds
- `destructive`: `#d13838` - error states
- `sidebar-*`: dedicated sidebar color set (`#daebed` bg, `#cde0e2` border)
- `primary-foreground`: `#ffffff` - text on primary-colored buttons

### Font change

The theme specifies `Source Code Pro, monospace` for all font families. We will:
- Load Source Code Pro via Google Fonts (alongside existing Geist Sans)
- Use Source Code Pro as the mono font for terminal, code, and accent text
- Keep Geist Sans as the primary body font for readability
- The theme's Courier New fallback becomes the font stack: `Source Code Pro, Courier New, monospace`

### Implementation approach

We **replace** the current `@theme inline` block in globals.css entirely with the full shadcn token system (`:root` light values + `.dark` dark values + `@theme inline` wiring). The old `brand-*` tokens go away. All components get updated to use the new token names (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-primary`, etc.).

The `<html>` element has NO dark class. Light mode is the default. The `.dark` tokens exist in CSS for potential future dark mode toggle, but we do not build a toggle now.

---

## 2. Brand Moment - Loading Gradient Transition

On first page load, a full-viewport overlay animates:

```
Frame 0:    solid #e8f0f0 (background color - seamless start)
Frame 25%:  gradient sweep → #c9e5e7 (teal accent tint)
Frame 50%:  gradient sweep → #06858e (saturated teal - the brand moment)
Frame 75%:  gradient sweep → #f59e0b (amber/gold flash - energy burst)
Frame 100%: fade to transparent, reveal page content
```

Duration: 1.5s. CSS-only (`@keyframes`). Overlay div with `position: fixed; z-index: 9999`. After animation completes: `opacity: 0; pointer-events: none`.

The effect: page loads as a calm teal wash, intensifies to the brand teal, flashes amber, then reveals the content underneath. Premium first impression.

---

## 3. Landing Page - Bento Grid Layout

### Desktop (lg+) grid structure

```
┌────────────────────────────────────────────────────────┐
│                 HERO CELL (col-span-full)               │
│  Animated gradient bg │ Greeting │ Badge │ Tagline      │
│  Two CTA buttons                                        │
├───────────────────────────┬────────────────────────────┤
│  FEATURED ARTICLE         │  MY NUMBERS (compact)      │
│  (col-span-2, row-span-2)│  4 animated counters       │
│  Full-bleed image bg      │  "View experience →"       │
│  with gradient overlay    ├────────────────────────────┤
│  Title + tags overlaid    │  SUPPLY CHAIN RADAR        │
│                           │  Compact pill tags         │
├──────┬──────┬──────┬──────┴────────────────────────────┤
│ Art2 │ Art3 │ Art4 │ Art5                               │
│ thumb│ thumb│ thumb│ thumb (compact cards with          │
│ title│ title│ title│ title  tiny thumbnails)            │
└──────┴──────┴──────┴───────────────────────────────────┘
```

### Mobile (< lg) layout

Single column stack:
1. Hero (compact)
2. Featured article card
3. My Numbers (2x2 grid)
4. Supply Chain Radar (pill tags)
5. Secondary articles (2-col grid)

### Grid implementation

```css
/* Desktop: 4-column bento grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto auto;
  gap: 1rem;
}

/* Hero spans full width */
.bento-hero { grid-column: 1 / -1; }

/* Featured article: 2 columns, 2 rows */
.bento-featured { grid-column: 1 / 3; grid-row: 2 / 4; }

/* Numbers: top-right */
.bento-numbers { grid-column: 3 / 5; }

/* Radar: bottom-right */
.bento-radar { grid-column: 3 / 5; }

/* Secondary articles: 1 column each */
.bento-article { grid-column: span 1; }
```

---

## 4. Component Designs

### 4A. Hero Section (`HeroBento`)

**Background:** Animated CSS gradient mesh. Two overlapping radial gradients that slowly shift position using `@keyframes`. Colors: teal (`#06858e`) + accent tint (`#c9e5e7`) at low opacity (15-25%) on the light background.

**Content:**
- Time-based greeting (kept from current): "Good afternoon, friend" with SVG icon
- Availability badge (kept): animated ping dot + "Open to speaking & collaborations"
- Tagline with **text shimmer** effect: "I break down how supply chains actually work."
- Two CTA buttons:
  - Primary (filled teal): "Read my articles"
  - Secondary (outline): "About me"

**Animation:** All elements stagger-fade-in using `BlurFade` (100ms delay between each). Heading first, badge second, tagline third, buttons fourth.

**Height constraint:** `max-h-[180px]` on desktop. Compact.

### 4B. Featured Article Card

- Full card is the image with a gradient overlay (bottom: `from-card via-card/80 to-transparent`)
- "Featured" pill badge top-left
- Tags overlaid bottom-left above the title
- Title in large bold text
- "Read the breakdown →" link
- **Glowing border** on hover: animated gradient that travels around the border (CSS `conic-gradient` animation)
- `aspect-[16/10]` on desktop

### 4C. Stats/Numbers (`StatsCounter`)

Single card container. Inside: 2x2 grid of stat items.

Each stat item:
- Large number with **animated count-up** (counts from 0 to value over 1s when scrolled into view, using framer-motion `useInView` + `useMotionValue`)
- Small label below
- Colored accent per stat (blue, emerald, amber, purple - kept)
- No icon boxes, no sub-labels. Just number + label.

Bottom: "View experience →" link.

### 4D. Radar Section

Same pill-tag interaction but styled tighter:
- Tags in a `flex-wrap` with `gap-2` (down from `gap-3`)
- Each pill: `px-3 py-1.5` (down from `px-5 py-3`)
- On hover: subtle glow effect
- On click: tooltip-style popover below the pill with commentary (instead of expanding the pill to full width)

### 4E. Secondary Article Cards

Compact cards with:
- Tiny thumbnail (48x48 rounded square) from article image
- Title (text-sm, 2-line clamp)
- Accent-colored top border (3px)
- Hover: card lifts + glowing accent border
- No tags, no hook text, no "Read the breakdown" link

### 4F. Elevated Card Base (Light Mode)

In light mode, glassmorphism is replaced with **elevated cards** using soft shadows and subtle teal-tinted borders:

```css
.elevated-card {
  background: var(--card);                        /* #f2f7f7 */
  border: 1px solid var(--border);                /* #cde0e2 */
  border-radius: 1rem;
  box-shadow: 0 1px 3px var(--shadow-color);      /* soft teal shadow */
}

.elevated-card:hover {
  border-color: var(--primary);                   /* #06858e */
  box-shadow:
    0 4px 12px hsl(185 70% 30% / 0.1),
    0 0 0 1px var(--primary);                     /* teal ring on hover */
}
```

The effect is clean and airy. Cards feel "lifted" off the background instead of "glowing in the dark". The teal border highlight on hover provides the premium interactive feel.

### 4G. BlurFade Animation Component

Custom component wrapping framer-motion:
- Props: `delay`, `duration`, `blur` (default 6px), `yOffset` (default 6px)
- On mount: element starts at `opacity: 0, filter: blur(6px), y: 6px`
- Animates to: `opacity: 1, filter: blur(0), y: 0`
- Uses `useInView` for scroll-triggered reveal

### 4H. TextShimmer Component

Custom component using CSS animations:
- Background gradient: `linear-gradient(90deg, base-color, shimmer-color, base-color)`
- `background-size: 200% 100%`
- Animate `background-position` from `100%` to `0%`
- Apply with `background-clip: text; -webkit-text-fill-color: transparent`
- Shimmer color: `#06858e` (primary teal). Base color: `#427a7e` (muted foreground teal)

### 4I. AnimatedCounter Component

- Uses framer-motion `useMotionValue` + `useTransform` + `animate`
- On `useInView`: animates from 0 to target number over 1s with spring easing
- Supports suffix ("+", "%") rendered statically after the animated number
- Number displays as integer (rounded during animation)

---

## 5. New Dependencies

| Package | Purpose | Bundle impact |
|---------|---------|---------------|
| `framer-motion` | BlurFade, AnimatedCounter, stagger animations | ~30kb gzipped (tree-shakeable) |

We build TextShimmer and the gradient transition with pure CSS. No additional libraries needed for those.

The Spline component from the user's earlier message is deferred. When ready, install `@splinetool/react-spline` and `@splinetool/runtime`.

---

## 6. Files Changed

| File | Change |
|------|--------|
### Core changes (landing page rebuild)
| File | Change |
|------|--------|
| `app/globals.css` | Full rewrite: new shadcn token system (light+dark), remove brand-* tokens, add animation keyframes, add elevated-card utility, update scrollbar/selection colors |
| `app/page.tsx` | Complete rewrite to bento grid layout |
| `app/layout.tsx` | Add Source Code Pro font, remove `class="dark"` if present, wrap children with BrandMoment |
| `components/Greeting.tsx` | Rewrite as `HeroBento.tsx` with gradient bg + shimmer + blur-fade |
| `components/StatsGrid.tsx` | Rewrite as compact animated counter grid |
| `components/RadarSection.tsx` | Tighten layout, tooltip popover instead of expand |
| `components/ArticleCard.tsx` | Add featured variant with image overlay + hover ring |

### New components
| File | Purpose |
|------|---------|
| `components/BlurFade.tsx` | Framer-motion blur-fade entrance wrapper |
| `components/TextShimmer.tsx` | CSS gradient shimmer text effect |
| `components/AnimatedCounter.tsx` | Count-up number animation |
| `components/BrandMoment.tsx` | Loading gradient overlay |

### Token migration (brand-* → shadcn)
Every component that uses `brand-dark`, `brand-card`, `brand-border`, `brand-accent`, `brand-white`, `brand-muted`, or `brand-glow` must be updated:

| File | Token changes |
|------|--------------|
| `components/Terminal.tsx` | Hardcoded `bg-[#060e1a]` → `bg-foreground/5`, `text-green-400` → `text-primary`, all `brand-*` → new tokens |
| `components/Sidebar.tsx` | `bg-brand-dark` → `bg-sidebar`, `border-brand-border` → `border-sidebar-border`, all `brand-*` refs |
| `components/Nav.tsx` | `brand-accent` → `primary`, `brand-muted` → `muted-foreground`, `brand-white` → `foreground`, `brand-card` → `accent` |
| `components/NavIcon.tsx` | Any `brand-*` color refs |
| `components/Footer.tsx` | `brand-border` → `border`, `brand-dark` → `background`, `brand-muted` → `muted-foreground` |
| `components/Pipeline.tsx` | All `brand-*` refs |
| `components/PhaseCard.tsx` | All `brand-*` refs |
| `components/BeliefCard.tsx` | All `brand-*` refs |
| `components/ContactForm.tsx` | All `brand-*` refs |
| `components/RoleTimeline.tsx` | All `brand-*` refs |
| `components/ProjectCard.tsx` | All `brand-*` refs |
| `app/about/page.tsx` | All `brand-*` refs |
| `app/approach/page.tsx` | All `brand-*` refs |
| `app/contact/page.tsx` | All `brand-*` refs |
| `app/experience/page.tsx` | All `brand-*` refs |
| `app/workshop/page.tsx` | All `brand-*` refs |
| `app/shettys-desk/page.tsx` | All `brand-*` refs |
| `app/articles/page.tsx` | All `brand-*` refs (if exists) |
| `app/articles/[slug]/page.tsx` | All `brand-*` refs (if exists) |

---

## 7. Risks

- **Framer-motion bundle size**: Tree-shaking should limit this. Only import `motion`, `useInView`, `useMotionValue`, `useTransform`, `animate`.
- **Glassmorphism on older browsers**: `backdrop-filter` has 96%+ support. Acceptable.
- **Above-the-fold constraint**: May need to tune paddings per breakpoint to fit everything. The hero `max-h-[180px]` might need adjustment.
- **Theme change breaks existing pages**: All pages currently use `brand-*` tokens. Every reference must be migrated to the new shadcn token names. Manual review needed for any hardcoded hex values.
- **Light mode readability**: The current site was designed for dark backgrounds. Some components (Terminal, sidebar brand icon) use dark-specific styling (hardcoded dark hex values, light text assumptions). These need per-component review.
- **Article card images**: Images designed for dark backgrounds may look different on the light `#e8f0f0` background. May need subtle drop shadows to ground them.
