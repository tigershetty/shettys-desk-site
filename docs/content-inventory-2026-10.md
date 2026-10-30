# Content inventory and conflicts, 30 Oct 2026

Step 1 of the UX overhaul. Inventory only: no code was changed. Every fact below was read from the repo on branch `claude/gallant-mayer-w0sya5`.

## Decisions applied

| Decision | Rule used in this audit |
| --- | --- |
| Years in supply chain count from 2016, the first role | First role is Biz Sherpa, Jun 2016. At 30 Oct 2026 that is 10 years 4 months. |
| Based in Malmö; the Tetra Pak role location is Lund | Home city is Malmö. Role, office and plant references say Lund. |
| The Twin Lab is "planned" | No page may call it playable, in development or scheduled. |

## 1. Sources of truth today (there are six)

| Source | Holds |
| --- | --- |
| `data/experience.json` | Summary, competencies, Tetra Pak roles and metrics, earlier roles, education, languages, `resumeUrl` |
| `data/journey.ts` | Career milestones with dates, status, summary and metrics. Its header says "keep the two in sync" by hand |
| `data/passes.ts` | Boarding-pass copy that overrides journey summaries and chips |
| `lib/scor.ts` | Roles and metrics regrouped by SCOR process, rewritten as prose |
| `components/ControlTower.tsx` | Six hardcoded KPI numbers, hardcoded network nodes, hardcoded event log |
| `data/travel.json`, `data/radar.json`, `data/site.json`, `data/beliefs.json` | Places, topics, nav, contact, principles |

Pages with their own inline copy: `app/about/page.tsx` (personal note), `app/shettys-desk/page.tsx` (pillars and radar "flights"), `components/HeroBento.tsx`, `components/Greeting.tsx`, `components/AboutHero.tsx`, `components/DeskFolders.tsx`, `components/Footer.tsx`, `app/privacy/page.tsx`.

## 2. Fact register

"Canonical" is the value I propose the single profile file should hold. Status: OK = all places agree, CONFLICT = see section 3, DRIFT = values agree today but are typed in more than one place.

### Identity and location

| Fact | Canonical | Appears in | Status |
| --- | --- | --- | --- |
| Name | Poornajith Shetty | HeroBento (avatar alt, mobile card), site.json (brand "Shetty's.") | OK |
| Headline | Supply chain planning leader | HeroBento mobile card, experience.json summary | DRIFT |
| Home base | Malmö | travel.json (home), GlobeSection, AboutHero tagline, ControlTower clock ("· MALMÖ"), passes ("Malmö · Lund") | CONFLICT C1 |
| Role location | Lund | experience.json (3 roles), scor.ts, journey.ts, ControlTower hub, Footer | CONFLICT C1 |
| Email | poornajithshetty@gmail.com | site.json, privacy page (typed again) | DRIFT |
| LinkedIn | linkedin.com/in/shettys-desk | site.json `social.linkedin`, experience.json `resumeUrl` | CONFLICT C8 |
| Availability | "Open to speaking & collaborations" | site.json `availabilityBadge` | CONFLICT C9 |
| Languages | English, Hindi, Kannada, Swedish | experience.json, InNumbers | OK |

### Career facts

