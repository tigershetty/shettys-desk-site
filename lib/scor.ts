// The Experience page as the SCOR model: each process is an island, and the
// roles and results that belong to it live there. Every line comes from
// data/experience.json.

export type IslandId = "plan" | "source" | "make" | "deliver" | "enable";

export type Entry = { period: string; role: string; org: string; points: string[] };

export type Island = {
  id: IslandId;
  label: string;
  /** One line on what the SCOR process is, for readers outside the field. */
  definition: string;
  color: string;
  pos: [number, number];
  entries: Entry[];
};

export const islands: Record<IslandId, Island> = {
  make: {
    id: "make",
    label: "Make",
    definition: "Turning materials into product: capacity, pace and the factory floor.",
    color: "#f59e0b",
    pos: [-36, 0],
    entries: [
      {
        period: "2016–2017",
        role: "Industrial Engineering Intern",
        org: "SELCO Foundation · ITC Limited, Bangalore",
        points: ["Where it started: time studies, line layouts and the shop floor."],
      },
      {
        period: "2021–2025",
        role: "Master Scheduler, Supply Planning",
        org: "Tetra Pak, Lund",
        points: ["Paced 2 internal factories and 12+ external suppliers in Sweden, Italy, Portugal, Austria, China and the USA."],
      },
    ],
  },
  plan: {
    id: "plan",
    label: "Plan",
    definition: "Balancing demand and supply: forecasts, S&OP and the master schedule.",
    color: "#4f46e5",
    pos: [0, -36],
    entries: [
      {
        period: "2018–2019",
        role: "Supply Chain Analyst · Master's thesis",
        org: "Citadel Intelligent Systems, Bangalore · Tetra Pak, Lund",
        points: ["First analyst role, then the thesis that brought me to Tetra Pak."],
      },
      {
        period: "2019–2021",
        role: "Jr. Supply Chain Specialist, Global Supply Planning",
        org: "Tetra Pak, Lund",
        points: [
          "Standardised the S&OP planning model globally across Commercial, Supply and Operations, the foundation for the 2020 S&OP rollout and later IBP.",
          "Built long-term supply plans for 25+ products through introduction and phase-out.",
        ],
      },
      {
        period: "2021–2025",
        role: "Team Leader & Master Scheduler",
        org: "Tetra Pak, Lund",
        points: [
          "Mid-term master scheduling for 9 key products across 6 countries.",
          "Lifted supply availability from 85% to 98% through the semiconductor shortage with scenario planning and rapid replanning.",
          "Improved on-time delivery 25% through capacity scenarios, master-data work and demand/supply alignment.",
        ],
      },
    ],
  },
  source: {
    id: "source",
    label: "Source",
    definition: "Buying what the network needs: suppliers, purchase orders and lead times.",
    color: "#0d9488",
    pos: [36, 0],
    entries: [
      {
        period: "2025–now",
        role: "Replenishment Manager, Planning & Quality",
        org: "Tetra Pak Services Supply Network",
        points: [
          "450M+ EUR annual purchasing volume and 250,000+ purchase orders across 1,000+ suppliers.",
          "Cut average sourcing lead time 20% on 1,500+ parts a year by securing direct CAD-drawing access; sourcing-case automation cut the backlog 45%.",
        ],
      },
    ],
  },
  deliver: {
    id: "deliver",
    label: "Deliver",
    definition: "Getting the right part to the right place at the right time.",
    color: "#e11d48",
    pos: [0, 36],
    entries: [
      {
        period: "2025–now",
        role: "Replenishment Manager, Planning & Quality",
        org: "Tetra Pak Services Supply Network",
        points: [
          "150,000+ spare parts kept moving to customers worldwide.",
          "Rescued a stalled order-confirmation automation blocked by an SAP defect; it now saves ~9 hours a day, ~2,200 hours a year (≈1 FTE).",
        ],
      },
    ],
  },
  enable: {
    id: "enable",
    label: "Enable",
    definition: "Everything that makes the other processes work: people, data, tools and learning.",
    color: "#64748b",
    pos: [0, 0],
    entries: [
      {
        period: "2013–2019",
        role: "B.Eng. Industrial Engineering · M.Sc. Logistics & SCM",
        org: "R. V. College of Engineering · LTH, Lund University",
        points: ["Two degrees, two countries, one subject: how things move."],
      },
      {
        period: "2024–now",
        role: "Leading teams",
        org: "Tetra Pak",
        points: ["A planning team of 8 across Sweden, Italy and China, then a team of 10 purchasing and sourcing specialists with full headcount and budget ownership."],
      },
      {
        period: "2025–now",
        role: "AI and automation",
        org: "Tetra Pak · Shetty's Desk",
        points: [
          "Built 'Optimus Prime at P&Q', an AI agent over the Quality Management System and 200+ work instructions for 50+ global users, cutting query and review time by over 90%.",
          "Shetty's Desk: an agentic content workflow built on Claude Code. DE&I Europe Panelist and Culture Champion.",
        ],
      },
    ],
  },
};

export const islandOrder: IslandId[] = ["plan", "source", "make", "deliver", "enable"];

/** The red thread: the order the processes were actually lived. */
export const thread: { island: IslandId; when: string }[] = [
  { island: "make", when: "2016" },
  { island: "enable", when: "2017" },
  { island: "plan", when: "2019" },
  { island: "make", when: "2021" },
  { island: "plan", when: "2022" },
  { island: "source", when: "2025" },
  { island: "deliver", when: "2025" },
  { island: "enable", when: "now" },
];
