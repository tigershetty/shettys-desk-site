# Premium Landing Page Rebuild - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the landing page as a compact bento grid with animated components, and migrate the entire site from dark navy brand-* tokens to a light teal shadcn-style theme.

**Architecture:** Replace globals.css token system entirely. Migrate all 24 files from brand-* to shadcn tokens. Rebuild landing page as a CSS Grid bento layout with framer-motion animations (BlurFade, AnimatedCounter, TextShimmer). Add a CSS-only brand moment loading transition.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, framer-motion (new), Source Code Pro font (new)

**Design doc:** `docs/plans/2026-03-08-premium-landing-rebuild-design.md`

---

## Phase 1: Foundation (Theme + Dependencies)

### Task 1: Install framer-motion

**Files:**
- Modify: `package.json`

**Step 1: Install the dependency**

Run: `npm install framer-motion`

**Step 2: Verify installation**

Run: `npm ls framer-motion`
Expected: `framer-motion@` version listed

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add framer-motion for landing page animations"
```

---

### Task 2: Replace theme system in globals.css

**Files:**
- Modify: `app/globals.css`

**Step 1: Replace the entire file with the new theme**

Replace the full contents of `app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --card: #f2f7f7;
  --ring: #06858e;
  --input: #d9eaea;
  --muted: #e0eaea;
  --accent: #c9e5e7;
  --border: #cde0e2;
  --radius: 0.125rem;
  --chart-1: #06858e;
  --chart-2: #1e9ea6;
  --chart-3: #37b6be;
  --chart-4: #5dc7ce;
  --chart-5: #8ad8dd;
  --popover: #f2f7f7;
  --primary: #06858e;
  --sidebar: #daebed;
  --font-mono: "Source Code Pro", "Courier New", monospace;
  --font-sans: "Source Code Pro", "Courier New", monospace;
  --secondary: #d9eaea;
  --background: #e8f0f0;
  --font-serif: "Source Code Pro", "Courier New", monospace;
  --foreground: #0a4a55;
  --destructive: #d13838;
  --shadow-blur: 2px;
  --shadow-color: hsl(185 70% 30% / 0.15);
  --sidebar-ring: #06858e;
  --shadow-spread: 0px;
  --shadow-opacity: 0.15;
  --sidebar-accent: #c9e5e7;
  --sidebar-border: #cde0e2;
  --card-foreground: #0a4a55;
  --shadow-offset-x: 1px;
  --shadow-offset-y: 1px;
  --sidebar-primary: #06858e;
  --muted-foreground: #427a7e;
  --accent-foreground: #0a4a55;
  --popover-foreground: #0a4a55;
  --primary-foreground: #ffffff;
  --sidebar-foreground: #0a4a55;
  --secondary-foreground: #0a4a55;
  --destructive-foreground: #ffffff;
  --sidebar-accent-foreground: #0a4a55;
  --sidebar-primary-foreground: #ffffff;
}

.dark {
  --card: #0c2025;
  --ring: #4de8e8;
  --input: #164955;
  --muted: #0f3039;
  --accent: #164955;
  --border: #164955;
  --chart-1: #4de8e8;
  --chart-2: #36a5a5;
  --chart-3: #2d8a8a;
  --chart-4: #19595e;
  --chart-5: #0e383c;
  --popover: #0c2025;
  --primary: #4de8e8;
  --sidebar: #0a1a20;
  --secondary: #164955;
  --background: #0a1a20;
  --foreground: #4de8e8;
  --destructive: #e83c3c;
  --shadow-color: hsl(180 70% 60% / 0.2);
  --sidebar-ring: #4de8e8;
  --shadow-opacity: 0.2;
  --sidebar-accent: #164955;
  --sidebar-border: #164955;
  --card-foreground: #4de8e8;
  --sidebar-primary: #4de8e8;
  --muted-foreground: #36a5a5;
  --accent-foreground: #4de8e8;
  --popover-foreground: #4de8e8;
  --primary-foreground: #0a1a20;
  --sidebar-foreground: #4de8e8;
  --secondary-foreground: #4de8e8;
  --destructive-foreground: #f2f2f2;
  --sidebar-accent-foreground: #4de8e8;
  --sidebar-primary-foreground: #0a1a20;
}

