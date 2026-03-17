# V5 Polish Upgrade Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the visual gap with world-class portfolio sites through global polish, page-level upgrades, and decorative depth layers.

**Architecture:** Incremental component modifications and new components layered onto the existing Next.js 16 + Tailwind v4 + framer-motion stack. No structural rewrites. All changes land on `main` as a single commit. Local preview required before deploy.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, framer-motion, lucide-react

**Spec:** `docs/superpowers/specs/2026-03-15-v5-polish-upgrade-design.md`

**Deploy rules:**
- NO deployment until Tiger approves via local `npm run dev`
- All changes committed as a single commit to `main`
- Commit message: `feat: v5 polish upgrade — visual overhaul benchmarked against carmen-elena.space`

---

## Chunk 1: Global Polish (Phase 1)

### Task 1: Footer Marquee Spacing

**Files:**
- Modify: `components/Footer.tsx:23`

- [ ] **Step 1: Reduce dot separator margin**

Change line 23 from `mx-6` to `mx-2` on the dot span only. The text items on line 22 keep `mx-6`.

```tsx
// Line 23: Change from
<span className="mx-6">●</span>
// To
<span className="mx-2">●</span>
```

- [ ] **Step 2: Verify locally**

Run: `npm run dev`
Check: Footer marquee dots should be closer to text (8px gap vs 24px before). Text items keep their spacing.

---

### Task 2: Content Max-Width + Generous Margins

**Files:**
- Modify: `app/layout.tsx:52`

- [ ] **Step 1: Update main content wrapper**

Change line 52 from:
```tsx
<div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-16 pb-8 lg:pl-[calc(16rem+2rem)] lg:pr-12 lg:pt-10 lg:pb-10">
```
To:
```tsx
<div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-16 pb-8 lg:pl-[calc(16rem+2rem)] lg:pr-16 lg:pt-10 lg:pb-10">
  <div className="max-w-5xl mx-auto">
```

- [ ] **Step 2: Close the new inner div**

Change line 54 (the closing `</div>` after `{children}`) — add an extra closing div:
```tsx
            {children}
          </div>
        </div>
```

So the structure becomes:
```tsx
<div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pt-16 pb-8 lg:pl-[calc(16rem+2rem)] lg:pr-16 lg:pt-10 lg:pb-10">
  <div className="max-w-5xl mx-auto">
    {children}
  </div>
</div>
```

- [ ] **Step 3: Verify locally**

Run: `npm run dev`
Check: Content should be centered within the main area with generous margins on wide screens. On narrow screens, unchanged.

---

### Task 3: Page Transition Component

**Files:**
- Create: `components/PageTransition.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create PageTransition component**

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={{
          hidden: { opacity: 0, y: 8 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.25, delay: 0.1 } },
          exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Wrap children in layout.tsx**

In `app/layout.tsx`, add import at top:
```tsx
import PageTransition from "@/components/PageTransition";
```

Wrap the `{children}` inside the max-w-5xl div:
```tsx
<div className="max-w-5xl mx-auto">
  <PageTransition>
    {children}
  </PageTransition>
</div>
```

- [ ] **Step 3: Verify locally**

Run: `npm run dev`
Check: Navigate between pages. Content should fade in/out smoothly. Sidebar stays fixed.

---

### Task 4: Global CSS — Hover States + Float Animation

**Files:**
- Modify: `app/globals.css` (append before the closing of the file)

- [ ] **Step 1: Add card-hover utility and float animation**

Append to `app/globals.css` before the end:

```css
/* Card hover effect */
.card-hover {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

/* Float animation for decorative elements */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-6px) scale(1.02); }
}

@keyframes float-orbit {
  0% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-4px) translateX(4px); }
  50% { transform: translateY(0px) translateX(8px); }
  75% { transform: translateY(4px) translateX(4px); }
  100% { transform: translateY(0px) translateX(0px); }
}
```

- [ ] **Step 2: Add float animation references to @theme inline**

In `app/globals.css`, inside the `@theme inline { ... }` block (after line 138), add:

```css
  --animate-float: float 6s ease-in-out infinite;
  --animate-float-slow: float-slow 8s ease-in-out infinite;
  --animate-float-orbit: float-orbit 7s ease-in-out infinite;
