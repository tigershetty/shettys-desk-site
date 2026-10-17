import { test } from "node:test";
import assert from "node:assert/strict";
import { Twin, runScenario } from "./engine";
import { monteCarlo } from "./montecarlo";

test("same seed gives the same run", () => {
  const a = runScenario({ policy: "sQ", seed: 7 });
  const b = runScenario({ policy: "sQ", seed: 7 });
  assert.deepEqual(a, b);
});

test("baseline network serves demand well", () => {
  const k = runScenario({ policy: "sQ", seed: 3 });
  assert.ok(k.fillRate > 0.95, `baseline fill rate ${k.fillRate}`);
});

test("a supplier outage hurts service, which then recovers", () => {
  const twin = new Twin({ policy: "sQ", seed: 11, params: { safetyDays: 3 } });
  for (let i = 0; i < 10; i++) twin.step();
  twin.inject("supplierOutage");
  let worst = 1;
  for (let i = 0; i < 150; i++) {
    twin.step();
    worst = Math.min(worst, twin.rollingFillRate(7));
  }
  assert.ok(worst < 0.95, `rolling fill rate never dipped (worst ${worst})`);
  assert.ok(twin.rollingFillRate(7) >= 0.95, `did not recover (${twin.rollingFillRate(7)})`);
  assert.ok(twin.kpis().recoveryDays !== null && twin.kpis().recoveryDays! > 0);
});

test("expediting protects service during an outage, at a cost", () => {
  const [sQ, exp] = monteCarlo({
    policies: ["sQ", "expedite"],
    runs: 20,
    params: { safetyDays: 3 },
    events: [{ id: "supplierOutage", day: 10 }],
  });
  assert.ok(exp.fillRate.mean > sQ.fillRate.mean, `expedite ${exp.fillRate.mean} vs sQ ${sQ.fillRate.mean}`);
  assert.ok(exp.totalCost.mean > sQ.totalCost.mean, "expediting should cost more");
});
