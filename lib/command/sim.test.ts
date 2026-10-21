import assert from "node:assert/strict";
import { test } from "node:test";
import { siteKpis } from "./kpis";
import { chooseEvent, createWorld, defaultProgress, respondOrder, sendForkliftToCharge, shiftStars, tick } from "./sim";
import type { World } from "./types";

function run(w: World, seconds: number, step = 0.1) {
  for (let t = 0; t < seconds; t += step) {
    tick(w, step);
    // Answer the prompts the way a passive player would, so runs stay comparable.
    for (const o of [...w.orders]) respondOrder(w, o.id, "accept");
    if (w.event) chooseEvent(w, 1);
  }
}

test("a fresh world has every site's docks, forklifts and stock", () => {
  const w = createWorld();
  assert.equal(Object.values(w.docks).filter((d) => d.site === "DE-01").length, 4);
  assert.equal(Object.values(w.docks).filter((d) => d.site === "SE-01").length, 2);
  assert.equal(Object.values(w.forklifts).filter((f) => f.site === "PL-01").length, 5);
  for (const site of ["SE-01", "DE-01", "NL-01", "PL-01", "IT-01"] as const) {
    const k = siteKpis(w, site);
    assert.ok(k.stock > 0 && k.stock < k.capacity, `${site} stock within capacity`);
  }
});

test("trucks move through en route, docking, docked and departing", () => {
  const w = createWorld(3);
  const seen = new Set<string>();
  const id = Object.values(w.trucks).find((t) => t.site === "DE-01")!.id;
  for (let i = 0; i < 3000 && w.trucks[id]; i++) {
    tick(w, 0.1);
    if (w.trucks[id]) seen.add(w.trucks[id].phase);
  }
  for (const phase of ["enroute", "arriving", "reversing", "docked", "departing"]) assert.ok(seen.has(phase), `saw ${phase}`);
});

test("a site never docks more trucks than it has free bays; extras wait at the gate", () => {
  const w = createWorld(5);
  run(w, 120);
  for (const site of ["SE-01", "DE-01", "NL-01", "PL-01", "IT-01"] as const) {
    const docks = Object.values(w.docks).filter((d) => d.site === site);
    const holding = Object.values(w.trucks).filter((t) => t.site === site && ["arriving", "reversing", "docked"].includes(t.phase));
    assert.ok(holding.length <= docks.length);
    for (const t of holding) assert.equal(w.docks[t.dock!].truck, t.id);
  }
});

test("without autopilot, arriving trucks queue at the gate", () => {
  const w = createWorld(5);
  w.autopilot = false;
  for (const t of Object.values(w.trucks)) t.eta = 1;
  tick(w, 0.1);
  assert.ok(Object.values(w.trucks).every((t) => t.phase === "atGate"));
});

test("low-battery forklifts go to a charger and come back charged", () => {
  const w = createWorld(9);
  const f = Object.values(w.forklifts).find((x) => x.site === "DE-01")!;
  f.battery = 12;
  assert.ok(sendForkliftToCharge(w, f.id));
  const statuses = new Set<string>();
  for (let i = 0; i < 600; i++) {
    tick(w, 0.1);
    statuses.add(w.forklifts[f.id].status);
  }
  assert.ok(statuses.has("charging"));
  assert.ok(w.forklifts[f.id].battery >= 50);
});

test("inbound unloading raises stock and counts put-aways", () => {
  const w = createWorld(11);
  const before = siteKpis(w, "DE-01");
  run(w, 150);
  const after = siteKpis(w, "DE-01");
  assert.ok(after.putawaysToday > 0, "put-aways happened");
  assert.ok(after.stock !== before.stock || after.outboundToday > 0);
});

test("accepted orders become outbound trucks and score on delivery", () => {
  const w = createWorld(13);
  run(w, 240);
  assert.ok(Object.values(w.shipments).some((s) => s.direction === "outbound" && s.customer !== ""));
  assert.ok(w.stats.delivered > 0, "something was delivered");
  assert.ok(w.stats.score > 0);
});

test("unanswered orders expire and cost points", () => {
  const w = createWorld(17);
  w.stats.score = 100;
  w.timers.nextOrder = 0.05;
  w.timers.nextEvent = 1e9;
  for (let i = 0; i < 180; i++) tick(w, 0.1);
  assert.ok(w.stats.lost >= 1);
});

test("a whole shift ends with stars and credits", () => {
  const w = createWorld(21, defaultProgress);
  run(w, 8 * 60 + 5, 0.25);
  assert.ok(w.shiftOver);
  assert.ok(w.progress.credits >= Math.floor(w.stats.score / 10));
  assert.ok(w.stats.onTime / Math.max(1, w.stats.delivered) > 0.5, "mostly on time with autopilot");
});

test("stars reward volume and punctuality", () => {
  const base = { score: 0, delivered: 0, onTime: 0, late: 0, lost: 0, combo: 0, eventsHandled: 0 };
  assert.equal(shiftStars(base), 0);
  assert.equal(shiftStars({ ...base, delivered: 10, onTime: 10, score: 4000 }), 3);
  assert.equal(shiftStars({ ...base, delivered: 10, onTime: 9, score: 2000 }), 2);
  assert.equal(shiftStars({ ...base, delivered: 10, onTime: 5, score: 9000 }), 0);
});