| Fact | Canonical | Appears in | Status |
| --- | --- | --- | --- |
| Time at Tetra Pak | "7+ years" (Sep 2019 start = 7y 1m; thesis start Jan 2019 = 7y 9m) | experience.json (`totalYears`, summary), About personal note, shettys-desk pillar, DeskFolders ("7+ years · Tetra Pak") | CONFLICT C2 |
| Years in supply chain | 10 (from Jun 2016) | InNumbers (`thisYear - 2016`, calendar-year maths) | CONFLICT C2, C10 |
| Current role | Replenishment Manager, Planning & Quality (Services Supply Network), Oct 2025 to now | experience.json, journey.ts, scor.ts, AboutHero, About note | DRIFT (title variants) |
| Team size now | 10 purchasing and sourcing specialists | experience.json, ControlTower KPI, About note ("ten"), journey.ts | DRIFT |
| Annual purchasing volume | 450M+ EUR | experience.json, journey.ts, scor.ts, ControlTower KPI, About note | DRIFT (5 places) |
| Purchase orders | 250,000+ | experience.json, scor.ts | DRIFT |
| Spare parts | 150,000+ | experience.json, journey.ts, scor.ts, About note | DRIFT |
| Suppliers | 1,000+ | experience.json, journey.ts, ControlTower KPI, About note | DRIFT |
| Sourcing lead time | -20% on 1,500+ parts per year | experience.json, scor.ts, ControlTower KPI | DRIFT |
| Sourcing backlog | -45% | experience.json, journey.ts, scor.ts, ControlTower log | DRIFT |
| Order-confirmation automation | ~9 h/day, ~2,200 h/yr (≈1 FTE) | experience.json, journey.ts, scor.ts, ControlTower KPI and log | DRIFT |
| Optimus Prime AI agent | 200+ work instructions, 50+ users, query time down "over 90%" | experience.json ("over 90%"), journey.ts ("−90%"), ControlTower log ("90% faster"), shettys-desk flight note ("over 90%") | CONFLICT C11 |
| Team before this | 8 people, Sweden/Italy/China, from May 2024 | experience.json, journey.ts, passes.ts | CONFLICT C12 |
| Revenue protected | 180M+ EUR a year | experience.json, journey.ts, beliefs.json | DRIFT |
| Critical deviations | 15+ per month | experience.json, journey.ts | DRIFT |
| Master scheduling scope | 9 key products, 6 countries, 2 factories, 12+ suppliers | experience.json, journey.ts, scor.ts, ControlTower caption and node list | DRIFT |
| Availability through chip shortage | 85% to 98% | experience.json, journey.ts, scor.ts, ControlTower KPI and log | DRIFT |
| On-time delivery | +25% | experience.json, journey.ts, ControlTower log | DRIFT |
| Planning-model work | Global S&OP model, fed the 2020 rollout and later IBP | experience.json, journey.ts, scor.ts, ControlTower log | DRIFT |
| Long-term plans | 25+ products | experience.json, journey.ts, scor.ts | DRIFT |
| Analyst-era title | "Jr. Supply Chain Specialist / Analyst" | experience.json; "Supply Chain Analyst" in journey.ts and passes.ts ("Junior specialist"); "Jr. Supply Chain Specialist" in scor.ts | CONFLICT C13 |
| Master's thesis at Tetra Pak (Jan 2019) | Yes | journey.ts, passes.ts, scor.ts, About note. Absent from experience.json | CONFLICT C14 |
| Early roles | 5 organisations, Jun 2016 to Aug 2018 | experience.json `earlier`; journey.ts says "3 organisations", omits Citadel from that line and Jigsaw Thinking entirely | CONFLICT C15 |
| Education | B.Eng. RVCE 2013-17; M.Sc. LTH 2017-19 | experience.json, journey.ts, scor.ts | OK |
| DE&I Europe panelist, Culture Champion | Both | journey.ts, beliefs.json, About note | DRIFT |

### Site and content facts

| Fact | Canonical | Appears in | Status |
| --- | --- | --- | --- |
| Competencies (6 areas) | experience.json `competencies` | Experience page "Core competencies" and About ControlTower "Capability stack", same data rendered twice | DUPLICATE D1 |
| Radar topics (5) | data/radar.json | Home "Supply chain radar" (RadarSection) and Shetty's Desk "Topics coming up", plus a third use in the articles flight note | DUPLICATE D2 |
| Articles published | `articles.json` length | Shetty's Desk flight note (live count) | OK (live) |
| Countries / cities | 27 countries, 45 cities, 3 continents (from travel.json) | InNumbers (live), GlobeSection (live list) | OK, but see gaps G2 |
| Distance from where it started | "7,200 km" | InNumbers, hardcoded. Bangalore to Malmö is 7,236 km by great circle | DRIFT (rounded; label says Lund) |
| Twin Lab | Planned | journey.ts, passes.ts, `/lab/supply-chain-twin`, shettys-desk "LAB-03" | CONFLICT C3 |
| Tagline | "I break down how supply chains actually work. One real topic at a time, for anyone curious enough to ask why." | site.json `greeting`, Greeting.tsx, HeroBento (split into two nodes) | DRIFT |
| Brand line | "Supply chain, one breakdown at a time." | layout.tsx metadata, journey.ts desk milestone | DRIFT |
| Resources | 1 published pack (Demand Sensing Router v1.2.0) | data/resources.ts | OK |
| Tracking | None installed (no analytics package or script found) | privacy page says only the host processes technical data | OK, see Step 4 |

## 3. Conflicts, with proposed resolution