```

---

### Task 5: Section Spacing + BlurFade on Home Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update section spacing on homepage**

In `app/page.tsx`, find all section gaps and update to `mt-24` minimum. The homepage uses a bento grid, so update the gap between the hero area and subsequent sections. Also ensure all sections are wrapped in `<BlurFade>`.

Key changes:
- Any `mt-12` or `mt-16` between top-level sections → `mt-24`
- Any `gap-8` on section containers → `gap-12` or individual `mt-24`
- Wrap any unwrapped sections in `<BlurFade delay={N * 0.1}>`

- [ ] **Step 2: Verify locally**

Check: Sections should have generous 96px+ gaps. All content fades in on scroll.

---

### Task 6: Section Spacing + BlurFade on About Page

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Update section spacing**

Find all top-level section dividers and change to `mt-24` minimum. Ensure every section is wrapped in `<BlurFade>` with staggered delays.

---

### Task 7: Section Spacing + BlurFade on Experience, Contact, Approach, Workshop Pages

**Files:**
- Modify: `app/experience/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/approach/page.tsx`
- Modify: `app/workshop/page.tsx`

- [ ] **Step 1: Update all four pages**

Same pattern as Tasks 5-6: `mt-24` between sections, BlurFade wrappers with staggered delays. Import BlurFade where not already imported.

---

### Task 8: Subtle Icons on Section Headings

**Files:**
- Modify: `app/page.tsx` (home)
- Modify: `app/about/page.tsx`
- Modify: `app/experience/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/approach/page.tsx`
- Modify: `app/workshop/page.tsx`

- [ ] **Step 1: Add Lucide icon imports and place icons before headings**

For each page, import the relevant Lucide icons and place them inline before section headings:

```tsx
import { Newspaper, BarChart3, Radar } from "lucide-react";

// Before heading text:
<h2 className="...">
  <Newspaper className="inline w-5 h-5 mr-2 text-muted-foreground" />
  Latest articles
