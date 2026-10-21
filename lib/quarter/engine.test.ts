import assert from "node:assert/strict";
import { test } from "node:test";
import { acts, allPaths, bestPath, scorecard, simulate, WEEKS, type Choice, type Metric } from "./engine";
import { industries, industryList } from "./industries";

const metrics: Metric[] = ["service", "profit", "cash", "resilience"];

test("the quarter is deterministic, so branches replay exactly", () => {
  const a = simulate("food", [0, 2, 1, 0]);
  const b = simulate("food", [0, 2, 1, 0]);
  assert.deepEqual(a, b);
  assert.equal(a.weeks.length, WEEKS);
});

test("every act has three cards in every industry", () => {
  for (const ind of industryList) {
    const list = acts(ind);
    assert.equal(list.length, 4);
    for (const act of list) assert.equal(act.cards.length, 3);
  }
});

test("you inherit a network that misses demand before any fix lands", () => {
  const q = simulate("food", [1, 1, 2, 2]);
  const early = q.weeks.slice(0, 3).reduce((s, w) => s + w.fill, 0) / 3;
  assert.ok(early < 0.95 && early > 0.8, `early fill ${early}`);
});

test("each disruption shows up in its own weeks", () => {
  const q = simulate("electronics", [1, 0, 2, 2]);
  assert.equal(q.weeks[4].disruption, "spike");
  assert.equal(q.weeks[7].disruption, "outage");
  assert.equal(q.weeks[11].disruption, "shortage");
});

test("buffers from Act 1 soften the outage when you ride it out", () => {
  const thin = simulate("food", [0, 1, 2, 2]);
  const thick = simulate("food", [2, 1, 2, 2]);
  const outage = (q: typeof thin) => q.weeks.slice(6, 9).reduce((s, w) => s + w.fill, 0);
  assert.ok(outage(thick) > outage(thin));
});

test("air freight buys service at a cost, and only high margins pay for it", () => {
  const air = simulate("food", [1, 1, 0, 2]);
  const ride = simulate("food", [1, 1, 2, 2]);
  assert.ok(air.totals.fill > ride.totals.fill);
  assert.ok(air.totals.profit < ride.totals.profit);
  assert.ok(simulate("pharma", [1, 1, 0, 2]).totals.profit > simulate("pharma", [1, 1, 2, 2]).totals.profit);
});

test("allocation trades trust for margin", () => {
  const key = simulate("food", [1, 1, 2, 0]);
  const margin = simulate("food", [1, 1, 2, 1]);
  assert.ok(key.totals.trust > margin.totals.trust);
  assert.ok(margin.totals.profit > key.totals.profit);
});

test("no single quarter gets straight As, and every card wins somewhere", () => {
  for (const ind of Object.keys(industries) as (keyof typeof industries)[]) {
    assert.ok(!allPaths.some((p) => Object.values(scorecard(simulate(ind, p)).grades).every((g) => g === "A")), `${ind} has a dominant path`);
    for (let act = 0; act < 4; act++) {
      const winners = new Set<number>();
      for (const m of metrics) {
        const avg = ([0, 1, 2] as Choice[]).map((c) => {
          const sel = allPaths.filter((p) => p[act] === c);
          return sel.reduce((s, p) => s + scorecard(simulate(ind, p)).percentiles[m], 0) / sel.length;
        });
        winners.add(avg.indexOf(Math.max(...avg)));
      }
      assert.ok(winners.size >= 2, `${ind} act ${act + 1} has one card best at everything`);
    }
  }
});

test("the best quarter differs by metric", () => {
  const paths = metrics.map((m) => bestPath("food", m).join(""));
  assert.ok(new Set(paths).size >= 3);
});
