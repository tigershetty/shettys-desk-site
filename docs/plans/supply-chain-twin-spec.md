# Supply Chain Twin Lab: Spec (V1)

Route: `/lab/supply-chain-twin` · Status: V1 build · Owner: Poornajith Shetty

## Why

A playable digital twin that shows network modelling the way planners experience it: disruptions arrive, policies react, and the KPIs move in real time. It is a portfolio piece and a teaching tool in the spirit of Cosmic Frog and anyLogistix, but it runs entirely in the browser.

## Goals

1. **End-to-end flow simulation**: suppliers → plants → distribution centres → customer markets, with orders, production, shipments, inventory and capacity.
2. **Live parameters**: demand, lead time, capacity and safety stock can change while the sim runs.
3. **Disruptions on demand**: supplier outage, demand spike, port closure, plant outage.
4. **Policy comparison**: (s,Q), (R,S) and (s,Q) plus expedite, compared with Monte Carlo runs over the same scenario.
5. **Real-time KPIs**: fill rate, service level, backorders, inventory value, logistics and expedite cost, CO₂, and recovery time.
6. **3D view**: every node and in-transit shipment is visible and clickable for live status.
7. **Challenge mode**: a 120-day run with a score, so it plays like a game.

## Non-goals (V1)

- Real customer or company data. The network is synthetic and illustrative.
- Mathematical optimisation (OR-Tools / MILP). This is a later, server-side step.
- LLM decision models (Jev and similar). These are a later experiment for classifying messy supplier messages into structured events.
- Multi-product BOMs, which come in V2.

## Architecture

The data model is kept separate from the view (the WareTrack lesson): the 3D layer can change without touching the engine.

| Layer | File | Notes |
|---|---|---|
| Model | `lib/twin/model.ts` | Typed entities: Site, Lane, Shipment, Policy, Disruption, Params, KPIs |
| Engine | `lib/twin/engine.ts` | Discrete-event simulation with a daily clock and a time-ordered event queue for arrivals; seeded RNG for reproducible runs |
| Network | `lib/twin/network.ts` | Default synthetic network: 2 suppliers, 2 plants, 2 DCs, 4 markets |
| Monte Carlo | `lib/twin/montecarlo.ts` + `montecarlo.worker.ts` | N seeded runs per policy, in a Web Worker so the UI stays live |
| UI | `components/twin/*` | Controls, KPI panel, sparkline, event log, challenge |
| 3D | `components/twin/Scene3D.tsx` | React Three Fiber; loaded client-only with `next/dynamic({ ssr: false })` |
| Page | `app/lab/supply-chain-twin/page.tsx` | Server-rendered intro and method text for indexing; the canvas hydrates after it |

### Engine rules (one simulated day per step)

1. Shipments due today arrive (event queue).
2. Markets place orders, using a normal distribution around mean × demand multiplier (× spike, if one is active). Each DC fills from stock; any unfilled quantity becomes a backorder that is served first the next day.
3. Plants produce up to capacity × capacity multiplier (0 during a plant outage), consuming components 1:1.
4. **DC replenishment policy:**
   - **(s,Q):** when inventory position ≤ s, order Q from the assigned plant.
   - **(R,S):** every R days, order up to S.
   - **(s,Q) + expedite:** like (s,Q), but if projected cover is shorter than the lead time, the order ships by air at a third of the lead time, with a cost premium and a CO₂ penalty.
   - s and S are derived from mean demand × (lead time + safety-stock days).
5. Plants reorder components from suppliers with (s,Q). A supplier outage blocks dispatch; a port closure adds 14 days to sea lanes that dispatch during the closure.
6. KPIs update daily. Recovery time is the number of days from the start of a disruption until the 7-day rolling fill rate is back at or above 95%.

## Acceptance criteria

- The engine is deterministic for a given seed (unit test).
- A supplier outage lowers the fill rate versus baseline, and the fill rate recovers after the outage ends (unit test).
- Expedite beats (s,Q) on fill rate during an outage, at a higher cost (unit test, Monte Carlo).
- The UI holds about 60 fps on a mid-range laptop. On mobile the 3D view drops to a lighter scene, and the controls and KPIs stay usable at 390 px wide.
- The page has a server-rendered heading, description and method section.

## Roadmap

- **V1:** everything above.
- **V2:** multi-SKU with a BOM, cost-to-serve per market, scenario save/share via URL.
- **V3:** a server-side OR-Tools optimiser for network design (open/close DCs, lane sourcing), and LLM-classified supplier signals feeding disruption events.
