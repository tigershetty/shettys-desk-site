# Design audit: October 2026

This audit reviews every page at 1440 px and 390 px. The goal is to keep the editorial look (white field, black borders, indigo, teal and amber) and remove the parts that make the site feel generated or "printed".

## Reference: carmen-elena.space (pulled with Firecrawl)

Here is what makes that page feel premium:

- **Restraint in type.**
  - Plus Jakarta Sans is used for headings and DM Sans for body text.
  - The h1 is only 22 px and body text is 15 px. Everything is in sentence case.
  - Mono appears only inside the terminal widget.
- **Soft, warm surfaces.**
  - The background is a warm off-white (#FFFEFC), and panels are beige (#F7F2EE) with soft borders (#DFD8D0).
  - White cards sit inside those panels.
  - There are no black outlines, and corners have a 12–16 px radius.
- **One accent.** Electric blue (#2216FF) is used for buttons and figures, with a lavender tint (#EEEDFF) behind it. Body text is warm grey (#64645F).
- **Numbers carry a small graphic.** Each figure sits on a white card with a faint icon in the top right and a tiny graphic showing the number: timeline dots, a dot grid, or an avatar stack.
- **Radar as glossy orbs.** Soft, lit spheres in pastel tints with one label each.
- **Footer.** A single faded marquee row with the text in italic.

**Caution:** our homepage already follows her structure almost one-for-one: the greeting, "Open to experiences", the "Peek inside" buttons, "My numbers", "Design Radar", the sidebar terminal widget and the "Made with" footer. We should borrow her restraint, not more of her layout, and our own supply-chain identity has to carry the difference. We keep Geist and the indigo/teal/amber identity.

## What is working

- The palette: indigo leads, and teal and amber act as accents.
- Geist as the single typeface.
- The hairline grid background.
- The hero card.
- The sidebar.
- Generous page margins.
- The glass-folder interaction.

## What makes it look AI-made

| # | Issue | Evidence | Fix |
|---|---|---|---|
| 1 | Too many typographic voices | Five voices compete: `font-mono` is used 85 times, there are 20 uppercase, wide-tracked eyebrows ("BILL OF LADING", "SCOR MODEL · MY CAREER"), a pixel font (TASTE), a split-flap font and a terminal widget. | Geist Sans does all the text. Geist Mono is used only for figures and codes, in sentence case and without wide tracking. Remove the pixel and split-flap faces outside their one hero moment. |
| 2 | No type scale | There are 10 hard-coded pixel sizes (8, 9, 10, 11, 12, 13, 14, 15, 17 and 22 px). | Use a six-step scale: 12 / 14 / 16 / 20 / 28 / 48+. Make the display size much bigger, with tight tracking (−0.02em). |
| 3 | Skeuomorphic props | Barcodes, a "DELIVERED" stamp, a bill of materials, the conveyor, the departures board, the terminal and the TASTE pixel art. Each one is fine alone, but together they read as a theme park. | Keep at most one metaphor per page, and let the content carry the rest. |
| 4 | The same numbers everywhere | 450M+, 98%, −20% and 2,200 h appear on Home, About (control tower and board) and Experience. | Each page gets its own figures: Home is a snapshot, Experience holds the proof, and About shows the person. |
| 5 | Surfaces are inconsistent | Black 1 px borders, glass blur, dark slabs (board, tower, radar), pastel emoji cards, about 10 one-off shadows, and six different corner radii. | Use two surfaces: a white card with a black hairline at a 16 px radius, and a single ink surface for "instruments". One shadow token. |
| 6 | Off-palette colours | Rose (the red thread), radar green, pastel audience cards and emoji. | Map them back to the palette. Indigo is the thread, teal means healthy, amber means attention, and nothing else is used. |
| 7 | Toy-like 3D | The SCOR islands and the bookshelf use saturated primaries, flat lighting and low-poly props. | See the 3D direction below. |
| 8 | Dead space | On Home, the "Latest articles" panel stretches to match the numbers column, which leaves about 500 px of empty glass. | Use content-height panels or a balanced grid. |
| 9 | Chrome noise | The sidebar terminal widget, the hover hint line and the preloader. | Remove the terminal widget. The preloader should run once per session and be short. |

## 3D and motion direction ("Apple, Tesla, SaaS")

- **Materials:** a clay or porcelain base (#f4f4f6 to #e6e7ee), with brand colour used only as an accent on whatever is active. No rainbow props.
- **Light:** a soft environment light, contact shadows and gentle ambient occlusion. No hard primary-coloured light.
- **Camera:** slow, eased moves of 1.2 to 1.6 s on a cubic-bezier(.2,.8,.2,1) curve. The camera parks at a fixed three-quarter angle and never makes a sudden jump.
- **Labels:** small white pills in Geist with a hairline border, sentence case. Not mono capitals.
- **Restraint:** one moving thing at a time, ambient motion under 10% speed, and a static fallback for reduced motion.

## Done in this pass

- In numbers: white figure cards with a faint icon and a small graphic each (a year track, role blocks shaded by organisation, a city grid, a continent bar, and the Bangalore → Lund route).

- Folders: calm, single-colour brand streaks replace the marble art. Folder text uses Geist (it was using system fonts), and metadata is no longer set in mono. Tabs are in sentence case.
- Footer: a single row at the original height. The stack sits on a hairline route, and one indigo dot travels along it.

## Next, in order

1. Home numbers: a new concept (open question).
2. A type system pass across all pages (items 1 and 2).
3. Surfaces and colour clean-up (items 5 and 6).
4. 3D polish for SCOR and the bookshelf (item 7).
5. Prop and chrome trim (items 3 and 9).
