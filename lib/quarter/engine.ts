import { industries, type Industry, type IndustryId } from "./industries";

// One Quarter: a deterministic 13-week model of a single product network.
// Four acts each offer three cards; a card changes the policy or the world,
// and the weekly loop below turns that into fill rate, profit, cash and
// resilience. Same inputs always give the same quarter, so the debrief can
// replay any branch instantly.

export const WEEKS = 13;
export const ACT_WEEKS = [0, 3, 6, 9] as const;
const LEAD_TIME = 3;

export type Choice = 0 | 1 | 2;
export type Metric = "service" | "profit" | "cash" | "resilience";
export type Grade = "A" | "B" | "C" | "D" | "F";

export type Card = {
  title: string;
  detail: string;
  /** Honest hints, e.g. "+ Service", "− Cash". */
  hints: string[];
};

export type Act = {
  id: string;
  title: string;
  weeks: string;
  situation: string;
  cards: [Card, Card, Card];
  /** The principle the act is about, named in the debrief. */
  principle: string;
};

export function acts(ind: Industry): Act[] {
  const c = ind.copy;
  return [
    {
      id: "inherit",
      title: "You inherit an 85% network",
      weeks: "Weeks 1–3",
      situation: `You've just taken over planning at ${ind.company}. Availability of the ${ind.product} sits around 85%. Forecasts are noisy, buffers are thin and ${c.supplier} delivers late about one week in six. You have budget for one fix.`,
      cards: [
        { title: "Fix the forecast", detail: "Clean the demand history, add sell-through data and run a weekly S&OP review. The cheapest fix, and it sees risks coming.", hints: ["+ Cash", "+ Early warning", "Slow to pay back"] },
        { title: "Raise safety stock", detail: "Lift the buffer from 1 to 2.5 weeks of cover. Fast, but it ties up cash and costs to hold.", hints: ["+ Profit", "Ties up cash early", "Holding cost"] },
        { title: "Develop the supplier", detail: `Joint improvement plan with ${c.supplier}: on-time delivery to 97% and a continuity plan. The most expensive fix.`, hints: ["+ Service", "+ Resilience", "− Cash"] },
      ],
      principle: "Availability problems have root causes: forecast error, buffer size and supplier reliability. Each fix pays back on a different timescale.",
    },
    {
      id: "spike",
      title: "Demand shock",
      weeks: "Weeks 4–6",
      situation: `${c.spike} Orders jump 70% for three weeks, and nobody knows if it lasts.`,
      cards: [
        { title: "Chase the spike", detail: "Order to the new run-rate and push the supplier for more. Capture every sale you can.", hints: ["+ Sales now", "− Cash", "Risk: excess later"] },
        { title: "Hold the plan", detail: "Treat it as noise. Keep ordering to the original forecast and accept some empty shelves.", hints: ["+ Cash", "− Service", "− Trust"] },
        { title: "Shape demand with sales", detail: "Cap the promotion, set customer limits and share sell-through data upstream. Gives up some upside.", hints: ["+ Service", "+ Resilience", "− Profit"] },
      ],
      principle: "The bullwhip effect: small changes at the shelf grow into big swings upstream when every stage over-reacts. Sharing demand data dampens it.",
    },
    {
      id: "outage",
      title: "Supplier goes down",
      weeks: "Weeks 7–9",
      situation: `${c.outage} Supply drops to a fraction of normal for three weeks.`,
      cards: [
        { title: "Air-freight the gap", detail: "Buy expedited capacity and fly it in. Lead time drops to a week; the premium is steep.", hints: ["+ Service", "− Profit", "− Cash"] },
        { title: "Qualify a second source", detail: "Bring in a European supplier. Two weeks to ramp, 6% dearer per unit from then on, plus qualification costs.", hints: ["+ Resilience", "Slow to help", "Dearer units"] },
        { title: "Ride it out on buffers", detail: "Spend nothing. Live on the stock you have and see how far it goes.", hints: ["+ Profit", "+ Cash", "Service rides on Act 1"] },
      ],
      principle: "Resilience versus efficiency: buffers, dual sourcing and expediting all cost money until the day they don't. What you chose in Act 1 decides how hard this hits.",
    },
    {
      id: "shortage",
      title: "Not enough for everyone",
      weeks: "Weeks 10–13",
      situation: `${c.shortage} ${cap(c.keyAccount)} takes 40% of volume at a thin margin; ${c.tail} take 25% at the best margin.`,
      cards: [
        { title: "Protect the key account", detail: `Serve ${c.keyAccount} in full first, then share the rest.`, hints: ["+ Trust", "− Profit"] },
        { title: "Margin first", detail: `Serve ${c.tail} and mid-size customers first. Maximise profit this quarter.`, hints: ["+ Profit", "− Trust"] },
        { title: "Fair share", detail: "Allocate every customer the same percentage of their order.", hints: ["Balanced", "No one fully happy"] },
      ],
      principle: "Allocation rules are strategy: who you protect in a shortage tells customers what you value. Decide the rule before the shortage, not during it.",
    },
  ];
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export type Week = {
  week: number;
  demand: number;
  sold: number;
  lost: number;
  fill: number;
  inventory: number;
  /** Weeks of cover at base demand, for the map. */
  cover: number;
  cash: number;
  profit: number;
  trust: number;
  supplied: number;
  air: boolean;
  secondSource: boolean;
  disruption: "none" | "spike" | "outage" | "shortage";
};

export type Quarter = {
  industry: IndustryId;
  choices: Choice[];
  weeks: Week[];
  totals: { revenue: number; profit: number; cash: number; fill: number; trust: number; written: number; resilience: number };
};

/** Deterministic wobble in [-1, 1] for forecast error and supplier lateness. */
function wobble(week: number, salt: number) {
  const x = Math.sin((week + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

export function simulate(industryId: IndustryId, choices: Choice[]): Quarter {
  const ind = industries[industryId];
  const [a1, a2, a3, a4] = choices;
  const BASE_DEMAND = ind.volume;
  // One-off costs are set in weeks of gross margin, so they bite equally in every industry.
  const gm = ind.volume * (ind.unitPrice - ind.unitCost);
  const startCash = gm * 8;

  let forecastErr = 0.25;
  // The inherited forecast runs low: the root cause of the 85% availability.
  let bias = -0.15;
  let otif = 0.85;
  let safety = 1;
  let outageFloor = 0.15;
  let secondSource = false;
  let unitCost = ind.unitCost;
  let cash = startCash;
  let profit = 0;
  let revenue = 0;
  let written = 0;
  let trust = 70;
  let inventory = BASE_DEMAND * 0.35;
  let forecast = BASE_DEMAND;
  const pipeline: number[] = Array(LEAD_TIME).fill(BASE_DEMAND * 0.88);
  const weeks: Week[] = [];
  let fillSum = 0;

  const spend = (euros: number) => {
    cash -= euros;
    profit -= euros;
  };

  for (let w = 0; w < WEEKS; w++) {
    // Decisions take effect at the start of their act.
    if (w === 0 && a1 === 0) {
      spend(gm * 0.4);
      forecastErr = 0.06;
      bias = 0;
    }
    if (w === 0 && a1 === 1) safety = 2.5;
    if (w === 0 && a1 === 2) {
      spend(gm * 0.9);
      otif = 0.97;
      outageFloor = 0.4;
    }
    if (w === 3 && a2 === 2) {
      spend(gm * 0.2);
      forecastErr = Math.max(0.05, forecastErr * 0.5);
      bias /= 2;
    }
    if (w === 6 && a3 === 1) spend(gm * 0.5);
    if (w === 8 && a3 === 1) {
      secondSource = true;
      unitCost = ind.unitCost * 1.06;
    }

    const spike = w >= 3 && w <= 5;
    const outage = w >= 6 && w <= 8;
    const shortage = w >= 9;
    let demand = BASE_DEMAND * (spike ? 1.7 : 1) * (1 + 0.04 * wobble(w, 1));
    if (spike && a2 === 2) demand = BASE_DEMAND * 1.25;

    // Supply arriving this week.
    let arriving = pipeline.shift() ?? 0;
    arriving *= otif + (1 - otif) * (wobble(w, 2) > 0.4 ? -1.2 : 0.4);
    arriving = Math.max(0, arriving);
    let air = false;
    if (outage) {
      const normal = arriving;
      arriving = normal * (secondSource ? 0.7 : outageFloor);
      if (a3 === 0) {
        const flown = Math.max(0, normal * 0.9 - arriving);
        arriving += flown;
        spend(flown * ind.airPremium);
        air = true;
      }
    }
    // An industry-wide shortage: the supplier allocates you a fixed share.
    if (shortage) arriving = BASE_DEMAND * 0.75 * (otif > 0.9 ? 1 : 0.95);
    cash -= arriving * unitCost;

    // Sell.
    const available = inventory + arriving;
    const sold = Math.min(available, demand);
    let trustHit = 0;
    if (shortage) {
      // Three customer groups: key account 40% at −10% margin, mid 35%, tail 25% at +15%.
      const groups = [
        { share: 0.4, price: ind.unitPrice - (ind.unitPrice - unitCost) * 0.35, weight: 2.2 },
        { share: 0.35, price: ind.unitPrice, weight: 0.6 },
        { share: 0.25, price: ind.unitPrice + (ind.unitPrice - unitCost) * 0.45, weight: 0.2 },
      ];
      const order = a4 === 0 ? [0, 1, 2] : a4 === 1 ? [2, 1, 0] : null;
      let left = sold;
      const served = groups.map(() => 0);
      if (order) {
        for (const g of order) {
          served[g] = Math.min(left, demand * groups[g].share);
          left -= served[g];
        }
      } else groups.forEach((g, i) => (served[i] = sold * g.share));
      const rev = served.reduce((s, q, i) => s + q * groups[i].price, 0);
      revenue += rev;
      cash += rev;
      profit += rev - sold * unitCost;
      trustHit = groups.reduce((s, g, i) => s + (1 - served[i] / (demand * g.share)) * g.weight * g.share, 0) / 1.06;
      // Good demand data lets you tell customers early and precisely what they will get.
      if (a1 === 0 || a2 === 2) trustHit *= 0.75;
    } else {
      revenue += sold * ind.unitPrice;
      cash += sold * ind.unitPrice;
      profit += sold * (ind.unitPrice - unitCost);
      trustHit = 1 - sold / demand;
    }
    const lost = demand - sold;
    inventory = available - sold;
    trust = Math.max(0, Math.min(100, trust - trustHit * 16 * ind.trustSensitivity + (trustHit < 0.02 ? 1 : 0)));

    // Holding cost and obsolescence on stock above three weeks of cover.
    const hold = inventory * ind.holding;
    spend(hold);
    const excess = Math.max(0, inventory - BASE_DEMAND * ind.freshWeeks);
    const spoiled = excess * ind.obsolescence;
    inventory -= spoiled;
    written += spoiled * unitCost;
    profit -= spoiled * unitCost;

    // Plan the next order (order-up-to with a noisy forecast).
    forecast = forecast * 0.6 + demand * 0.4;
    let seen = forecast * (1 + bias + forecastErr * wobble(w, 3));
    // Chasing extrapolates the spike; a clean forecast over-reacts less.
    if (a2 === 0 && w >= 3 && w <= 6) seen *= forecastErr < 0.1 ? 1.2 : 1.5;
    if (a2 === 1 && w >= 3 && w <= 5) seen = BASE_DEMAND * (1 + bias + forecastErr * wobble(w, 3));
    const position = inventory + pipeline.reduce((s, q) => s + q, 0);
    const target = seen * (LEAD_TIME + 1) + seen * safety;
    let order = Math.max(0, target - position);
    // With a clean forecast and weekly S&OP, the risk review flags the outage early and pre-builds a week.
    if (a1 === 0 && w === 2) order += BASE_DEMAND * 1.6;
    pipeline.push(order);

    const fill = sold / demand;
    fillSum += fill;
    weeks.push({
      week: w + 1,
      demand,
      sold,
      lost,
      fill,
      inventory,
      cover: inventory / BASE_DEMAND,
      cash,
      profit,
      trust,
      supplied: arriving,
      air,
      secondSource,
      disruption: spike ? "spike" : outage ? "outage" : shortage ? "shortage" : "none",
    });
  }

  // Resilience: how ready the network is for the next shock.
  const resilience =
    (safety > 1 ? 18 : 0) + (otif > 0.9 ? 22 : 0) + (secondSource ? 25 : 0) + (forecastErr < 0.15 ? 15 : 0) + trust * 0.3 + Math.min(10, (inventory / BASE_DEMAND) * 3);

  return {
    industry: industryId,
    choices,
    weeks,
    totals: { revenue, profit, cash: cash - startCash, fill: fillSum / WEEKS, trust, written, resilience },
  };
}

// ---------- scoring ----------

const metricValue: Record<Metric, (q: Quarter) => number> = {
  service: (q) => q.totals.fill * 0.75 + (q.totals.trust / 100) * 0.25,
  profit: (q) => q.totals.profit,
  cash: (q) => q.totals.cash,
  resilience: (q) => q.totals.resilience,
};

export const allPaths: Choice[][] = (() => {
  const out: Choice[][] = [];
  for (const a of [0, 1, 2] as Choice[]) for (const b of [0, 1, 2] as Choice[]) for (const c of [0, 1, 2] as Choice[]) for (const d of [0, 1, 2] as Choice[]) out.push([a, b, c, d]);
  return out;
})();

const cache = new Map<IndustryId, Record<Metric, number[]>>();
function distribution(industry: IndustryId) {
  let d = cache.get(industry);
  if (!d) {
    const qs = allPaths.map((p) => simulate(industry, p));
    d = Object.fromEntries((Object.keys(metricValue) as Metric[]).map((m) => [m, qs.map(metricValue[m]).sort((a, b) => a - b)])) as Record<Metric, number[]>;
    cache.set(industry, d);
  }
  return d;
}

/** Share of all 81 possible quarters this one beats, per metric. */
export function percentiles(q: Quarter): Record<Metric, number> {
  const d = distribution(q.industry);
  return Object.fromEntries(
    (Object.keys(metricValue) as Metric[]).map((m) => {
      const v = metricValue[m](q);
      const below = d[m].filter((x) => x < v - 1e-9).length;
      const equal = d[m].filter((x) => Math.abs(x - v) <= 1e-9).length;
      return [m, (below + equal / 2) / d[m].length];
    })
  ) as Record<Metric, number>;
}

export function gradeOf(p: number): Grade {
  return p >= 0.85 ? "A" : p >= 0.65 ? "B" : p >= 0.4 ? "C" : p >= 0.15 ? "D" : "F";
}

export type Archetype = { name: string; line: string };

export function archetype(p: Record<Metric, number>): Archetype {
  const g = (m: Metric) => p[m];
  const vals = Object.values(p);
  if (vals.every((v) => v >= 0.55)) return { name: "The Planner", line: "No metric sacrificed. You balanced service, cost and cash like a seasoned S&OP lead." };
  if (Math.max(...vals) - Math.min(...vals) > 0.75 && vals.filter((v) => v < 0.2).length >= 1 && vals.filter((v) => v > 0.8).length >= 1) {
    if (g("service") > 0.7) return { name: "The Firefighter", line: "Customers got their stock, whatever it cost. Heroic, expensive, and hard to repeat every quarter." };
    if (g("profit") > 0.7 || g("cash") > 0.7) return { name: "The Cost Hawk", line: "The numbers look great this quarter. The customers who went without will remember next quarter." };
  }
  if (g("resilience") >= 0.7) return { name: "The Architect", line: "You spent this quarter building a network that bends instead of breaking. The payoff comes next time." };
  if (g("service") >= 0.6) return { name: "The Customer Champion", line: "Service first. You kept shelves full and trust high, and paid for it in margin." };
  if (g("profit") >= 0.6 || g("cash") >= 0.6) return { name: "The Operator", line: "Lean and disciplined. Cash and margin held up; a bigger shock would test the buffers." };
  return { name: "The Survivor", line: "A rough quarter. Replay a branch below to see which call would have changed the story." };
}

export function scorecard(q: Quarter) {
  const p = percentiles(q);
  const grades = Object.fromEntries((Object.keys(p) as Metric[]).map((m) => [m, gradeOf(p[m])])) as Record<Metric, Grade>;
  return { percentiles: p, grades, archetype: archetype(p) };
}

/** The path that scores best on a metric, for "the best quarter for service was…". */
export function bestPath(industry: IndustryId, metric: Metric): Choice[] {
  let best = allPaths[0];
  let bestV = -Infinity;
  for (const p of allPaths) {
    const v = metricValue[metric](simulate(industry, p));
    if (v > bestV) {
      bestV = v;
      best = p;
    }
  }
  return best;
}
