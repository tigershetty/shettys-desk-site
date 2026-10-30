# Profile data: how to keep the facts right

`data/profile.ts` is the only place a career fact or figure is typed. Everything else reads from it.

## What reads from it

| Surface | File |
| --- | --- |
| Experience page, desk folders, in-numbers | `data/experience.ts` (built from the profile) |
| Journey board and metro map | `data/journey.ts` |
| Boarding passes | `data/passes.ts` |
| SCOR islands | `lib/scor.ts` |
| Control tower, principles | `components/ControlTower.tsx`, `data/beliefs.ts` |
| About note, hero, footer, contact, privacy | read `identity`, `fig()` and the date helpers |
| Shetty's Desk projects and radar | status comes from the profile's project vocabulary |

## Rules

1. **Change a fact in `data/profile.ts`, never in the page.** Use `fig("id")` for a number and `yearsAtTetraPak()` or `yearsInSupplyChain()` for a duration.
2. **Two tiers.** Every figure has `web` (banded, rounded down) and `cv` (softened, closer to real). Exact internal figures are not stored.
3. **Scope is not a result.** Purchasing volume, purchase orders, suppliers and revenue are scope. Word them as "in scope" or "responsible for".
4. **Re-confirm figures every 12 months.** Update `asOf`. The build fails when a figure is older than 12 months.
5. **Statuses are `live`, `wip`, `planned` or `paused`.** No other words.
6. **Log the change** in `docs/profile-changelog.md` with where the fact came from.

## The guard

`npm run check:profile` runs before every build. It checks dates, role order, figure tiers, staleness and project statuses, and fails if a known figure is typed by hand anywhere in `app/`, `components/`, `lib/` or `data/`. If it fails on a figure, move the figure into the profile and read it from there.

## Not yet covered

The Home rebuild and `/resume` page (Step 3) will read the `cv` tier.

## Outside the website

These are not generated from the profile and need a manual check when a fact changes: the LinkedIn profile, article captions in `data/articles.json`, and released resource packs under `resource-packs/`.