| # | Conflict | Where | Proposed fix |
| --- | --- | --- | --- |
| C1 | Hero says Malmö, roles and footer say Lund | `AboutHero.tsx:57` says "Replenishment Manager at Tetra Pak, Malmö" (the role is Lund). `Footer.tsx:12` says "Lund, Sweden" (home is Malmö). `DeskFolders.tsx:27` says "Bangalore → Lund". `InNumbers.tsx` labels the 7,200 km line "Lund". `passes.ts` uses "Malmö · Lund" | One field each: `profile.home = "Malmö"`, `profile.employer.location = "Lund"`. Tetra Pak copy reads Lund; "based in" copy reads Malmö. Distance and journey line end at Malmö |
| C2 | "7+ years at Tetra Pak" beside "10 years in supply chain" | Both numbers are true; they measure different things and sit side by side without saying so | Always label the clock: "10 years in supply chain (since 2016)" and "7 years at Tetra Pak (since 2019)". Compute both from start dates, never type them |
| C3 | Twin Lab described as playable, but it is parked | `data/journey.ts` last milestone says "A playable 3D supply chain game" and "In development" with status SCHEDULED. `app/lab/supply-chain-twin/page.tsx` is a live page titled "Lab · playable" (not linked from nav, but reachable). `shettys-desk` LAB-03 describes a different concept (product-journey 3D walkthroughs, "Parked") | Journey and passes: "planned", no "playable" or "in development". **Decision needed:** keep `/lab/supply-chain-twin` live, or hide it (noindex / remove) until the Twin Lab ships? Also: is "Supply Chain Command" the same thing as the Twin Lab, or are there two projects (Command, the live game, plus LAB-03, the product-journey lab)? |
| C8 | `resumeUrl` is a LinkedIn profile, not a resume | experience.json; the Experience page link says "View full profile on LinkedIn" | Keep as `profile.linkedin`; add a real `/resume` route (Step 3), drop `resumeUrl` |
| C9 | Availability wording differs | site.json: "Open to speaking & collaborations". HeroBento cycles "Open to brainstorming" and "Available for collaborations". Neither mentions roles | One `availability` object feeding the hero badge. Confirm whether you want to signal openness to roles on the recruiter path |
| C10 | "Years" is computed by calendar year | `InNumbers.tsx`: `new Date().getFullYear() - 2016`. Shows 10 today but will show 11 on 1 Jan 2027 when it is really 10 years 7 months | Compute from `2016-06` start date and floor |
| C11 | Optimus Prime result worded four ways | "over 90%", "-90%", "90% faster", "90%" | Pick one: "query and review time cut by over 90%" |
| C12 | Team-leader leg is in the present tense | `passes.ts` "Leading the supply planning team..." for a role that ended Sep 2025. The planning role is also said to be "four years" and Team Leader started May 2024 (so about 1.4 years leading) | Past tense for ended legs; "four years in supply planning, the last 16 months as team leader" if you want that precision |
| C13 | Analyst title has three spellings | See fact register | Use experience.json's title in full, short form "Supply Planning Analyst" only where space demands it |
| C14 | Thesis exists only in the journey | experience.json has no entry for Jan 2019 thesis at Tetra Pak | Add as an experience entry, so the resume is complete and Tetra Pak tenure is derivable |
| C15 | Early-career counts disagree | journey: "3 organisations, 2016-2017". experience.json: 5 earlier organisations. InNumbers: "8 roles at 6 organisations" | One list in the profile; every count derives from it |

## 4. Duplicated blocks (same content, shown twice)

| # | Block | Shown on | Recommendation |
| --- | --- | --- | --- |
| D1 | Competencies | Experience page and About control tower | Show once. Experience is the natural home; About should link to it |
| D2 | Radar topics | Home and Shetty's Desk | Home shows a link to the three nearest topics; the full list lives on Shetty's Desk |
| D3 | Career metrics | ControlTower KPI strip, experience.json highlights, journey metrics, SCOR islands, About note | One `proof` list, rendered by id wherever it is needed |
| D4 | Career story | Experience (SCOR + metro map + role cards), About (boarding passes + control tower + personal note) | Three tellings of the same career; pick one detailed (Experience) and one narrative (About) |
| D5 | Tagline | Greeting, HeroBento, site.json | One string |
| D6 | Email | site.json and privacy page | Privacy page reads from profile |

## 5. Gaps and open items

| # | Item | Status |
| --- | --- | --- |
| G1 | Cities for Sri Lanka, South Africa, Egypt, Ethiopia | Not in `travel.json`. I will not guess cities. Needed from you |
| G2 | Whether you actually entered Norway | Not in `travel.json`. Needed from you. Until answered it stays off the globe and out of the country count (27 today) |
| G3 | DNS A records for the bare domain | Outside the repo. Needs the DNS provider, see `docs/domain-switch-shettysdesk.md` |
| G4 | Vercel env flags | Outside the repo. Needs the dashboard or a Vercel tool call |
| G5 | No resume or one-page proof anywhere | Addressed in Step 3 |
| G6 | `/lab/supply-chain-twin` has no "planned" counterpart in nav | Depends on C3 |
| G7 | 21st tools | Not loaded in this session, see the Step 1 report |

## 6. Proposed shape of the single profile file (for Step 2)

One typed module, `data/profile.ts`, exporting:

