# One Quarter (`/lab/supply-chain-twin`)

The 3-minute hook for the supply chain lab, and the front door to later Learn, Practice and Build modules. It replaces the Supply Chain Command yard game. That game had no goal, autopilot won it for you, it had no trade-offs and no money, and it lagged.

## Benchmarks
- **The Beer Game:** one simple rule and a debrief.
- **The Fresh Connection and Littlefield:** decisions that move a scorecard.
- **Mini Metro:** few tools and rising pressure.
- **Frostpunk and Reigns:** choices that cost something visible.

## Design
- **The quarter:** 13 weeks in four acts, one choice card per act. Choices carry over between acts.
  1. You inherit a network at 85% availability: fix the forecast, raise safety stock, or develop the supplier.
  2. Demand shock: chase the spike, hold the plan, or shape demand with sales.
  3. Supplier outage: air-freight the gap, qualify a second source, or ride it out on buffers.
  4. Shortage allocation: protect the key account, margin first, or fair share.
- **Industries:** Food & Beverage, Electronics or Pharma. They re-skin prices, shelf life, freight premiums and how sensitive customers are, so the same card can be right in one industry and wrong in another. Air freight, for example, pays for itself only on high-margin pharma.
- **Scorecard:** Service, Profit, Cash and Resilience, each graded A–F against all 81 possible quarters, plus an archetype. Tests guarantee that no path gets straight As and that every act has at least two cards that win on something.
- **Debrief:** replay any branch. Pick an unplayed card and the alternate quarter overlays the chart and grades, or play again from that act.

## Architecture
- **Model:** `lib/quarter/engine.ts` is a deterministic weekly order-up-to model. It covers lead time, forecast bias and noise, supplier reliability, the outage floor, the shortage cap, holding cost, spoilage, three customer groups and trust. `industries.ts` holds the three skins, and `engine.test.ts` the tests.
- **3D stage:** `components/quarter/Stage.tsx` is a client-only React Three Fiber scene.
  - The network board shows a stock column per site, flow tokens per lane, the blocked sea lane, the air-freight lane, the second-source lane, and pulsing disruption rings.
  - Clicking a site flies into that site's yard. The yard is a read-only drill-down that reuses `components/command/scene/*`, and it is mounted only while drilled in.
- **UI:** `components/quarter/QuarterGame.tsx` covers the industry picker, HUD, act cards, week-by-week playback and debrief. It is plain React state, with no store and no 10 Hz re-renders.

## Limits
One product, one aggregated network and synthetic numbers. It teaches the shape of the trade-offs, not their exact size.