@theme inline {
  --color-card: var(--card);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-border: var(--border);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-popover: var(--popover);
  --color-primary: var(--primary);
  --color-sidebar: var(--sidebar);
  --color-secondary: var(--secondary);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-destructive: var(--destructive);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-border: var(--sidebar-border);
  --color-card-foreground: var(--card-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent-foreground: var(--accent-foreground);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary-foreground: var(--primary-foreground);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --animate-marquee: marquee 30s linear infinite;
  --animate-shimmer: shimmer 2.5s linear infinite;
  --animate-gradient-mesh: gradient-mesh 8s ease-in-out infinite;
  --animate-brand-moment: brand-moment 1.5s ease-out forwards;
  --animate-brand-fade: brand-fade 0.5s ease-out 1.2s forwards;
}

body {
  background: var(--background);
  color: var(--foreground);
}

html {
  scroll-behavior: smooth;
}

/* Scrollbar - light theme */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--background);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}

/* Selection */
::selection {
  background: hsl(185 70% 30% / 0.2);
  color: var(--foreground);
}

/* Animations */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes gradient-mesh {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes brand-moment {
  0% {
    background: var(--background);
    opacity: 1;
  }
  25% {
    background: var(--accent);
  }
  50% {
    background: var(--primary);
  }
  75% {
    background: #f59e0b;
  }
  100% {
    background: var(--background);
    opacity: 0;
  }
}

@keyframes brand-fade {
  to {
    visibility: hidden;
  }
}
```

**Step 2: Verify the dev server starts without errors**

Run: `npx next dev --turbopack` (check for CSS parse errors)

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: replace brand tokens with shadcn teal light theme"
```

---

### Task 3: Update layout.tsx for light mode + Source Code Pro font

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update the layout**

Add Source Code Pro import from Google Fonts. Remove any dark class from html. Keep Geist fonts as-is.

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shetty's Desk",
  description: "Supply chain, one breakdown at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceCodePro.variable} antialiased flex min-h-screen`}
      >
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <div className="flex-1 overflow-y-auto px-6 pt-16 pb-8 lg:px-12 lg:pt-10 lg:pb-10">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add Source Code Pro font, ensure light mode default"
```

---

## Phase 2: Token Migration (all existing components)

### Task 4: Migrate Sidebar.tsx tokens

**Files:**
- Modify: `components/Sidebar.tsx`

**Token mapping for this file:**
- `bg-brand-card/90` → `bg-card/90`
- `border-brand-border` → `border-border`
- `text-brand-white` → `text-foreground`
- `bg-brand-dark` → `bg-sidebar`
- `bg-brand-accent/15` → `bg-primary/15`
- `text-brand-accent` → `text-primary`
- `text-brand-muted` → `text-muted-foreground`
- `hover:border-brand-accent/50` → `hover:border-primary/50`
- `hover:text-brand-white` → `hover:text-foreground`
- `hover:bg-brand-accent/5` → `hover:bg-primary/5`

Apply all replacements. Commit: `refactor: migrate Sidebar tokens to shadcn theme`

---

### Task 5: Migrate Nav.tsx tokens

**Files:**
- Modify: `components/Nav.tsx`

**Token mapping:**
- `bg-brand-accent/10` → `bg-primary/10`
- `text-brand-accent` → `text-primary`
- `text-brand-muted` → `text-muted-foreground`
- `hover:text-brand-white` → `hover:text-foreground`
- `hover:bg-brand-card` → `hover:bg-accent`
- `text-brand-muted/60` → `text-muted-foreground/60`

Commit: `refactor: migrate Nav tokens to shadcn theme`

---

### Task 6: Migrate Terminal.tsx tokens

**Files:**
- Modify: `components/Terminal.tsx`

**Token mapping:**
- `bg-[#060e1a]` → `bg-foreground` (the terminal should be dark even in light mode - deep teal)
- `border-brand-border` → `border-border`
- `text-brand-accent` → `text-primary`
- `text-green-400` → `text-primary` (terminal text becomes teal)
- `text-brand-muted` → `text-muted-foreground`
- `text-brand-white/70` → `text-primary-foreground/70`
- `text-brand-muted/60` → `text-muted-foreground/60`

Note: Terminal keeps a dark background (`bg-foreground` which is `#0a4a55` in light mode) so the terminal dots and text remain visible against a dark surface. Text inside becomes `text-primary-foreground` (white).

Commit: `refactor: migrate Terminal tokens to shadcn theme`

---

### Task 7: Migrate Footer.tsx tokens

**Files:**
- Modify: `components/Footer.tsx`

**Token mapping:**
- `border-brand-border` → `border-border`
- `bg-brand-dark` → `bg-background`
- `text-brand-muted/50` → `text-muted-foreground/50`

Commit: `refactor: migrate Footer tokens to shadcn theme`

---

### Task 8: Migrate ArticleCard.tsx tokens

**Files:**
- Modify: `components/ArticleCard.tsx`

**Token mapping:**
- `text-brand-accent` → `text-primary`
- `bg-brand-accent/15` → `bg-primary/15`
- `text-brand-white` → `text-foreground`
- `text-brand-muted` → `text-muted-foreground`

Commit: `refactor: migrate ArticleCard tokens to shadcn theme`

---

### Task 9: Migrate RadarSection.tsx tokens

**Files:**
- Modify: `components/RadarSection.tsx`

**Token mapping:**
- `text-brand-white` → `text-foreground`
- `text-brand-muted` → `text-muted-foreground`
- `text-brand-muted/90` → `text-muted-foreground/90`

Commit: `refactor: migrate RadarSection tokens to shadcn theme`

---

### Task 10: Migrate StatsGrid.tsx tokens

**Files:**
- Modify: `components/StatsGrid.tsx`

**Token mapping:**
- `text-brand-white` → `text-foreground`
- `border-brand-border` → `border-border`
- `bg-brand-card` → `bg-card`
- `hover:border-brand-accent/30` → `hover:border-primary/30`
- `text-brand-accent` → `text-primary`
- `text-brand-muted` → `text-muted-foreground`

Commit: `refactor: migrate StatsGrid tokens to shadcn theme`

---

### Task 11: Migrate remaining components (batch)

**Files:**
- Modify: `components/BeliefCard.tsx`
- Modify: `components/PhaseCard.tsx`
- Modify: `components/ProjectCard.tsx`
- Modify: `components/Pipeline.tsx`
- Modify: `components/ContactForm.tsx`
- Modify: `components/RoleTimeline.tsx`
- Modify: `components/OrbitingSkills.tsx`
- Modify: `components/NavIcon.tsx` (if has brand-* refs)

**Universal token mapping (apply to all):**
- `brand-dark` → `background`
- `brand-card` → `card`
- `brand-border` → `border`
- `brand-accent` → `primary`
- `brand-white` → `foreground`
- `brand-muted` → `muted-foreground`
- `brand-glow` → `chart-2`
- `brand-mid` → `secondary`

Commit: `refactor: migrate remaining component tokens to shadcn theme`

---

### Task 12: Migrate all page files (batch)

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/approach/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/experience/page.tsx`
- Modify: `app/workshop/page.tsx`
- Modify: `app/shettys-desk/page.tsx`
- Modify: `app/articles/page.tsx`
- Modify: `app/articles/[slug]/page.tsx`

**Same universal token mapping as Task 11.** Also fix hardcoded hex values:
- `app/contact/page.tsx` line 55: `to-[#061020]` → `to-background`

Commit: `refactor: migrate all page tokens to shadcn theme`

---

### Task 13: Verify the full site renders correctly

**Step 1: Start dev server**

Run: `npx next dev --turbopack`

**Step 2: Check each page loads without errors**

Visit: `/`, `/articles`, `/approach`, `/about`, `/experience`, `/workshop`, `/shettys-desk`, `/contact`

Look for: broken colors, invisible text, missing elements, console errors.

**Step 3: Fix any issues found**

Common issues:
- Text invisible because foreground color matches background
- Colored accents (blue-400, emerald-400, etc.) may need adjustment for light backgrounds
- Hardcoded rgba values with old brand colors

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve theme migration issues across pages"
```

---

## Phase 3: New Animation Components

### Task 14: Create BlurFade.tsx

**Files:**
- Create: `components/BlurFade.tsx`

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BlurFadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  blur?: string;
  yOffset?: number;
  className?: string;
}

export default function BlurFade({
  children,
  delay = 0,
  duration = 0.4,
  blur = "6px",
  yOffset = 6,
  className,
}: BlurFadeProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: `blur(${blur})`, y: yOffset }}
      animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

Commit: `feat: add BlurFade animation component`

---

### Task 15: Create TextShimmer.tsx

**Files:**
- Create: `components/TextShimmer.tsx`

```tsx
interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export default function TextShimmer({
  children,
  className = "",
  duration = 2.5,
}: TextShimmerProps) {
  return (
    <span
      className={`inline-block bg-gradient-to-r from-muted-foreground via-primary to-muted-foreground bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer ${className}`}
      style={{ animationDuration: `${duration}s` }}
    >
      {children}
    </span>
  );
}
```

Commit: `feat: add TextShimmer component`

---

### Task 16: Create AnimatedCounter.tsx

**Files:**
- Create: `components/AnimatedCounter.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useTransform, motion, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  className = "",
  duration = 1,
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      animate(motionValue, value, { duration, ease: "easeOut" });
    }
  }, [inView, motionValue, value, duration]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
```

Commit: `feat: add AnimatedCounter component`

---

### Task 17: Create BrandMoment.tsx

**Files:**
- Create: `components/BrandMoment.tsx`

```tsx
"use client";

export default function BrandMoment() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] animate-brand-moment"
      style={{ animationFillMode: "forwards" }}
      aria-hidden="true"
    />
  );
}
```

**Step 2: Add BrandMoment to layout.tsx**

In `app/layout.tsx`, import and render `<BrandMoment />` as the first child inside `<body>`:

```tsx
import BrandMoment from "@/components/BrandMoment";
// ... existing imports