- `identity`: name, headline, home (Malmö), employer (Tetra Pak, Lund), contact, availability
- `career`: ordered roles with start/end dates, location and highlights, each metric an object with an `id`, value, unit and plain-language label
- `proof`: the six to eight headline numbers by metric id
- `derived`: years in supply chain and years at Tetra Pak, computed from dates
- `projects`: with an explicit status of `live`, `in-progress`, `planned` or `parked`

`experience.json`, `journey.ts`, `passes.ts`, `scor.ts` and `ControlTower.tsx` become views over this file, and the inline copy on About, Shetty's Desk, DeskFolders, Footer and Privacy reads from it.

## 7. Resolutions applied (30 Oct 2026, branch `codex/content-inventory`, not pushed)

| # | Resolution | Files |
| --- | --- | --- |
| C1 | Malmö is home, Lund is the Tetra Pak role location. About hero reads "Replenishment Manager at Tetra Pak, Lund · based in Malmö"; footer, desk folder and the 7,200 km card say Malmö; boarding pass "Malmö · Lund" is now "Malmö" | `AboutHero`, `Footer`, `DeskFolders`, `InNumbers`, `data/passes.ts` |
| C2, C10 | "Years in supply chain" is computed from Jun 2016 and rolls over on the anniversary, not 1 January. The card now says "Since my first role in 2016", so it no longer reads as a conflict with "7+ years at Tetra Pak" | `InNumbers` |
| C3 | Twin Lab is "planned" on the journey and passes (status label "Planned"). `/lab/supply-chain-twin` is now a noindex "planned" notice; the game code is kept in `components/command` and git history | `data/journey.ts`, `BoardingPasses`, `app/lab/supply-chain-twin/page.tsx` |
| C9 | Availability lives in `data/site.json` (`availability`) and the hero badge reads it: speaking, collaborations, roles, brainstorming. The old `availabilityBadge` key was unused | `data/site.json`, `HeroBento` |
| C11 | Optimus Prime: "query and review time cut by over 90%" everywhere | `data/journey.ts`, `ControlTower` |
| C12 | Team Leader pass is past tense | `data/passes.ts` |
| C13 | Analyst title is "Jr. Supply Chain Specialist / Analyst" (short form "Jr. Specialist / Analyst" on passes) | `data/journey.ts`, `data/passes.ts` |
| C15 | Early roles: four organisations in 2016-17 including Jigsaw Thinking | `data/journey.ts` |
| D6 | Privacy page reads the contact email from `data/site.json` | `app/privacy/page.tsx` |

Verified: `tsc`, `eslint`, production build, and the rendered `/`, `/about`, `/privacy`, `/lab/supply-chain-twin` pages.

### Still open

| # | Item | Needed from |
| --- | --- | --- |
| C14 | Thesis entry in `experience.json`: title, end date, scope | Poornajith |
| C8 | `resumeUrl` is still a LinkedIn link until `/resume` exists (Step 3) | Step 3 |
| D1-D5 | Duplicated blocks and the single profile file | Step 2.2 |
| LAB-03 | "Product-journey lab" on Shetty's Desk (parked, burger and fulfilment-centre walkthroughs): same project as the Twin Lab or a separate one? | Poornajith |
| G1 | Cities for Sri Lanka, South Africa, Egypt, Ethiopia | Poornajith |
| G2 | Whether Norway was entered | Poornajith |
| G3 | Apex `shettysdesk.com` has no A records (Vercel: `misconfigured: true`, DNS is at Cloudflare). Add DNS-only `A @ 216.198.79.1` and `A @ 64.29.17.1` | Poornajith, in Cloudflare |
| G4 | `NEXT_PUBLIC_SITE_URL=https://www.shettysdesk.com` and `REDIRECT_LEGACY_DOMAIN=1` in Vercel Production, after G3 works. The Vercel connector gets 403 on env variables, so this cannot be read or set from here | Poornajith, in Vercel |
| G8 | `shettysdesk.vercel.app` and `shettys-desk-site.vercel.app` still redirect to `www.tigershetty.com`; repoint to `www.shettysdesk.com` after G3 and G4 | Poornajith / approved change |

## 8. Status after the profile build (30 Oct 2026)

C1 to C15, D1 (competencies still shown on two pages, now from one source), D3 to D6 are resolved by `data/profile.ts` and the build check (`docs/profile-data.md`). C14 (thesis) is recorded. G1 is done (four cities added); G2 (Norway) is deliberately skipped. The Demand Sensing Router is hidden with its URL corrected. Still open: G3 and G4 (Cloudflare DNS, Vercel env flags), G8 (vercel.app redirects), D2 and D4 (radar topics and career story shown twice) and the Home rebuild (Step 3).
