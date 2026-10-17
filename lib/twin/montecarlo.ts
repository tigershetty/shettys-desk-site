import { runScenario, type ScenarioEvent } from "./engine";
import type { Kpis, Params, PolicyId } from "./model";

export type PolicySummary = {
  policy: PolicyId;
  runs: number;
  fillRate: { mean: number; p10: number; p90: number };
  totalCost: { mean: number; p10: number; p90: number };
  co2Tonnes: number;
  recoveryDays: number | null;
};

function band(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
  return { mean: values.reduce((s, v) => s + v, 0) / values.length, p10: at(0.1), p90: at(0.9) };
}

/** Compare policies on the same seeds, so differences come from the policy alone. */
export function monteCarlo(opts: { policies: PolicyId[]; runs: number; params?: Partial<Params>; events?: ScenarioEvent[]; days?: number }): PolicySummary[] {
  return opts.policies.map((policy) => {
    const results: Kpis[] = [];
    for (let i = 0; i < opts.runs; i++) {
      results.push(runScenario({ policy, params: opts.params, events: opts.events, days: opts.days, seed: 1000 + i }));
    }
    const recoveries = results.map((r) => r.recoveryDays).filter((r): r is number => r !== null);
    return {
      policy,
      runs: opts.runs,
      fillRate: band(results.map((r) => r.fillRate)),
      totalCost: band(results.map((r) => r.logisticsCost + r.holdingCost)),
      co2Tonnes: results.reduce((s, r) => s + r.co2Tonnes, 0) / results.length,
      recoveryDays: recoveries.length ? recoveries.reduce((s, v) => s + v, 0) / recoveries.length : null,
    };
  });
}