// Inside body, before Sidebar:
<BrandMoment />
<Sidebar />
```

Commit: `feat: add brand moment loading transition`

---

## Phase 4: Landing Page Rebuild

### Task 18: Create HeroBento.tsx (replaces Greeting.tsx)

**Files:**
- Create: `components/HeroBento.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlurFade from "./BlurFade";
import TextShimmer from "./TextShimmer";

function getGreeting(hour: number): { text: string; emoji: string } {
  if (hour >= 5 && hour < 12) return { text: "Good morning, friend", emoji: "sunrise" };
  if (hour >= 12 && hour < 17) return { text: "Good afternoon, friend", emoji: "sun" };
  if (hour >= 17 && hour < 21) return { text: "Good evening, friend", emoji: "sunset" };
  return { text: "Hey there, night owl", emoji: "moon" };
}

const emojiIcons: Record<string, React.ReactNode> = {
  sunrise: (
    <svg className="inline-block h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  sun: (
    <svg className="inline-block h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  sunset: (
    <svg className="inline-block h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  moon: (
    <svg className="inline-block h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
};

export default function HeroBento() {
  const [greetingData, setGreetingData] = useState({ text: "Hey there, friend", emoji: "sunrise" });

  useEffect(() => {
    setGreetingData(getGreeting(new Date().getHours()));
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 lg:p-8">
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0 opacity-20 animate-gradient-mesh"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, var(--primary) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, var(--accent) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="relative z-10">
        <BlurFade delay={0}>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground lg:text-3xl">
            {greetingData.text}
            {emojiIcons[greetingData.emoji]}
          </h1>
        </BlurFade>

        <BlurFade delay={0.1}>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Open to speaking &amp; collaborations
          </span>
        </BlurFade>

        <BlurFade delay={0.2}>
          <p className="mt-3 max-w-xl text-sm leading-relaxed">
            <TextShimmer className="text-base font-medium">
              I break down how supply chains actually work.
            </TextShimmer>
            <span className="block mt-1 text-muted-foreground">
              One real topic at a time, for anyone curious enough to ask why.
            </span>
          </p>
        </BlurFade>

        <BlurFade delay={0.3}>
          <div className="mt-4 flex gap-3">
            <Link
              href="/articles"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Read my articles
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              About me
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
```

Commit: `feat: add HeroBento component with gradient mesh and animations`

---

### Task 19: Rebuild StatsGrid.tsx as compact animated counters

**Files:**
- Modify: `components/StatsGrid.tsx`

Rewrite to use AnimatedCounter in a compact single-card 2x2 layout:

```tsx
"use client";

import Link from "next/link";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { value: 7, suffix: "+", label: "Years in supply chain", color: "text-chart-1" },
  { value: 5, suffix: "", label: "Articles published", color: "text-chart-2" },
  { value: 47, suffix: "%", label: "Transport & Logistics", color: "text-chart-3" },
  { value: 38, suffix: "%", label: "Senior & Director-level", color: "text-chart-4" },
];

export default function StatsGrid() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">
        My numbers
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className={`text-2xl font-bold ${stat.color}`}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <Link
        href="/experience"
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:gap-2.5 transition-all"
      >
        View experience
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </section>
  );
}
```

Commit: `feat: rebuild StatsGrid as compact animated counters`

---

### Task 20: Rebuild RadarSection.tsx as compact pills

**Files:**
- Modify: `components/RadarSection.tsx`

Rewrite to be tighter with tooltip-style popover:

```tsx
"use client";

import { useState } from "react";
import radarData from "@/data/radar.json";

const radarColors = [
  "border-chart-1/30 bg-chart-1/8 hover:bg-chart-1/15 hover:border-chart-1/50",
  "border-chart-2/30 bg-chart-2/8 hover:bg-chart-2/15 hover:border-chart-2/50",
  "border-chart-3/30 bg-chart-3/8 hover:bg-chart-3/15 hover:border-chart-3/50",
  "border-chart-4/30 bg-chart-4/8 hover:bg-chart-4/15 hover:border-chart-4/50",
  "border-chart-5/30 bg-chart-5/8 hover:bg-chart-5/15 hover:border-chart-5/50",
];

export default function RadarSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-1 text-sm font-semibold text-foreground uppercase tracking-wider">
        Supply Chain Radar
      </h2>
      <p className="mb-3 text-xs text-muted-foreground">
        What I&apos;m currently exploring
      </p>
      <div className="flex flex-wrap gap-2">
        {radarData.map((item, i) => (
          <button
            key={item.topic}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className={`rounded-xl border px-3 py-1.5 text-left text-sm transition-all duration-300 ${radarColors[i]} ${
              expanded === i ? "basis-full" : ""
            }`}
          >
            <p className="font-medium text-foreground text-xs">{item.topic}</p>
            {expanded === i && (
              <p className="mt-1.5 text-xs text-muted-foreground italic leading-relaxed">
                {item.commentary}
              </p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
```

Commit: `feat: rebuild RadarSection as compact pills`

---

### Task 21: Update ArticleCard.tsx with featured bento variant

**Files:**
- Modify: `components/ArticleCard.tsx`

Add a `bento` prop for the compact secondary variant (tiny thumbnail + title only), and update the featured variant for the bento grid:

```tsx
import Image from "next/image";
import Link from "next/link";

const accentColors: Record<string, { bg: string; border: string; tag: string; ring: string }> = {
  blue:    { bg: "bg-blue-500/8",    border: "border-blue-500/20",    tag: "bg-blue-500/15 text-blue-600",    ring: "hover:ring-blue-500/30" },
  emerald: { bg: "bg-emerald-500/8", border: "border-emerald-500/20", tag: "bg-emerald-500/15 text-emerald-600", ring: "hover:ring-emerald-500/30" },
  orange:  { bg: "bg-orange-500/8",  border: "border-orange-500/20",  tag: "bg-orange-500/15 text-orange-600",  ring: "hover:ring-orange-500/30" },
  amber:   { bg: "bg-amber-500/8",   border: "border-amber-500/20",   tag: "bg-amber-500/15 text-amber-600",   ring: "hover:ring-amber-500/30" },
  rose:    { bg: "bg-rose-500/8",    border: "border-rose-500/20",    tag: "bg-rose-500/15 text-rose-600",    ring: "hover:ring-rose-500/30" },
};

interface Article {
  slug: string;
  title: string;
  hook: string;
  image: string | null;
  tags: string[];
  accent?: string;
}

export default function ArticleCard({
  article,
  featured = false,
  bento = false,
}: {
  article: Article;
  featured?: boolean;
  bento?: boolean;
}) {
  const colors = accentColors[article.accent || "blue"];

  // Compact bento card: thumbnail + title only
  if (bento) {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className={`group flex items-center gap-3 rounded-xl border ${colors.border} bg-card p-3 transition-all duration-300 hover:shadow-md hover:ring-1 ${colors.ring}`}
      >
        {article.image && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}
        <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </p>
      </Link>
    );
  }

  // Featured card: image background with overlay
  if (featured) {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20"
      >
        {article.image && (
          <div className="relative aspect-[16/10]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="mb-2 inline-block rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary-foreground">
            Featured
          </span>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-semibold text-white lg:text-2xl">
            {article.title}
          </h3>
          <p className="mt-1 text-sm text-white/70 line-clamp-2">
            {article.hook}
          </p>
        </div>
      </Link>
    );
  }

  // Default card (used on /articles page)
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group block rounded-2xl border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-300 hover:shadow-md hover:ring-1 ${colors.ring}`}
    >
      {article.image && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.tag}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {article.hook}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
          Read the breakdown
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
```

Commit: `feat: add bento and featured overlay variants to ArticleCard`

---

### Task 22: Rebuild app/page.tsx as bento grid

**Files:**
- Modify: `app/page.tsx`

```tsx
import HeroBento from "@/components/HeroBento";
import ArticleCard from "@/components/ArticleCard";
import StatsGrid from "@/components/StatsGrid";
import RadarSection from "@/components/RadarSection";
import BlurFade from "@/components/BlurFade";
import articles from "@/data/articles.json";

export default function Home() {
  const featured = articles.filter((a) => a.featured);
  const secondary = articles.filter((a) => !a.featured).slice(0, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto_auto]">
      {/* Hero - full width */}
      <div className="lg:col-span-4">
        <HeroBento />
      </div>

      {/* Featured article - 2 cols, 2 rows */}
      <div className="lg:col-span-2 lg:row-span-2">
        <BlurFade delay={0.1}>
          {featured[0] && (
            <ArticleCard article={featured[0]} featured />
          )}
        </BlurFade>
      </div>

      {/* My Numbers - top right */}
      <div className="lg:col-span-2">
        <BlurFade delay={0.2}>
          <StatsGrid />
        </BlurFade>
      </div>

      {/* Radar - bottom right */}
      <div className="lg:col-span-2">
        <BlurFade delay={0.3}>
          <RadarSection />
        </BlurFade>
      </div>

      {/* Secondary articles - 4 compact cards */}
      {secondary.map((article, i) => (
        <div key={article.slug} className="lg:col-span-1">
          <BlurFade delay={0.4 + i * 0.05}>
            <ArticleCard article={article} bento />
          </BlurFade>
        </div>
      ))}
    </div>
  );
}
```

Commit: `feat: rebuild landing page as bento grid layout`

---

## Phase 5: Final Verification

### Task 23: Full visual verification and fixes

**Step 1: Start dev server**

Run: `npx next dev --turbopack`

**Step 2: Check the landing page**

Verify:
- [ ] Bento grid renders correctly on desktop (everything above fold at 1440px)
- [ ] Brand moment animation plays on load
- [ ] Hero gradient mesh animates
- [ ] Text shimmer effect works on tagline
- [ ] Number counters animate on scroll
- [ ] BlurFade stagger works for all cells
- [ ] Featured article card has image overlay with text on top
- [ ] Secondary articles show thumbnails + titles
- [ ] All colors use the teal light theme

**Step 3: Check responsive (mobile)**

Verify:
- [ ] Single column stack on mobile
- [ ] All cards readable
- [ ] No horizontal overflow

**Step 4: Check other pages**

Visit all pages and verify:
- [ ] `/articles` - cards render with correct colors
- [ ] `/approach` - phases render correctly
- [ ] `/about` - beliefs and letter render
- [ ] `/experience` - timeline renders
- [ ] `/workshop` - project cards render
- [ ] `/shettys-desk` - brand page renders
- [ ] `/contact` - form renders and submits
- [ ] Terminal in sidebar looks correct with dark bg

**Step 5: Fix any issues**

Commit: `fix: final visual polish for premium landing rebuild`

---

### Task 24: Update MEMORY.md

Update project memory to reflect:
- Theme changed from dark navy to light teal
- Token system changed from brand-* to shadcn-style
- New dependencies: framer-motion
- New components: BlurFade, TextShimmer, AnimatedCounter, BrandMoment, HeroBento
- Landing page is now bento grid layout

Commit: `docs: update project memory for premium rebuild`
