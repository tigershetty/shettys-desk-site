// The journey as boarding passes on About. Each pass is one leg: where the
// trip left from and where it landed. The date, line, summary, metrics and
// status come from data/journey.ts, so the two never drift apart.

export type Stop = { code: string; name: string };

export type Pass = {
  /** The milestone in data/journey.ts this leg lands on. */
  milestone: string;
  from: Stop;
  to: Stop;
};

export const passes: Pass[] = [
  { milestone: "lth", from: { code: "BLR", name: "Bangalore" }, to: { code: "MMX", name: "Malmö · Lund" } },
  { milestone: "thesis", from: { code: "LTH", name: "Lund University" }, to: { code: "TPK", name: "Tetra Pak" } },
  { milestone: "analyst", from: { code: "THS", name: "Thesis student" }, to: { code: "ANA", name: "Supply Chain Analyst" } },
  { milestone: "scheduler", from: { code: "ANA", name: "Analyst" }, to: { code: "MPS", name: "Master Scheduler" } },
  { milestone: "chips", from: { code: "MPS", name: "Master Scheduler" }, to: { code: "SEM", name: "Chip shortage" } },
  { milestone: "leader", from: { code: "MPS", name: "Master Scheduler" }, to: { code: "LDR", name: "Team Leader" } },
  { milestone: "manager", from: { code: "LDR", name: "Team Leader" }, to: { code: "MGR", name: "Replenishment Manager" } },
  { milestone: "desk", from: { code: "OPS", name: "Operations" }, to: { code: "DSK", name: "Shetty's Desk" } },
  { milestone: "twin", from: { code: "DSK", name: "Shetty's Desk" }, to: { code: "LAB", name: "Twin Lab" } },
];