</h2>
```

Icon mapping:
- Home: `Newspaper` (Latest articles), `BarChart3` (My numbers), `Radar` (Supply Chain Radar)
- About: `Handshake` (Working with me), `Lightbulb` (What I believe), `Disc3` (On Rotation), `BookOpen` (My Library)
- Experience: `Route` (heading/journey), `FileDown` (View Resume)
- Contact: `MessageSquare` or `Mail` (heading)
- Approach: `GitBranch` (heading)
- Workshop: `Wrench` (heading)

Style: `inline w-5 h-5 mr-2 text-muted-foreground`

---

## Chunk 2: Home Page Upgrades (Phase 2)

### Task 9: Varied Stat Visualizations

**Files:**
- Modify: `components/StatsGrid.tsx`

- [ ] **Step 1: Add mini bar chart visualization for "5 articles" stat**

Replace the `ArticleDots` component with a `MiniBarChart`:

```tsx
function MiniBarChart() {
  // 5 bars representing article impressions (normalized)
  const bars = [
    { height: 90, color: "bg-chart-1" },   // Maersk 55K
    { height: 40, color: "bg-chart-2" },   // Zara 731
    { height: 35, color: "bg-chart-3" },   // Nike 565
    { height: 25, color: "bg-chart-4" },   // Dabbawalas 335
    { height: 20, color: "bg-chart-5" },   // US-Iran 241
  ];
  return (
    <div className="flex items-end gap-1 h-10">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className={`w-2 rounded-t-sm ${bar.color}`}
          initial={{ height: 0 }}
          whileInView={{ height: `${bar.height}%` }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          viewport={{ once: true }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Add semi-circular gauge for "47% T&L" stat**

```tsx
function SemiGauge({ percent, color }: { percent: number; color: string }) {
  const radius = 18;
  const circumference = Math.PI * radius; // half circle
  const filled = (percent / 100) * circumference;

  return (
    <svg width="48" height="28" viewBox="0 0 48 28">
      <path
        d="M 4 24 A 18 18 0 0 1 44 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-border/20"
      />
      <motion.path
        d="M 4 24 A 18 18 0 0 1 44 24"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        whileInView={{ strokeDashoffset: circumference - filled }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      />
    </svg>
  );
}
```

- [ ] **Step 3: Add circular donut ring for "38% Senior" stat**

```tsx
function DonutRing({ percent, color }: { percent: number; color: string }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;

  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle
        cx="20" cy="20" r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-border/20"
      />
      <motion.circle
        cx="20" cy="20" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        whileInView={{ strokeDashoffset: circumference - filled }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        transform="rotate(-90 20 20)"
      />
    </svg>
  );
}
```

- [ ] **Step 4: Wire up the new visualizations in the stats grid**

Replace the existing visualization rendering to use the correct component per stat:
- Stat 0 (years): Keep existing `DotTimeline`
- Stat 1 (articles): Use `MiniBarChart`
- Stat 2 (47% T&L): Use `<SemiGauge percent={47} color="var(--chart-3)" />`
- Stat 3 (38% Senior): Use `<DonutRing percent={38} color="var(--chart-4)" />`

- [ ] **Step 5: Add card-hover class to stat boxes**

Add `card-hover` class to each stat card container.

- [ ] **Step 6: Verify locally**

Check: Each stat should have a unique animated visualization. Hover lifts cards.

---

### Task 10: Floating Glassmorphism Shapes

**Files:**
- Create: `components/FloatingShapes.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create FloatingShapes component**

```tsx
"use client";

export function GlassOrb({
  size = 120,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full backdrop-blur-xl bg-secondary/5 border border-white/20 animate-float ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function GradientBlob({
  size = 80,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full bg-gradient-to-br from-chart-1/10 to-chart-3/10 blur-2xl animate-float-slow ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function AccentDot({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full bg-accent/20 animate-float-orbit ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function GlassOrb3D({
  size = 80,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full opacity-30 animate-float ${className}`}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 50%, rgba(0,0,0,0.1) 100%)",
        backdropFilter: "blur(8px)",
      }}
    />
  );
}
```

- [ ] **Step 2: Add shapes to homepage**

In `app/page.tsx`, import and place shapes in sections that have `relative overflow-hidden`:

```tsx
import { GlassOrb, GradientBlob, AccentDot } from "@/components/FloatingShapes";

// In hero section wrapper, add:
<GlassOrb size={120} className="top-8 right-8 z-0" />

// Near stats section:
<GradientBlob size={80} className="bottom-4 left-4 z-0" />

// Near radar:
<AccentDot size={32} className="top-12 right-16 z-0" />
```

Ensure parent sections have `relative overflow-hidden`.

- [ ] **Step 3: Verify locally**

Check: Subtle floating shapes visible on homepage. They don't interfere with content clicks.

---

### Task 11: Apply card-hover to Article Cards

**Files:**
- Modify: `components/ArticleCard.tsx`

- [ ] **Step 1: Add card-hover class to article card containers**

Find the outermost card div/Link for `default` and `featured` variants and add `card-hover` class.

---

## Chunk 3: About Page Upgrades (Phase 2)

### Task 12: Interactive "Working With Me" Cards

**Files:**
- Create: `components/WorkingWithMeCards.tsx`
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Create client component for interactive cards**

`app/about/page.tsx` is a server component. Do NOT add `"use client"` to it. Instead, create a new file `components/WorkingWithMeCards.tsx`:

```tsx
"use client";

import { LayoutGrid, MessageCircleQuestion, PenLine, Target } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type WorkingWithMeItem = { title: string; description: string; icon: string };

const icons = [LayoutGrid, MessageCircleQuestion, PenLine, Target];
const colors = ["chart-1", "chart-2", "chart-3", "chart-4"];

export default function WorkingWithMeCards({ items }: { items: WorkingWithMeItem[] }) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <div className="grid gap-3">
      {items.map((item, i) => {
        const Icon = icons[i];
        const color = colors[i];
        const isExpanded = expandedCard === i;
        return (
          <div
            key={i}
            className="card-hover bg-card rounded-xl p-4 cursor-pointer border-l-4"
            style={{ borderLeftColor: `var(--${color})` }}
            onClick={() => setExpandedCard(isExpanded ? null : i)}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" style={{ color: `var(--${color})` }} />
              <span className="font-medium">{item.title}</span>
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 text-sm text-muted-foreground pl-8">
                    {item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Use the component in about page**

In `app/about/page.tsx` (server component), import and use:
```tsx
import WorkingWithMeCards from "@/components/WorkingWithMeCards";

// Replace the existing workingWithMe rendering with:
<WorkingWithMeCards items={workingWithMe} />
```

- [ ] **Step 3: Verify locally**

Check: Cards show icon + title. Click expands one at a time. Colored left border per card.

---

### Task 13: Create Books Data + BookCard Component

**Files:**
- Create: `data/books.json`
- Create: `components/BookCard.tsx`

- [ ] **Step 1: Create placeholder books data**

```json
[
  {
    "title": "The Goal",
    "author": "Eliyahu M. Goldratt",
    "cover": null,
    "status": "read",
    "note": "The book that made me think about bottlenecks differently."
  },
  {
    "title": "Thinking in Systems",
    "author": "Donella H. Meadows",
    "cover": null,
    "status": "reading",
    "note": "Systems dynamics applied to everything."
  },
  {
    "title": "The Box",
    "author": "Marc Levinson",
    "cover": null,
    "status": "read",
    "note": "How the shipping container made the world smaller."
  },
  {
    "title": "Turn the Ship Around!",
    "author": "L. David Marquet",
    "cover": null,
    "status": "read",
    "note": "Leader-leader model. Changed how I think about teams."
  },
  {
    "title": "Supply Chain Management",
    "author": "Sunil Chopra",
    "cover": null,
    "status": "read",
    "note": "The textbook. Dense but foundational."
  },
  {
    "title": "Antifragile",
    "author": "Nassim Nicholas Taleb",
    "cover": null,
    "status": "want-to-read",
    "note": "On my list. Supply chains that gain from disorder."
  }
]
```

- [ ] **Step 2: Create BookCard component**

```tsx
"use client";

import { BookOpen } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

type Book = {
  title: string;
  author: string;
  cover: string | null;
  status: "read" | "reading" | "want-to-read";
  note: string;
};

const statusColors: Record<string, string> = {
  read: "bg-chart-1/15 text-chart-1",
  reading: "bg-accent/15 text-accent",
  "want-to-read": "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  read: "Read",
  reading: "Reading",
  "want-to-read": "Want to read",
};

export default function BookCard({ book }: { book: Book }) {
  const [showNote, setShowNote] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-36 card-hover cursor-pointer"
      onMouseEnter={() => setShowNote(true)}
      onMouseLeave={() => setShowNote(false)}
    >
      {/* Cover */}
      <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-card border border-border/50 flex items-center justify-center relative">
        {book.cover ? (
          <Image
            src={book.cover}
            alt={book.title}
            fill
            className="object-cover"
          />
        ) : (
          <BookOpen className="w-8 h-8 text-muted-foreground/30" />
        )}
        {/* Note tooltip on hover */}
        {showNote && (
          <div className="absolute inset-0 bg-foreground/80 text-background p-3 flex items-center text-xs leading-snug rounded-lg">
            {book.note}
          </div>
        )}
      </div>
      {/* Info */}
      <p className="mt-2 text-sm font-medium leading-tight truncate">
        {book.title}
      </p>
      <p className="text-xs text-muted-foreground truncate">{book.author}</p>
      <span
        className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${statusColors[book.status]}`}
      >
        {statusLabels[book.status]}
      </span>
    </div>
  );
}
```

---

### Task 14: Add Library Section to About Page

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Import books data and BookCard, add section**

```tsx
import booksData from "@/data/books.json";
import BookCard from "@/components/BookCard";
import { BookOpen } from "lucide-react";

// Add section between On Rotation and What I believe:
<BlurFade delay={0.5}>
  <section className="mt-24">
    <h2 className="text-2xl font-bold mb-6">
      <BookOpen className="inline w-5 h-5 mr-2 text-muted-foreground" />
      My Library
    </h2>
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
      {booksData.map((book, i) => (
        <BookCard key={i} book={book} />
      ))}
    </div>
  </section>
</BlurFade>
```

---

### Task 15: Move On Rotation Data to JSON + Spotify Placeholder

**Files:**
- Create: `data/rotation.json`
- Create: `components/SpotifyPlaceholder.tsx`
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Create rotation.json**

Move existing `onRotation` data from `app/about/page.tsx` to `data/rotation.json`. Remove "The Goal" from reading (it lives in books.json now).

```json
{
  "listening": [
    { "title": "Supply Chain Now", "subtitle": "Podcast", "cover": null, "url": null },
    { "title": "The Logistics of Logistics", "subtitle": "Podcast", "cover": null, "url": null }
  ],
  "reading": [
    { "title": "McKinsey on Supply Chain", "subtitle": "Newsletter", "cover": null, "url": null },
    { "title": "Flexport Research", "subtitle": "Newsletter", "cover": null, "url": null }
  ],
  "watching": [
    { "title": "Wendover Productions", "subtitle": "YouTube", "cover": null, "url": null },
    { "title": "Practical Engineering", "subtitle": "YouTube", "cover": null, "url": null }
  ]
}
```

- [ ] **Step 2: Create SpotifyPlaceholder component**

```tsx
import { Music } from "lucide-react";

export default function SpotifyPlaceholder() {
  const tracks = [
    { title: "Currently Playing", artist: "Connect Spotify to see live data" },
    { title: "Recent Track", artist: "Spotify integration coming soon" },
    { title: "On Repeat", artist: "Your top tracks will appear here" },
  ];

  return (
    <div className="space-y-2">
      {tracks.map((track, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-foreground/90 text-background rounded-lg p-3"
        >
          <div className="w-10 h-10 rounded bg-chart-5/20 flex items-center justify-center flex-shrink-0">
            <Music className="w-5 h-5 text-chart-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{track.title}</p>
            <p className="text-xs text-background/60 truncate">{track.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Update about page to use JSON data + Spotify placeholder**

Replace the hardcoded `onRotation` const with:
```tsx
import rotationData from "@/data/rotation.json";
import SpotifyPlaceholder from "@/components/SpotifyPlaceholder";
```

Add SpotifyPlaceholder in the Listening column below the existing items.

---

### Task 16: Profile Photo Container Frame

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Add framed profile photo to about page**

The about page currently has no `<Image>` for a profile photo. Add one near the top of the page (after the heading, before the first section). Import `Image` from `next/image` and add:

```tsx
import Image from "next/image";

// Place after the page heading, before the first content section:
<div className="flex justify-center mb-12">
  <div className="rounded-2xl p-1 bg-gradient-to-br from-primary/30 to-accent/30 inline-block">
    <div className="rounded-xl overflow-hidden ring-2 ring-white shadow-xl shadow-primary/20">
      <Image
        src="/images/profile.png"
        alt="Poornajith Shetty"
        width={200}
        height={200}
        className="rounded-xl"
      />
    </div>
  </div>
</div>
```

Note: The profile photo file must exist at `public/images/profile.png`. If it doesn't exist yet, use a placeholder or skip this task until Tiger provides the image.

---

## Chunk 4: Experience Page Upgrades (Phase 2)

### Task 17: Move Profile.pdf to Public

**Files:**
- Move: `Profile.pdf` → `public/Profile.pdf`

- [ ] **Step 1: Move file**

```bash
mv "/Users/tigershetty/Claude - Shettys Desk Site/Profile.pdf" "/Users/tigershetty/Claude - Shettys Desk Site/public/Profile.pdf"
```

---

### Task 18: Experience Page — Two-Column Layout + Sticky Summary + View Resume

**Files:**
- Modify: `app/experience/page.tsx`

- [ ] **Step 1: Add View Resume button beside heading**

```tsx
import { FileDown, Route } from "lucide-react";

// Replace heading area with flex row:
<div className="flex items-start justify-between">
  <div>
    <h1>...</h1> {/* existing heading */}
  </div>
  <a
    href="/Profile.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-card transition-colors text-sm"
  >
    <FileDown className="w-4 h-4" />
    View Resume
  </a>
</div>
```

- [ ] **Step 2: Create two-column layout with sticky summary**

Wrap the main content in a grid:

```tsx
<div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-8 mt-24">
  {/* Left: Sticky summary */}
  <div className="lg:sticky lg:top-8 lg:self-start mb-8 lg:mb-0">
    <div className="bg-foreground text-background rounded-2xl p-8">
      <h3 className="text-lg font-bold mb-4">Quick Summary</h3>
      <p className="text-sm text-background/80 italic leading-relaxed">
        {experienceData.summary}
      </p>
      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-background/60">Years</span>
          <span className="font-medium">7+</span>
        </div>
        <div className="flex justify-between">
          <span className="text-background/60">Roles at Tetra Pak</span>
          <span className="font-medium">6</span>
        </div>
        <div className="flex justify-between">
          <span className="text-background/60">Languages</span>
          <span className="font-medium">4</span>
        </div>
      </div>
    </div>
  </div>

  {/* Right: Timeline */}
  <div>
    {/* Existing timeline content moves here */}
  </div>
</div>
```

- [ ] **Step 3: Add vertical timeline dots + company logo placeholders**

For each role entry, add a timeline dot and company initial circle:

```tsx
{/* Timeline wrapper */}
<div className="relative pl-8">
  {/* Vertical line */}
  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />

  {roles.map((role, i) => (
    <div key={i} className="relative mb-6">
      {/* Timeline dot */}
      <div
        className={`absolute left-[-22px] top-4 w-3 h-3 rounded-full border-2 ${
          i === 0 ? "bg-chart-1 border-chart-1" : "bg-background border-border"
        }`}
      />
      {/* Company logo placeholder */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-chart-1/10 flex items-center justify-center text-xs font-bold text-chart-1">
          TP
        </div>
        <span className="font-semibold">{role.title}</span>
      </div>
      {/* Role card */}
      <div className="bg-card rounded-xl p-4 border border-border/50 card-hover">
        <p className="text-sm text-muted-foreground">{role.period} · {role.location}</p>
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 4: Verify locally**

Check: Two-column layout on desktop. Dark summary card sticks on scroll. Vertical timeline with dots connects roles. View Resume button opens PDF.

---

## Chunk 5: Contact Page Upgrades (Phase 2)

### Task 19: Large Gradient Status Blocks

**Files:**
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Replace status pills with large cards**

Replace the existing 3 small pills with:

```tsx
import { Zap, Mic, Coffee } from "lucide-react";

const statusBlocks = [
  { icon: Zap, label: "<24h", subtitle: "Response Time", bg: "bg-secondary", text: "text-white" },
  { icon: Mic, label: "Open", subtitle: "To Speaking", bg: "bg-chart-2", text: "text-white" },
  { icon: Coffee, label: "Yes", subtitle: "Coffee Chats", bg: "bg-accent", text: "text-foreground" },
];

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
  {statusBlocks.map((block, i) => {
    const Icon = block.icon;
    return (
      <div
        key={i}
        className={`${block.bg} ${block.text} rounded-2xl p-8 text-center card-hover hover:scale-[1.02] transition-transform`}
      >
        <Icon className="w-8 h-8 mx-auto mb-3" />
        <p className="text-3xl font-bold">{block.label}</p>
        <p className="text-sm opacity-80 mt-1">{block.subtitle}</p>
      </div>
    );
  })}
</div>
```

---

### Task 20: Community / Social Proof Block

**Files:**
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Add LinkedIn community block below form**

```tsx
import articlesData from "@/data/articles.json";
import { Linkedin } from "lucide-react";

// Compute aggregate stats at top of component or at module level:
const totalImpressions = articlesData.reduce((sum, a) => sum + (a.stats?.impressions || 0), 0);
const totalReactions = articlesData.reduce((sum, a) => sum + (a.stats?.reactions || 0), 0);

// In JSX, after the form section:
<BlurFade delay={0.4}>
  <section className="mt-24">
    <div className="bg-foreground text-background rounded-2xl p-8">
      <h3 className="text-xl font-bold mb-2">Join the conversation</h3>
      <p className="text-sm text-background/60 mb-6">
        Supply chain breakdowns, weekly on LinkedIn.
      </p>
      <div className="flex gap-8 mb-6">
        <div>
          <p className="text-2xl font-bold">{totalImpressions.toLocaleString()}+</p>
          <p className="text-xs text-background/50">Post impressions</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{totalReactions.toLocaleString()}+</p>
          <p className="text-xs text-background/50">Reactions</p>
        </div>
        <div>
          <p className="text-2xl font-bold">5</p>
          <p className="text-xs text-background/50">Articles published</p>
        </div>
      </div>
      <a
        href="https://www.linkedin.com/in/shettys-desk"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-background/20 hover:bg-background/10 transition-colors"
      >
        <Linkedin className="w-4 h-4" />
        Connect on LinkedIn
      </a>
    </div>
  </section>
</BlurFade>
```

---

### Task 21: Dark Email Footer

**Files:**
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Replace plain email/LinkedIn section with dark block**

```tsx
<BlurFade delay={0.5}>
  <section className="mt-24">
    <div className="bg-foreground text-background rounded-2xl p-8">
      <p className="text-sm text-background/50 mb-2">Email me directly</p>
      <p className="text-lg font-mono">poornajithshetty@gmail.com</p>
      <a
        href="https://www.linkedin.com/in/shettys-desk"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-background/30 hover:bg-background/10 transition-colors text-sm"
      >
        Connect on LinkedIn
      </a>
    </div>
  </section>
</BlurFade>
```

- [ ] **Step 2: Increase form field spacing**

In `components/ContactForm.tsx`, if the form fields use `space-y-4`, change to `space-y-6`.

---

## Chunk 6: Approach + Workshop Pages (Phase 2)

### Task 22: Gantt Timeline for Approach Page

**Files:**
- Create: `components/GanttTimeline.tsx`
- Modify: `app/approach/page.tsx`

- [ ] **Step 1: Create GanttTimeline component**

```tsx
"use client";

import { motion } from "framer-motion";

type Phase = {
  name: string;
  start: number; // week number (1-based)
  end: number;
  color: string;
};

const phases: Phase[] = [
  { name: "Curiosity", start: 1, end: 2, color: "bg-chart-1" },
  { name: "Research", start: 2, end: 4, color: "bg-chart-2" },
  { name: "Synthesize", start: 3, end: 5, color: "bg-chart-3" },
  { name: "Visualize", start: 4, end: 6, color: "bg-accent" },
  { name: "Publish", start: 6, end: 7, color: "bg-chart-4" },
  { name: "Reflect", start: 7, end: 8, color: "bg-chart-5" },
];

const totalWeeks = 8;

export default function GanttTimeline() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50">
      <p className="text-xs text-muted-foreground mb-4 font-mono">
        Typical content cycle (~{totalWeeks} weeks)
      </p>

      {/* Week headers */}
      <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `repeat(${totalWeeks}, 1fr)` }}>
        {Array.from({ length: totalWeeks }, (_, i) => (
          <span key={i} className="text-[10px] text-muted-foreground text-center">
            W{i + 1}
          </span>
        ))}
      </div>

      {/* Phase bars */}
      <div className="space-y-2">
        {phases.map((phase, i) => (
          <div
            key={phase.name}
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${totalWeeks}, 1fr)` }}
          >
            <motion.div
              className={`${phase.color} rounded-md h-8 flex items-center px-2`}
              style={{
                gridColumnStart: phase.start,
                gridColumnEnd: phase.end + 1,
              }}
              initial={{ scaleX: 0, transformOrigin: "left" }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-medium text-white truncate">
                {phase.name}
              </span>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Mobile fallback */}
      <div className="block md:hidden mt-4 space-y-2">
        {phases.map((phase) => (
          <div key={phase.name} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${phase.color}`} />
            <span className="text-sm">{phase.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              W{phase.start}-{phase.end}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add GanttTimeline to approach page**

In `app/approach/page.tsx`, import and place above the PhaseCard grid:

```tsx
import GanttTimeline from "@/components/GanttTimeline";

// Above PhaseCards:
<BlurFade delay={0.2}>
  <GanttTimeline />
</BlurFade>
```

---

### Task 23: Workshop Lab-Style Upgrades

**Files:**
- Modify: `data/projects.json` — add `category` field to each project
- Modify: `app/workshop/page.tsx`

- [ ] **Step 1: Add category field to projects.json**

Add `"category": "Tool"` or `"Content"` or `"Experiment"` to each existing project entry. Also add `"Planned"` status entries if desired.

- [ ] **Step 2: Add category tabs and progress counters**

In `app/workshop/page.tsx`, make it a client component (`"use client"`) and add:

```tsx
import { useState } from "react";

const [filter, setFilter] = useState("All");
const categories = ["All", "Tools", "Content", "Experiments"];

// Summary counters
const finished = projects.filter((p) => p.status === "Finished").length;
const inProgress = projects.filter((p) => p.status === "In Progress").length;
const planned = projects.filter((p) => p.status === "Planned").length;

// Filter tabs
<div className="flex gap-2 mb-6">
  {categories.map((cat) => (
    <button
      key={cat}
      onClick={() => setFilter(cat)}
      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
        filter === cat
          ? "bg-foreground text-background"
          : "bg-card border border-border/50 hover:bg-card/80"
      }`}
    >
      {cat}
    </button>
  ))}
</div>

// Progress counters
<p className="text-sm text-muted-foreground mb-8">
  <span className="text-chart-5 font-medium">{finished} Finished</span>
  {" · "}
  <span className="text-accent font-medium">{inProgress} In Progress</span>
  {" · "}
  <span className="text-muted-foreground font-medium">{finished + inProgress + planned} Total</span>
</p>

// Filter projects
const filtered = filter === "All"
  ? projects
  : projects.filter((p) => p.category === ({ Tools: "Tool", Content: "Content", Experiments: "Experiment" } as Record<string, string>)[filter]);
```

- [ ] **Step 3: Add status dots to ProjectCard**

Add colored status indicator dots in the project cards:
```tsx
<div className="flex items-center gap-2">
  <div className={`w-2 h-2 rounded-full ${
    project.status === "Finished" ? "bg-chart-5" :
    project.status === "In Progress" ? "bg-accent" : "bg-muted-foreground"
  }`} />
  <span className="text-xs text-muted-foreground">{project.status}</span>
</div>
```

---

## Chunk 7: Decorative Layer (Phase 3) + Dark Accent Blocks

### Task 24: Floating Shapes on Other Pages

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/experience/page.tsx`
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Add glass shapes to about, experience, and contact pages**

Import from `FloatingShapes.tsx` and place in relevant sections:

```tsx
import { GlassOrb, GradientBlob, GlassOrb3D } from "@/components/FloatingShapes";

// About: near orbiting skills
<GlassOrb size={60} className="top-20 right-12 z-0" />

// Experience: behind summary card
<GradientBlob size={100} className="-left-8 top-16 z-0" />

// Contact: near form
<GlassOrb3D size={70} className="bottom-8 right-8 z-0" />
```

Ensure parent containers have `relative overflow-hidden`.

---

### Task 25: Accent-Colored Background Plates Behind Article Card Images

**Files:**
- Modify: `components/ArticleCard.tsx`

- [ ] **Step 1: Add rotated color plate behind article images**

For `featured` and `default` variants, wrap the image container in a relative div and add a pseudo-plate:

```tsx
{/* Image wrapper with accent plate */}
<div className="relative">
  {/* Accent plate behind image */}
  <div
    className="absolute -inset-1 rounded-xl rotate-[2deg] opacity-15"
    style={{ backgroundColor: ({ blue: "#3b82f6", emerald: "#10b981", orange: "#f97316", amber: "#f59e0b", rose: "#f43f5e" } as Record<string, string>)[article.accent || "blue"] }}
  />
  {/* Existing image */}
  <div className="relative rounded-lg overflow-hidden ...">
    <Image ... />
  </div>
</div>
```

Only apply to `featured` and `default` variants, not `bento`.

---

### Task 26: 3D Glass Orbs on Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add GlassOrb3D elements between sections**

```tsx
import { GlassOrb3D } from "@/components/FloatingShapes";

// Between hero and articles:
<GlassOrb3D size={80} className="left-1/4 -mt-4 z-0" />

// Between stats and radar:
<GlassOrb3D size={60} className="right-1/3 z-0" />
```

---

### Task 27: Dark Accent Block — About Page Personal Note

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Convert personal note section to dark teal card**

Find the personal note / "Personal note" section and wrap in:

```tsx
<div className="bg-secondary text-white rounded-2xl p-8">
  {/* existing personal note content */}
</div>
```

---

## Chunk 8: Final Verification + Commit

### Task 28: Full Local Verification

- [ ] **Step 1: Run dev server**

```bash
cd "/Users/tigershetty/Claude - Shettys Desk Site" && npm run dev
```

- [ ] **Step 2: Check all pages**

Verify each page in browser at `localhost:3000`:
- [ ] Home: floating shapes, varied stats, card hovers, section spacing, icons
- [ ] About: interactive working-with-me, library, on rotation, spotify placeholder, profile frame, dark personal note
- [ ] Experience: two-col layout, sticky dark summary, timeline dots, view resume
- [ ] Contact: large status blocks, community block, dark email footer
- [ ] Approach: Gantt timeline above phase cards
- [ ] Workshop: category tabs, status indicators, progress counters
- [ ] All pages: page transitions, blur fade, section spacing, footer dot spacing, content max-width

- [ ] **Step 3: Check mobile responsive**

Resize browser to 375px width. Verify:
- Summary card not sticky on mobile
- Status blocks stack vertically
- Book scroll works horizontally
- Gantt shows vertical mobile fallback

- [ ] **Step 4: Run build to check for errors**

```bash
npm run build
```

Fix any TypeScript or build errors.

### Task 29: Stage for Tiger's Local Approval

- [ ] **Step 1: Present to Tiger for review**

Show Tiger the local dev preview. Wait for approval before committing.

### Task 30: Single Commit to Main

- [ ] **Step 1: Commit all changes**

```bash
git add -A
git commit -m "feat: v5 polish upgrade — visual overhaul benchmarked against carmen-elena.space

Phase 1: Footer spacing, content max-width, page transitions, section spacing,
BlurFade everywhere, card-hover states, dark accent blocks, section heading icons

Phase 2: Varied stat visualizations, glassmorphism shapes, interactive working-with-me
cards, library/bookshelf section, Spotify placeholder, profile photo frame, experience
two-col layout with sticky summary + timeline dots + view resume, contact status blocks
+ community block + dark email footer, Gantt timeline on approach, workshop lab-style tabs

Phase 3: Floating glass orbs, accent-colored article card plates, 3D glass spheres

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

- [ ] **Step 2: Deploy only after Tiger's approval**

```bash
npx vercel --prod --yes --name shettys-desk-site
```

**Do NOT run this until Tiger explicitly says to deploy.**
