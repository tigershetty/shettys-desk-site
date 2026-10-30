#!/usr/bin/env node
// Guards the single source of truth for profile facts (data/profile.ts).
//
//   1. The profile is internally consistent: dates, roles, figures, projects.
//   2. No career figure is typed anywhere else in the app.
//
// Run with: npm run check:profile (also runs before every build).
// Fix a failure by changing data/profile.ts, not by editing the other file.

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const profile = await import(pathToFileURL(path.join(ROOT, "data", "profile.ts")).href);

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const YM = /^\d{4}-(0[1-9]|1[0-2])$/;
const idx = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};
const now = new Date();
const nowIdx = now.getFullYear() * 12 + now.getMonth();

// --- 1. Internal consistency ------------------------------------------------

for (const [key, value] of Object.entries(profile.dates)) {
  if (!YM.test(value)) fail(`dates.${key} must be YYYY-MM, got "${value}"`);
}

const roles = profile.tetraPakRoles;
const ids = new Set();
for (const r of roles) {
  if (ids.has(r.id)) fail(`duplicate role id "${r.id}"`);
  ids.add(r.id);
  if (!YM.test(r.start) || (r.end !== null && !YM.test(r.end))) fail(`role "${r.id}" has a malformed date`);
  if (r.end !== null && idx(r.end) < idx(r.start)) fail(`role "${r.id}" ends before it starts`);
  for (const tier of ["web", "cv"]) {
    const lines = r.highlights(tier);
    if (!lines.length) fail(`role "${r.id}" has no ${tier} highlights`);
    for (const line of lines) {
      if (/undefined|NaN|\$\{/.test(line)) fail(`role "${r.id}" ${tier} highlight has an unresolved value: ${line}`);
    }
  }
}
const sorted = [...roles].sort((a, b) => idx(a.start) - idx(b.start));
for (let i = 1; i < sorted.length; i++) {
  const prev = sorted[i - 1];
  if (prev.end === null || idx(prev.end) >= idx(sorted[i].start) + 1) {
    // One month of handover overlap is tolerated; more is an error.
    if (prev.end === null || idx(prev.end) - idx(sorted[i].start) > 0) {
      fail(`roles "${prev.id}" and "${sorted[i].id}" overlap`);
    }
  }
}
if (idx(profile.dates.thesisEnd) >= idx(profile.dates.tetraPakStart)) fail("thesis must end before the full-time start");
if (roles.length && sorted[0].start !== profile.dates.tetraPakStart) {
  fail(`dates.tetraPakStart (${profile.dates.tetraPakStart}) must equal the first Tetra Pak role start (${sorted[0].start})`);
}
if (!/^\d{4}$/.test(profile.dei.start) || !/^\d{4}$/.test(profile.dei.end) || Number(profile.dei.end) < Number(profile.dei.start)) {
  fail("dei.start and dei.end must be years (YYYY), end not before start");
}

for (const [id, fig] of Object.entries(profile.figures)) {
  if (!fig.web || !fig.cv) fail(`figure "${id}" needs a web and a cv value`);
  if (fig.banded && fig.web === fig.cv) fail(`figure "${id}" is marked banded but web equals cv`);
  if (!YM.test(fig.asOf)) fail(`figure "${id}" has a malformed asOf`);
  else if (nowIdx - idx(fig.asOf) > 12) fail(`figure "${id}" was last confirmed ${fig.asOf}; re-confirm and update asOf`);
  else if (nowIdx - idx(fig.asOf) > 6) warn(`figure "${id}" was last confirmed ${fig.asOf}`);
}

const statuses = new Set(["live", "wip", "planned", "paused"]);
const projectIds = new Set();
for (const p of profile.projects) {
  if (!statuses.has(p.status)) fail(`project "${p.id}" has unknown status "${p.status}"`);
  if (projectIds.has(p.id)) fail(`duplicate project id "${p.id}"`);
  projectIds.add(p.id);
}

// --- 2. No hand-typed career figures elsewhere ------------------------------

// Figures that live in data/profile.ts and must never be retyped.
const BANNED = [
  [/\b(450|400|180|150)M\+?\s*(EUR|euros?)/i, "scope or revenue figure"],
  [/\b(250|200),000\+?\s*(purchase|POs?)/i, "purchase-order figure"],
  [/\b150,000\+/, "spare-parts figure"],
  [/\b1,500\+\s*parts/i, "lead-time parts figure"],
  [/~?2,200\s*hours/i, "automation hours figure"],
  [/\b\d+\+?\s*years\s+(at|in|inside)\s+(Tetra|supply|a global)/i, "tenure in years"],
];
const SKIP_DIRS = new Set(["node_modules", ".next", "command", "ui", "orbiting-circles-02-utils"]);
const SKIP_FILES = new Set([path.join("data", "profile.ts"), path.join("data", "articles.json")]);
const EXT = new Set([".ts", ".tsx", ".json", ".mjs"]);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (SKIP_DIRS.has(name)) continue;
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else if (EXT.has(path.extname(name))) yield full;
  }
}

for (const dir of ["app", "components", "lib", "data"]) {
  for (const file of walk(path.join(ROOT, dir))) {
    const rel = path.relative(ROOT, file);
    if (SKIP_FILES.has(rel)) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const [re, what] of BANNED) {
        if (re.test(line)) fail(`${rel}:${i + 1} types a ${what} by hand. Read it from data/profile.ts instead.`);
      }
    });
  }
}

for (const w of warnings) console.warn(`warn  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error ${e}`);
  console.error(`\ncheck:profile failed with ${errors.length} error${errors.length === 1 ? "" : "s"}.`);
  process.exit(1);
}
console.log(`check:profile ok (${Object.keys(profile.figures).length} figures, ${roles.length} roles, ${profile.projects.length} projects)`);
