# V5 Polish Upgrade — Design Spec

**Date:** 2026-03-15
**Benchmark:** carmen-elena.space
**Branch:** main (no feature branch — changes are incremental polish)
**Deploy:** NO deployment until Tiger approves locally via `npm run dev`

---

## Overview

A 3-phase visual upgrade to close the gap between Shetty's Desk and world-class personal portfolio sites. The site structure is solid. These changes target visual polish, micro-interactions, content density, and decorative depth.

---

## Phase 1 — Global Polish

These changes affect every page through shared components and global styles.

### 1.1 Footer Marquee Spacing

**File:** `components/Footer.tsx`, `app/globals.css`

Current: Dot separators use `mx-6` (24px each side) on both text items and dot spans.
Change: Reduce horizontal margin around the `●` dot separator from `mx-6` to `mx-2` (8px each side). Keep `mx-6` on the text items. Keep animation speed, text content, and opacity the same.

### 1.2 Content Max-Width + Generous Margins

**File:** `app/layout.tsx`

Current: Main content area uses `px-6` mobile / `lg:pr-12` desktop.
Change: Add `max-w-5xl` (1024px) to the inner content wrapper. Increase desktop padding to `lg:px-16` for generous left/right breathing room. Content should feel centered within the main area, not pushed against edges.

### 1.3 Smooth Content-Area Page Transitions

**File:** New component `components/PageTransition.tsx`, modify `app/layout.tsx`

Create a framer-motion `AnimatePresence` wrapper for page content. On route change:
- Exit: opacity 0, y +8, duration 150ms
- Enter: opacity 1, y 0, duration 250ms, delay 100ms

Use `usePathname()` as the motion key. Wrap the `{children}` in layout.tsx with this component. The sidebar stays fixed and does not animate.

**Important:** `PageTransition.tsx` must be a `"use client"` component. It receives `children` as a React.ReactNode prop. Do not move other layout elements (Sidebar, Footer, BrandMoment) inside it. The server/client boundary stays clean: layout.tsx remains a server component that passes children through the client PageTransition wrapper.

### 1.4 Section Spacing

**File:** All page files (`app/*/page.tsx`)

Current: Mixed spacing (`mt-12`, `mt-16`, `gap-8`).
Change: Standardize all top-level section gaps to `mt-24` (96px) minimum, `mt-28` (112px) for major section breaks. Use `space-y-24` or explicit margins. Mobile can compress to `mt-16`.

### 1.5 BlurFade on All Sections

**File:** All page files

Current: BlurFade exists but not applied consistently.
Change: Wrap every top-level section in `<BlurFade>` with staggered delays (0, 0.1, 0.2, 0.3...). Every heading, every card grid, every content block should fade in on scroll.

### 1.6 Consistent Hover States

**File:** `app/globals.css` (add utility class)

Add a `.card-hover` utility class:
```css
.card-hover {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}
```

Apply to: ArticleCard, BeliefCard, StatsGrid stat boxes, ProjectCard, "Working with me" cards, experience role cards.

### 1.7 Dark Accent Blocks

