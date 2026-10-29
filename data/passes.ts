// The journey as boarding passes on About. Each pass is one leg: where the
// trip left from and where it landed. The date, line and status come from
// data/journey.ts, so the two never drift apart.
//
// The past is told by the roles held, at a high level: no projects or
// figures. The current legs (and the one still scheduled) keep their full
// detail from data/journey.ts.

export type Stop = { code: string; name: string };

export type Pass = {
  /** The milestone in data/journey.ts this leg lands on. */
  milestone: string;
  from: Stop;
  to: Stop;
  /** Replaces the milestone's summary (used to keep past legs high level). */
  summary?: string;
  /** Replaces the milestone's metrics chips. */
  chips?: string[];
};

export const passes: Pass[] = [
  {
    milestone: "early",
    from: { code: "RVC", name: "RV College" },
    to: { code: "BLR", name: "First roles" },
    summary: "Industrial engineering internships and a programme coordination role, all in Bangalore.",
    chips: ["2016 – 2017"],
  },
  {
    milestone: "lth",
    from: { code: "BLR", name: "Bangalore" },
    to: { code: "MMX", name: "Malmö · Lund" },
    summary: "Moved to Sweden for a master's in Logistics & Supply Chain Management, and stayed.",
    chips: ["2017 – 2019"],
  },
  {
    milestone: "citadel",
    from: { code: "MMX", name: "Lund" },
    to: { code: "BLR", name: "Bangalore" },
    summary: "A summer as a supply chain analyst between the two master's years.",
    chips: ["Summer 2018"],
  },
  {
    milestone: "thesis",
    from: { code: "LTH", name: "Lund University" },
    to: { code: "TPK", name: "Tetra Pak" },
    summary: "Thesis student at Tetra Pak, then a full-time offer.",
    chips: ["Thesis → full-time offer"],
  },
  {
    milestone: "analyst",
    from: { code: "THS", name: "Thesis student" },
    to: { code: "ANA", name: "Supply Chain Analyst" },
    summary: "Junior specialist in Global Supply Planning.",
    chips: ["Sep 2019 – Sep 2021"],
  },
  {
    milestone: "scheduler",
    from: { code: "ANA", name: "Analyst" },
    to: { code: "MPS", name: "Master Scheduler" },
    summary: "Master scheduling in supply planning for capital equipment.",
    chips: ["From Oct 2021"],
  },
  {
    milestone: "leader",
    from: { code: "MPS", name: "Master Scheduler" },
    to: { code: "LDR", name: "Team Leader" },
    summary: "Leading the supply planning team across Sweden, Italy and China.",
    chips: ["Team of 8"],
  },
  // Now, and what is next: these keep their full detail.
  { milestone: "manager", from: { code: "LDR", name: "Team Leader" }, to: { code: "MGR", name: "Replenishment Manager" } },
  { milestone: "desk", from: { code: "OPS", name: "Operations" }, to: { code: "DSK", name: "Shetty's Desk" } },
  { milestone: "twin", from: { code: "DSK", name: "Shetty's Desk" }, to: { code: "LAB", name: "Twin Lab" } },
];
