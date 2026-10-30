# Profile decisions, 30 Oct 2026

Answers from Poornajith that the single profile file (Step 2.2) must encode. Each line is a decision, not a draft. Source: this working session.

## Source and wording rules

| Topic | Decision |
| --- | --- |
| Source of truth for the career | `data/experience.json` is the draft. Poornajith confirms each role line by line before it is marked verified |
| Years in supply chain | Counted from the first role, Jun 2016 |
| Home vs workplace | Based in Malmö. The Tetra Pak role location is Lund |
| Scope figures | Public wording is rounded down to floors and labelled as scope, never as an achievement (see below) |
| Availability | Speaking, collaborations, roles and brainstorming |

## Scope figures (manager role, Oct 2025 to now)

The team is 8 purchasing specialists plus 2 sourcing specialists. The sourcing specialists work on about 4,000 parts a year. The lead-time improvement from direct CAD-drawing access covers a subset of 1,500+ of those parts.

| Fact | Exact (private) | Public wording |
| --- | --- | --- |
| Annual purchasing volume in scope | 450M+ EUR | 400M+ EUR |
| Purchase orders in scope | 250,000+ | 200,000+ |
| Suppliers in scope | 1,000+ | 1,000+ |
| Parts sourced a year by the 2 sourcing specialists | about 4,000 | 4,000 (approximate) |
| Parts with lead time cut 20% | 1,500+ | 1,500+ |

The 180M+ EUR revenue figure belongs to the earlier planning role (capital-equipment products, master scheduling and planning), not to the manager role. Public wording: 150M+ EUR in revenue in scope.

Whether Tetra Pak has cleared any figure is not confirmed. The profile file therefore marks scope figures as `banded` and the build warns on exact values.

## Thesis

- Public line: "Master's thesis (co-authored): how to plan supply and demand together when every machine is built to order, a case study at Tetra Pak."
- Formal title (resume page only): *Sales & Operations Planning applied to an Engineer-to-order environment: A case study at Tetra Pak*
- Dates: Jan to Jun 2019. Full-time role starts Sep 2019.
- No co-author name, product name, interviewee role or company figures from the thesis text appear on the site.

## Projects

| Project | Status | Notes |
| --- | --- | --- |
| Product Journey Lab (LAB-03 on Shetty's Desk) | WIP | Replaces "Parked / Holding" |
| Supply Chain Twin Lab | Planned | Separate from the two others |
| Supply Chain Command (hidden 3D game) | Paused | Separate build. Page is noindex; code kept in `components/command` |

## Travel

Added Colombo, Cape Town, Cairo and Addis Ababa: 31 countries, 4 continents. Norway is skipped for now.

## Demand Sensing Router resource pack

Correct the URL in the pack (`README.md`, `MANIFEST.json`, regenerate checksums and PDF), then hide the resource everywhere: off the library index, home and nav, with its page and download returning 404 and noindexed. Pack files stay in git. No new public version is released.