**Strategy:** Use 2-3 dark-bg sections per page for visual rhythm. Two options:
- **High contrast:** `bg-foreground` (black in light mode) with `text-background` (white text)
- **Softer teal contrast:** `bg-secondary` (#14b8a6 teal) with white text

Note: `bg-primary` is indigo (#4f46e5), not teal. Use `bg-secondary` for teal accent blocks.

Specific placements:
- **About:** Personal note section → dark teal card
- **Experience:** Summary card → dark-bg sticky sidebar
- **Contact:** Email footer → dark block with large email + LinkedIn CTA
- **Home:** Could add a dark "featured" banner, but current dark article card already serves this

### 1.8 Subtle Icons on Section Headings

**Dependency:** `lucide-react` (already installed via shadcn pattern)

Add small (16-20px) Lucide icons before section headings:
- "Latest articles" → `Newspaper`
- "My numbers" → `BarChart3`
- "Supply Chain Radar" → `Radar`
- "Working with me" → `Handshake`
- "The journey so far" → `Route`
- "What I believe" → `Lightbulb`
- "On Rotation" → `Disc3`
- "My Library" → `BookOpen`

Style: `text-muted-foreground` opacity, inline with heading text, `mr-2`.

---

## Phase 2 — Page-Level Upgrades

### 2.1 Home — Varied Stat Visualizations

**File:** `components/StatsGrid.tsx`

Current: All 4 stats use the same CountUp + small visual pattern.
Change: Each stat gets a unique visualization type:

1. **7+ years** → Horizontal dot timeline (already exists as DotTimeline, keep but refine). Dots from 2019 to Now, filled dots for elapsed years.
2. **5 articles** → Stacked mini bar chart. 5 tiny vertical bars at different heights representing article impressions, colored by article accent.
3. **47% T&L** → Semi-circular gauge/arc. Fill 47% of arc with chart-3 color.
4. **38% Senior** → Circular donut ring. 38% filled segment with chart-4 color.

Each visualization sits below the large number. Size: ~48px tall max. Keep the existing icon, number, label, and sublabel layout.

### 2.2 Home — Glassmorphism Decorative Shapes

**File:** New component `components/FloatingShapes.tsx`

3-4 absolutely positioned decorative elements on the homepage:
- **Glass orb** (top-right of hero area): 120px circle, `backdrop-blur-xl`, `bg-secondary/5`, `border border-white/20`, subtle float animation (translateY ±8px, 6s infinite)
- **Gradient blob** (bottom-left of stats area): 80px rounded, `bg-gradient-to-br from-chart-1/10 to-chart-3/10`, blur-2xl, slow scale pulse
- **Small accent dot** (near radar): 32px circle, `bg-accent/20`, orbit animation

All elements: `pointer-events-none`, `z-0`, `absolute`. Parent sections need `relative overflow-hidden`.

### 2.3 About — Interactive "Working With Me" Cards

**File:** `app/about/page.tsx` (refactor inline section into component or enhance inline)

Current: 4 plain text items with titles and descriptions.
Change: Convert to tap/click-to-expand cards with icons:

| Title | Icon (Lucide) | Color |
|-------|--------------|-------|
| I default to structure | `LayoutGrid` | chart-1 |
| I lead with questions | `MessageCircleQuestionMark` | chart-2 |
| I write to think | `PenLine` | chart-3 |
| I value directness | `Target` | chart-4 |

Card behavior:
- Default: Show icon + title only, colored left border (4px, card's color)
- Hover: card-hover lift effect
- Click: Expand to show description text with AnimatePresence height transition
- Only one card expanded at a time (accordion behavior)

### 2.4 About — Library / Bookshelf Section

**File:** New data file `data/books.json`, modify `app/about/page.tsx`

New section: "My Library" between "On Rotation" and "What I believe".

Data structure (`data/books.json`):
```json
[
  {
    "title": "The Goal",
    "author": "Eliyahu M. Goldratt",
    "cover": "/images/books/the-goal.jpg",
    "status": "read",
    "note": "The book that made me think about bottlenecks differently."
  },
  {
    "title": "Thinking in Systems",
    "author": "Donella H. Meadows",
    "cover": "/images/books/thinking-in-systems.jpg",
    "status": "reading",
    "note": "Currently working through this. Systems dynamics applied to everything."
  }
]
```

Fields: title, author, cover (image path or null for placeholder), status ("read" | "reading" | "want-to-read"), note (one-line personal take).

Display: Horizontal scroll row of book cards. Each card: cover image (2:3 ratio, 120x180px), title, author, status badge. On hover: show the personal note in a tooltip or expandable area. Status badge colors: read=chart-1, reading=accent, want-to-read=muted.

Start with 5-8 placeholder books. Tiger will replace with real selections. When `cover` is `null`, render a placeholder with `BookOpen` icon on a muted background. No `/public/images/books/` directory exists yet. Create it, but placeholder books should use `cover: null` to avoid broken image paths.

### 2.5 About — On Rotation (Spotify Placeholder)

**File:** `app/about/page.tsx`, new data file `data/rotation.json`

Current: Hardcoded 3-column section (Reading, Listening, Watching) in `onRotation` const.
Change: Move data to `data/rotation.json`. **Important:** The existing rotation reading list includes "The Goal" by Goldratt. Since this book will also appear in `data/books.json` (section 2.4), remove it from `rotation.json` reading list to avoid duplication. The rotation "reading" category should contain short-form content (articles, newsletters, threads), while books live in the library section.

Structure:

```json
{
  "listening": [
    {
      "title": "Supply Chain Now",
      "subtitle": "Podcast",
      "cover": null,
      "url": null
    }
  ],
  "reading": [...],
  "watching": [...]
}
```

Add a "Spotify" subsection with placeholder cards styled like Spotify embeds (dark bg, green accent, album-art sized squares). When Tiger provides Spotify API credentials later, these will be replaced with live data. For now, 3 static placeholder tracks with null covers showing a music note icon.

### 2.6 About — Profile Photo Container Frame

**File:** `app/about/page.tsx` (OrbitingSkills area or standalone)

Current: Profile photo exists but sits in a plain container.
Change: Wrap in a styled frame:
- Outer: rounded-2xl, p-1, gradient border (from-primary/30 to-accent/30)
- Inner: rounded-xl, overflow-hidden, ring-2 ring-white shadow-xl
- Subtle glow: `shadow-primary/20` behind the frame

### 2.7 Experience — Company Logos + Timeline Dots

**File:** `app/experience/page.tsx` (modify directly — the `ExperienceTimeline.tsx` component is not currently used on this page. The experience page uses `FlowingMenu` for Tetra Pak roles and bare divs for earlier roles.)

**Company logos:** Add logo images for each company. Store in `/images/companies/`. For MVP, use colored circle placeholders with company initials if images aren't available:
- Tetra Pak: Use the real logo or "TP" in a blue circle
- Citadel: "CI" in a dark circle
- Earlier roles: initials in muted circles

**Vertical timeline:** Add a vertical line (2px, border-border color) connecting all role entries. Each entry gets a small circle dot (8px, filled with chart-1 for current, border-only for past) positioned on the line.

Layout: Timeline line at left edge, dots on the line, cards to the right of the line.

### 2.8 Experience — Dark Tinted Sticky Summary Card

**File:** `app/experience/page.tsx`

Current: Summary paragraph at top, then roles below.
Change: Two-column layout on desktop:
- **Left column (sticky):** Dark-bg card (`bg-foreground text-background`), rounded-2xl, p-8. Contains:
  - "Quick Summary" heading
  - The existing summary text (italicized)
  - Key stats: "7+ years", "6 roles at Tetra Pak", "4 languages"
  - `position: sticky; top: 2rem;`
- **Right column:** Timeline with role cards (scrolls independently)

Mobile: Summary card at top (not sticky), timeline below.

### 2.9 Experience — View Resume Button

**File:** `app/experience/page.tsx`

Add a button top-right of the page heading:
- Text: "View Resume" with `FileDown` icon
- Style: outline button, border-border, hover:bg-card
- Links to `/Profile.pdf`
- Opens in new tab
- **Prerequisite:** Move `Profile.pdf` from project root into `/public/Profile.pdf` so Next.js serves it as a static asset. The file currently lives at project root and will 404 in production.

### 2.10 Contact — Large Gradient Status Blocks

**File:** `app/contact/page.tsx`

Current: 3 small pills ("<24h Response", "Open to Speaking", "Yes, Coffee Chats").
Change: 3 large cards in a row, each ~200px tall:

| Label | Icon | Background |
|-------|------|-----------|
| <24h Response Time | `Zap` | bg-secondary text-white |
| Open to Speaking | `Mic` | bg-chart-2 text-white |
| Yes, Coffee Chats | `Coffee` | bg-accent text-foreground |

Each card: rounded-2xl, centered icon (32px) + large text + subtitle. Full-width on mobile (stacked). Hover: slight scale(1.02).

### 2.11 Contact — Community / Social Proof Block

**File:** `app/contact/page.tsx`

New section below the form. A dark-bg card showing LinkedIn presence:
- Heading: "Join the conversation" or "Connect on LinkedIn"
- Stats: follower count (placeholder), recent post engagement numbers (import `data/articles.json` and sum `stats.impressions` and `stats.reactions` at build time)
- "Connect on LinkedIn" CTA button (links to linkedin.com/in/shettys-desk)
- Style: bg-foreground text-background, rounded-2xl

### 2.12 Contact — Dark Email Footer + Form Polish

**File:** `app/contact/page.tsx`

Current: "Or reach out directly" with plain text email and LinkedIn.
Change: Dark-bg block at page bottom:
- `bg-foreground text-background rounded-2xl p-8`
- Large email: `poornajithshetty@gmail.com` in text-lg font-mono
- LinkedIn button: outline style with white border
- Layout: two-column (email left, LinkedIn right) on desktop

Form gap: Increase spacing between form fields to `space-y-6` (currently likely space-y-4).

### 2.13 Approach — Visual Gantt Timeline

**File:** `app/approach/page.tsx`, potentially new component `components/GanttTimeline.tsx`

Current: 6 phases as PhaseCard grid with Pipeline component.
Change: Add a Gantt-style horizontal timeline above the phase cards:

```
Week:  1    2    3    4    5    6    7    8
       |████████|         |              |
       Curiosity          |              |
            |█████████████|              |
            Research & Synthesis          |
                     |███████████████████|
                     Visualize & Publish
```

Implementation: CSS Grid or flex layout. Each phase bar is a colored div positioned by grid-column-start/end. Colors match existing phase accent colors. Responsive: on mobile, show as a vertical stacked list with duration labels.

Keep existing PhaseCard grid below the Gantt as the detail view.

### 2.14 Workshop — Lab-Style Upgrades

**File:** `app/workshop/page.tsx`, `data/projects.json`

Add to project data (use existing title-case format to match current filter logic):
- `status`: "Finished" | "In Progress" | "Planned" (matches existing casing in workshop page filters)
- `category`: "Tool" | "Content" | "Experiment"

**Important:** The existing `workshop/page.tsx` filters on `p.status === "Finished"` and `p.status === "In Progress"` (title case). New status values must match this casing. Add `"Planned"` as a new option.

Display changes:
- **Status indicators:** Colored dots (green=finished, amber=in-progress, gray=planned) with label text
- **Category tabs:** Filter tabs at top: "All", "Tools", "Content", "Experiments"
- **Progress counters:** Summary row: "3 Finished · 4 In Progress · 8 Total" (like Carmen's Lab)

---

## Phase 3 — Decorative Layer

### 3.1 Floating Glassmorphism Shapes

**File:** `components/FloatingShapes.tsx` (created in 2.2)

Extend to other pages beyond home:
- **About page:** Small glass circle near the orbiting skills section
- **Experience page:** Gradient blob behind the summary card
- **Contact page:** Glass shape near the form area

All: `pointer-events-none`, `z-0`, subtle float animations with different durations (5-8s) to avoid synchronized movement.

### 3.2 Accent-Colored Background Plates Behind Article Cards

**File:** `components/ArticleCard.tsx`

Current: Article images sit in plain containers.
Change: Add a colored background plate behind each article card image:
- Plate: 8px larger than image on each side, rotated 2-3deg, colored with the article's accent color at 15% opacity
- Creates a "shadow/frame" effect behind the image
- Only on `featured` and `default` variants (not bento compact)

### 3.3 3D Glass Orbs

**File:** Part of `FloatingShapes.tsx`

Add 2-3 CSS-only 3D glass sphere elements:
- Radial gradient (white highlight top-left, transparent center, dark edge bottom-right)
- Backdrop-blur for glass effect
- Positioned at page transitions (between major sections on home)
- Size: 60-100px diameter
- Opacity: 30-40% so they don't dominate

---

## New Data Files

| File | Purpose | Content |
|------|---------|---------|
| `data/books.json` | Bookshelf/library section | 5-8 placeholder books with title, author, cover, status, note |
| `data/rotation.json` | On Rotation section data | 3 categories (listening, reading, watching) with placeholder items |

## New Components

| Component | Purpose |
|-----------|---------|
| `components/PageTransition.tsx` | Framer-motion content-area page transition wrapper |
| `components/FloatingShapes.tsx` | Decorative glassmorphism shapes, reused across pages |
| `components/GanttTimeline.tsx` | Horizontal Gantt chart for Approach page |
| `components/BookCard.tsx` | Individual book card for library section |
| `components/SpotifyPlaceholder.tsx` | Placeholder Spotify "now playing" cards |

## Modified Components

| Component | Changes |
|-----------|---------|
| `Footer.tsx` | Reduce dot-text spacing |
| `StatsGrid.tsx` | Unique visualization per stat (bars, gauge, donut, dots) |
| `ArticleCard.tsx` | Accent-colored bg plate behind images |
| `app/experience/page.tsx` | Company logos, vertical timeline dots (ExperienceTimeline.tsx is unused on this page) |
| `ContactForm.tsx` | Increase field spacing |

## Modified Pages

| Page | Changes |
|------|---------|
| `app/layout.tsx` | Max-width, margins, PageTransition wrapper |
| `app/page.tsx` | Section spacing, BlurFade, FloatingShapes |
| `app/about/page.tsx` | Interactive working-with-me cards, library, rotation data, profile frame, icons |
| `app/experience/page.tsx` | Two-col layout, sticky summary, View Resume button, icons |
| `app/contact/page.tsx` | Status blocks, community block, dark email footer, icons |
| `app/approach/page.tsx` | GanttTimeline, section spacing, icons |
| `app/workshop/page.tsx` | Status indicators, category tabs, counters, icons |
| `app/globals.css` | .card-hover class, any new animation keyframes |

## Non-Goals

- No Spotify API integration (placeholder only)
- No deployment (local approval first)
- No new pages
- No changes to sidebar or terminal
- No changes to article detail pages
- No dark mode changes
