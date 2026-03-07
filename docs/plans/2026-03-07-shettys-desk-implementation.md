# Shetty's Desk Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and deploy Shetty's Desk site, an 8-page personal site with article content from LinkedIn posts. Deploy to Vercel subdomain first.

**Architecture:** Next.js 15 App Router with static content stored in JSON data files. No CMS, no database. Content lives in `/data/` as JSON. Images in `/public/images/`. All pages are server components. Contact form uses Vercel serverless function. Deployed to Vercel.

**Tech Stack:** Next.js 15 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Vercel deployment

**Tooling verified:**
- Node.js v25.6.0, npm 11.8.0, Git 2.39.5
- GitHub CLI authenticated as tigershetty
- Vercel CLI: install with `npm i -g vercel` before Task 13
- GitHub repo: create with `gh` CLI in Task 1

**Decisions:**
- Next.js 15 (latest stable, Turbopack default)
- Contact form: Vercel serverless function (not Formspree)
- Domain: Vercel subdomain first, custom domain later
- Package manager: npm

**Design doc:** `docs/plans/2026-03-07-shettys-desk-site-design.md`

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Step 1: Create Next.js project**

Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm`

Accept defaults. This creates the project in the current directory.

**Step 2: Verify it runs**

Run: `npm run dev`
Expected: Site running at localhost:3000 with default Next.js page.

**Step 3: Clean default content**

Remove default content from `app/page.tsx`. Replace with a simple "Shetty's Desk" heading. Remove default styles from `app/globals.css` except Tailwind directives.

**Step 4: Set up the color theme**

In `tailwind.config.ts`, add custom colors extracted from the infographics:
- `brand-blue`: the electric blue from the infographics (#0a1628 dark bg, #1e3a5f mid, #0066ff accent)
- `brand-white`: off-white for text
- Exact values to be confirmed by sampling the infographic PNGs.

**Step 5: Initialize git and create GitHub repo**

```bash
git init
echo "node_modules/\n.next/\n.DS_Store\n.firecrawl/" > .gitignore
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind"
gh repo create shettys-desk-site --public --source=. --push
```

---

## Task 2: Content Data Layer

**Files:**
- Create: `data/articles.json`
- Create: `data/experience.json`
- Create: `data/projects.json`
- Create: `data/radar.json`
- Create: `data/beliefs.json`
- Create: `data/site.json`
- Copy: infographic PNGs to `public/images/articles/`

**Step 1: Create data directory and article JSON**

`data/articles.json` contains all 5 articles. Each article object:

```json
{
  "slug": "maersk-strategic-pivot",
  "title": "Maersk's Strategic Pivot",
  "hook": "Why is the world's second-largest shipping company buying warehouses instead of ships?",
  "date": "2026-02-20",
  "image": "/images/articles/maersk.png",
  "tags": ["Strategy", "Logistics", "Integration"],
  "featured": true,
  "audienceBadge": "Read by Directors at Maersk, CMA CGM, Hapag-Lloyd",
  "linkedinUrl": "https://www.linkedin.com/feed/update/urn:li:share:7430619872558174208",
  "stats": {
    "impressions": 55142,
    "reactions": 361,
    "comments": 36,
    "reposts": 30,
    "saves": 63
  },
  "caption": "Why is the world's second-largest shipping company buying warehouses instead of ships?..."
}
```

Populate all 5 articles from the analytics Excel data already extracted.

**Step 2: Create experience.json**

```json
{
  "summary": "7+ years in supply chain at Tetra Pak, from thesis student to replenishment manager. Every role taught me something different about how operations actually work, and where they break.",
  "primary": [
    {
      "company": "Tetra Pak",
      "totalYears": "7 years 3 months",
      "roles": [
        {
          "title": "Replenishment Manager",
          "period": "Sep 2025 - Present",
          "location": "Lund",
          "lesson": "Owning the end-to-end. Right product, right place, right time."
        }
      ]
    }
  ],
  "earlier": [...],
  "education": [...],
  "languages": ["English", "Hindi", "Kannada", "Swedish"]
}
```

Fill from Profile.pdf data.

**Step 3: Create remaining data files**

- `data/projects.json`: 4 workshop projects
- `data/radar.json`: 5 supply chain radar items
- `data/beliefs.json`: 5 belief cards
- `data/site.json`: site-wide config (name, subtitle, greeting, nav items, marquee text, social links)

**Step 4: Copy images**

```bash
mkdir -p public/images/articles
cp "Infographic Render/Maersk - Final.png" public/images/articles/maersk.png
cp "Infographic Render/Zara-Final.png" public/images/articles/zara.png
cp "Infographic Render/Nike-Final.png" public/images/articles/nike.png
cp "Infographic Render/Dabbawalla - final.png" public/images/articles/dabbawalas.png
```

Note: US-Iran has no infographic render. Use a placeholder or the article will show without an image.

**Step 5: Commit**

```bash
git add data/ public/images/
git commit -m "feat: add content data layer and article images"
```

---

## Task 3: Layout Shell (Sidebar + Footer)

**Files:**
- Create: `app/layout.tsx` (modify existing)
- Create: `components/Sidebar.tsx`
- Create: `components/Footer.tsx`
- Create: `components/Terminal.tsx`
- Create: `components/Nav.tsx`

**Step 1: Build the Sidebar component**

Contains:
- Brand mark ("Shetty's." + subtitle)
- Primary nav links (Home, My Articles, My Approach, About Me, Experience)
- "Other" section with secondary nav (The Workshop, Shetty's Desk, Contact)
- Terminal widget component
- "Share my site" button
- Mobile: sidebar collapses to hamburger menu

Read nav items from `data/site.json`.

**Step 2: Build the Terminal widget**

Styled like a terminal window with green/white text on dark background:
```
~/shettys-desk $ git log --oneline
v3 <- live
v4 <- in progress
adding new article: US-Iran Hormuz
building shettysdesk.com
```

Static content for now. Can be made dynamic later.

**Step 3: Build the Footer marquee**

Scrolling horizontal text using CSS animation:
"Made with curiosity - Made with Claude - Made with Gemini - Made with LinkedIn - Made with Vercel - Made with caffeine - Made with trial and error"

Duplicated for infinite scroll effect.

**Step 4: Wire layout.tsx**

```tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body className="flex min-h-screen bg-[#0a1628] text-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
```

**Step 5: Verify layout renders**

Run: `npm run dev`
Expected: Sidebar on left, main content area, footer at bottom. Electric blue dark theme.

**Step 6: Commit**

```bash
git add app/ components/
git commit -m "feat: add layout shell with sidebar, nav, terminal, and footer"
```

---

## Task 4: Home Page

**Files:**
- Modify: `app/page.tsx`
- Create: `components/Greeting.tsx`
- Create: `components/ArticleCard.tsx`
- Create: `components/StatsGrid.tsx`
- Create: `components/RadarSection.tsx`

**Step 1: Build Greeting component**

Time-aware greeting using client component:
- 5am-12pm: "Good morning, friend"
- 12pm-5pm: "Good afternoon, friend"
- 5pm-9pm: "Good evening, friend"
- 9pm-5am: "Hey there, night owl"

Plus availability badge and welcome text.

**Step 2: Build ArticleCard component**

Reusable card with: Next.js Image for infographic cover, title, hook question, topic tags, CTA link. Two variants: `featured` (large) and `default` (grid size).

**Step 3: Build StatsGrid component**

4-column grid showing: "7+" years, "5" articles, "47%" industry, "38%" seniority. Each with a label below.

**Step 4: Build RadarSection component**

5 items from `data/radar.json`. Each shows topic name + one-liner description. Styled as cards or list items.

**Step 5: Compose Home page**

```tsx
export default function Home() {
  return (
    <>
      <Greeting />
      <FeaturedArticles /> {/* top 3 from articles.json */}
      <StatsGrid />
      <RadarSection />
    </>
  )
}
```

**Step 6: Verify and commit**

Run: `npm run dev`, check home page renders all sections.

```bash
git add app/page.tsx components/
git commit -m "feat: build home page with greeting, articles, stats, radar"
```

---

## Task 5: Articles Page + Article Detail Pages

**Files:**
- Create: `app/articles/page.tsx`
- Create: `app/articles/[slug]/page.tsx`
- Reuse: `components/ArticleCard.tsx`

**Step 1: Build Articles listing page**

- Headline + subhead
- Featured article (Maersk) as full-width hero card
- Grid of remaining 4 articles
- Read from `data/articles.json`

**Step 2: Build Article detail page**

Dynamic route `[slug]`. For now, shows:
- Infographic image (full width hero)
- Title + date + tags
- Caption text (the LinkedIn post body)
- Audience badge
- Link to original LinkedIn post
- "Back to articles" link

Use `generateStaticParams()` to pre-render all article pages at build time.

**Step 3: Verify routing works**

Navigate to `/articles` and `/articles/maersk-strategic-pivot`.
Expected: listing page shows all articles, detail page shows Maersk content.

**Step 4: Commit**

```bash
git add app/articles/
git commit -m "feat: add articles listing and detail pages"
```

---

## Task 6: Approach Page

**Files:**
- Create: `app/approach/page.tsx`
- Create: `components/Pipeline.tsx`
- Create: `components/PhaseCard.tsx`

**Step 1: Build Pipeline visualization**

Horizontal flow of 6 steps: Curiosity > Research > Synthesize > Visualize > Publish > Reflect. CSS-based with connecting lines/arrows. Responsive (stacks vertically on mobile).

**Step 2: Build expandable PhaseCard**

Click to expand/collapse. Shows phase name, description text. Client component for toggle state.

**Step 3: Compose Approach page**

Headline, subhead, pipeline visualization, 6 phase cards, automation note at bottom.

**Step 4: Verify and commit**

```bash
git add app/approach/ components/Pipeline.tsx components/PhaseCard.tsx
git commit -m "feat: add approach page with pipeline and phase cards"
```

---

## Task 7: About Page

**Files:**
- Create: `app/about/page.tsx`
- Create: `components/BeliefCard.tsx`

**Step 1: Build About page structure**

- Headline
- Photo placeholder (add real photo later)
- Personal letter text (from design doc)
- LinkedIn CTA button
- "What I believe" section with 5 expandable BeliefCard components
- "On Rotation" placeholder section

**Step 2: Build BeliefCard component**

Expandable card. Shows title when collapsed, full text when expanded. Client component.

**Step 3: Verify and commit**

```bash
git add app/about/ components/BeliefCard.tsx
git commit -m "feat: add about page with beliefs section"
```

---

## Task 8: Experience Page

**Files:**
- Create: `app/experience/page.tsx`
- Create: `components/RoleTimeline.tsx`

**Step 1: Build Experience page**

- Headline + resume download link (placeholder PDF)
- Quick summary paragraph
- Tetra Pak section: timeline of 6 roles with "What it taught me" column
- "Earlier" section: collapsible, compact list
- Education section
- Languages

Read from `data/experience.json`.

**Step 2: Build RoleTimeline component**

Renders a list of roles with vertical timeline line on left. Each role shows: title, period, location, lesson learned.

**Step 3: Verify and commit**

```bash
git add app/experience/ components/RoleTimeline.tsx
git commit -m "feat: add experience page with role timeline"
```

---

## Task 9: Workshop Page

**Files:**
- Create: `app/workshop/page.tsx`
- Create: `components/ProjectCard.tsx`

**Step 1: Build Workshop page**

- Headline
- Stats bar: "0 Finished, 4 In Progress, 4 Total"
- Grid of project cards from `data/projects.json`

**Step 2: Build ProjectCard component**

Shows: project name, description, status badge (In Progress / Finished), tag.

**Step 3: Verify and commit**

```bash
git add app/workshop/ components/ProjectCard.tsx
git commit -m "feat: add workshop page with project cards"
```

---

## Task 10: Shetty's Desk Brand Page

**Files:**
- Create: `app/shettys-desk/page.tsx`

**Step 1: Build the brand page**

- Headline + subhead
- "The problem" section with manifesto text
- "Who reads it" section with audience stats (from design doc)
- "What's next" placeholder
- LinkedIn follow CTA

All static content, no components needed beyond what exists.

**Step 2: Verify and commit**

```bash
git add app/shettys-desk/
git commit -m "feat: add Shetty's Desk brand page"
```

---

## Task 11: Contact Page

**Files:**
- Create: `app/contact/page.tsx`
- Create: `components/ContactForm.tsx`

**Step 1: Build Contact page**

- Headline
- Status badges row
- Contact form with topic selector dropdown, email field, message textarea
- Direct links: email (mailto:) and LinkedIn

**Step 2: Build Vercel serverless API route**

Create `app/api/contact/route.ts`. POST handler that:
- Validates fields (topic, email, message)
- Sends email via Resend (or logs for now until Resend API key is configured)
- Returns JSON response

```ts
// app/api/contact/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { topic, email, message } = body

  if (!topic || !email || !message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  // TODO: integrate Resend or similar email service
  console.log('Contact form submission:', { topic, email, message })

  return NextResponse.json({ success: true })
}
```

**Step 3: Build ContactForm component**

Client component. Topic selector options: "Suggest a topic", "Invite me to speak", "Work with me", "Just say hello". Form POSTs to `/api/contact`. Shows success/error state after submission.

**Step 3: Verify and commit**

```bash
git add app/contact/ components/ContactForm.tsx
git commit -m "feat: add contact page with form"
```

---

## Task 12: Responsive Design Pass

**Files:**
- Modify: all components as needed

**Step 1: Test all pages at mobile (375px), tablet (768px), desktop (1280px)**

Check:
- Sidebar collapses to hamburger on mobile
- Article cards stack single-column on mobile
- Stats grid goes 2x2 on mobile
- Pipeline stacks vertically on mobile
- Experience timeline is readable on mobile
- Footer marquee works at all widths

**Step 2: Fix any layout issues found**

**Step 3: Commit**

```bash
git add -A
git commit -m "fix: responsive design pass across all pages"
```

---

## Task 13: Deploy to Vercel

**Step 1: Install Vercel CLI and login**

```bash
npm i -g vercel
vercel login
```

Follow the browser auth flow.

**Step 2: Push latest to GitHub**

```bash
git push origin main
```

Repo was created in Task 1 via `gh repo create`.

**Step 3: Deploy to Vercel**

```bash
vercel --yes
```

This creates the project on Vercel, links it to the GitHub repo, and deploys to a `.vercel.app` subdomain. Accept defaults (Framework: Next.js, root: ./).

**Step 4: Verify deployment**

Check that all 8 pages load correctly on the `*.vercel.app` URL.
Test: home, articles listing, article detail, approach, about, experience, workshop, shettys-desk, contact.
Test contact form submission (should log to server, no email yet).

**Step 5: Set up production deployment**

```bash
vercel --prod
```

**Step 6: Commit Vercel config if generated**

```bash
git add .vercel/ vercel.json 2>/dev/null
git commit -m "chore: add Vercel deployment config" || echo "nothing to commit"
git push origin main
```

**Future:** Custom domain can be added later via `vercel domains add shettysdesk.com`.

---

## Task Order Summary

| Task | What | Dependencies |
|------|------|-------------|
| 1 | Project scaffold | None |
| 2 | Content data layer | Task 1 |
| 3 | Layout shell (sidebar + footer) | Task 1 |
| 4 | Home page | Tasks 2, 3 |
| 5 | Articles page + detail | Tasks 2, 3 |
| 6 | Approach page | Task 3 |
| 7 | About page | Task 3 |
| 8 | Experience page | Tasks 2, 3 |
| 9 | Workshop page | Tasks 2, 3 |
| 10 | Shetty's Desk brand page | Task 3 |
| 11 | Contact page | Task 3 |
| 12 | Responsive pass | Tasks 4-11 |
| 13 | Deploy to Vercel | Task 12 |

Tasks 4-11 can be done in any order after Tasks 2+3 are complete.
Tasks 6, 7, 9, 10, 11 are independent and can be parallelized.
