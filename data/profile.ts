// The single source of truth for facts about Poornajith and the work.
//
// Pages, boards and the resume read from here. Nothing else in the repo may
// type a career fact or figure by hand: `npm run check:profile` fails the
// build if it finds one. To change a fact, change it here and add a line to
// docs/profile-changelog.md.
//
// Two tiers of every figure:
//   web  banded and rounded down, for the website and social copy
//   cv   softened but closer to the real value, for the CV and /resume
// Exact internal figures are deliberately not stored in the repo.
//
// This file must stay free of imports so the check script can load it directly.

export type Tier = "web" | "cv";

export type Figure = {
  web: string;
  cv: string;
  /** Numeric form of the web value, for animated counters. */
  n?: number;
  /** True when the web value is a deliberate rounding of the real figure. */
  banded: boolean;
  /** Month the figure was last confirmed, YYYY-MM. */
  asOf: string;
};

const AS_OF = "2026-10";
const plain = (text: string, n?: number): Figure => ({ web: text, cv: text, n, banded: false, asOf: AS_OF });
const band = (cv: string, web: string, n?: number): Figure => ({ web, cv, n, banded: true, asOf: AS_OF });

/** Every figure that appears on the site. Scope figures are labelled as scope, never as results. */
export const figures = {
  // Scope of the current manager role
  purchasingVolume: band("~450M EUR", "400M+ EUR", 400),
  purchaseOrders: band("~250,000", "200,000+", 200000),
  suppliers: plain("1,000+", 1000),
  spareParts: plain("150,000+", 150000),
  partsSourced: plain("about 4,000", 4000),
  leadTimeParts: plain("1,500+", 1500),
  teamNow: plain("10", 10),
  teamNowSplit: plain("8 purchasing and 2 sourcing specialists"),
  // Results, current role
  leadTimeCut: plain("20%", 20),
  backlogCut: plain("45%", 45),
  hoursPerDay: plain("~9"),
  hoursPerYear: plain("~2,200", 2200),
  workInstructions: plain("200+"),
  agentUsers: plain("50+"),
  agentTimeCut: plain("over 90%"),
  // Earlier planning role (capital equipment)
  revenueScope: band("~180M EUR", "150M+ EUR", 150),
  teamBefore: plain("8", 8),
  deviationsPerMonth: plain("15+"),
  keyProducts: plain("9"),
  countriesPlanned: plain("6"),
  factories: plain("2"),
  externalSuppliers: plain("12+"),
  availabilityFrom: plain("85%"),
  availabilityTo: plain("98%", 98),
  onTimeGain: plain("25%"),
  // Analyst role
  longTermProducts: plain("25+"),
} satisfies Record<string, Figure>;

export type FigureId = keyof typeof figures;

/** Figure text for a tier. */
export const fig = (id: FigureId, tier: Tier = "web") => figures[id][tier];

// ---------------------------------------------------------------------------
// Identity

export const identity = {
  name: "Poornajith Shetty",
  brand: "Shetty's Desk",
  headline: "Supply chain planning leader",
  /** Where I live. */
  home: "Malmö",
  homeCountry: "Sweden",
  /** Where the Tetra Pak role is based. */
  workplace: "Lund",
  employer: "Tetra Pak",
  email: "poornajithshetty@gmail.com",
  linkedin: "https://www.linkedin.com/in/shettys-desk",
  languages: ["English", "Hindi", "Kannada", "Swedish"],
  /** Phrases the hero badge cycles through. */
  availability: ["Open to speaking", "Open to collaborations", "Open to roles", "Open to brainstorming"],
} as const;

// ---------------------------------------------------------------------------
// Dates (YYYY-MM)

export const dates = {
  /** First role, Biz Sherpa. Years in supply chain count from here. */
  firstRole: "2016-06",
  /** Thesis start at Tetra Pak. */
  thesisStart: "2019-01",
  thesisEnd: "2019-06",
  /** Full-time start at Tetra Pak. Tenure counts from here. */
  tetraPakStart: "2019-09",
} as const;

function monthIndex(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

/** Whole years between a YYYY-MM date and now. */
export function wholeYearsSince(ym: string, now: Date = new Date()) {
  return Math.floor((now.getFullYear() * 12 + now.getMonth() - monthIndex(ym)) / 12);
}

/** Whole years a finished role lasted, counting both end months. */
export function roleYears(role: Pick<Role, "start" | "end">) {
  if (!role.end) return wholeYearsSince(role.start);
  return Math.round((monthIndex(role.end) - monthIndex(role.start) + 1) / 12);
}

export const yearsInSupplyChain = (now?: Date) => wholeYearsSince(dates.firstRole, now);
export const yearsAtTetraPak = (now?: Date) => wholeYearsSince(dates.tetraPakStart, now);

// ---------------------------------------------------------------------------
// Roles

export type Role = {
  id: string;
  title: string;
  company: string;
  location: string;
  /** YYYY-MM, or null while the role is current. */
  start: string;
  end: string | null;
  period: string;
  lesson: string;
  highlights: (tier: Tier) => string[];
};

const f = (id: FigureId, tier: Tier) => fig(id, tier);

export const tetraPakRoles: Role[] = [
  {
    id: "manager",
    title: "Replenishment Manager, Planning & Quality (Services Supply Network)",
    company: "Tetra Pak",
    location: identity.workplace,
    start: "2025-10",
    end: null,
    period: "Oct 2025 - Present",
    lesson: "Owning the end-to-end at the scale of a global service network: right part, right place, right time.",
    highlights: (t) => [
      `Lead a team of ${f("teamNow", t)} (${f("teamNowSplit", t)}) with full headcount and budget ownership. Scope: ${f("purchasingVolume", t)} annual purchasing volume, ${f("purchaseOrders", t)} purchase orders, ${f("spareParts", t)} spare parts and ${f("suppliers", t)} suppliers globally.`,
      `Cut average sourcing lead time ${f("leadTimeCut", t)} on ${f("leadTimeParts", t)} parts a year (of ${f("partsSourced", t)} sourced) by securing direct CAD-drawing access; automating sourcing-case creation reduced backlog ${f("backlogCut", t)} post-implementation.`,
      `Rescued a stalled order-confirmation automation blocked by an SAP defect, driving it to resolution through IT; post go-live it saves ${f("hoursPerDay", t)} hours/day, ${f("hoursPerYear", t)} hours/year (≈1 FTE).`,
      `Built and deployed 'Optimus Prime at P&Q', an AI agent (Microsoft Copilot Studio) over our Quality Management System and ${f("workInstructions", t)} work instructions for ${f("agentUsers", t)} global users, cutting query and review time by ${f("agentTimeCut", t)}.`,
    ],
  },
  {
    id: "scheduler",
    title: "Team Leader / Coordinator & Master Scheduler, Supply Planning",
    company: "Tetra Pak",
    location: identity.workplace,
    start: "2021-10",
    end: "2025-09",
    period: "Oct 2021 - Sep 2025",
    lesson: "Leading people is its own supply chain: coordinating a team across borders while keeping supply intact under pressure.",
    highlights: (t) => [
      `Led a cross-functional planning team of ${f("teamBefore", t)} (from May 2024) across Sweden, Italy and China, resolving ${f("deviationsPerMonth", t)} critical planning deviations monthly across a capital-equipment product scope worth ${f("revenueScope", t)} in annual revenue.`,
      `Owned mid-term master scheduling for ${f("keyProducts", t)} key products across ${f("countriesPlanned", t)} countries, pacing ${f("factories", t)} internal factories and ${f("externalSuppliers", t)} external suppliers in Sweden, Italy, Portugal, Austria, China and the USA.`,
      `Lifted supply availability from ${f("availabilityFrom", t)} to ${f("availabilityTo", t)} through the semiconductor shortage via scenario planning and rapid replanning.`,
      `Improved on-time delivery ${f("onTimeGain", t)} through capacity scenario modelling, master-data work, and structured demand/supply alignment.`,
    ],
  },
  {
    id: "analyst",
    title: "Jr. Supply Chain Specialist / Analyst, Global Supply Planning",
    company: "Tetra Pak",
    location: identity.workplace,
    start: "2019-09",
    end: "2021-09",
    period: "Sep 2019 - Sep 2021",
    lesson: "Where I learned the gap between what the data says and what the room decides.",
    highlights: (t) => [
      "Standardised the S&OP planning model globally across Commercial, Supply and Operations, the cross-functional foundation that fed Tetra Pak's 2020 S&OP rollout and later the IBP process.",
      `Built long-term supply plans covering ${f("longTermProducts", t)} products through introduction and phase-out cycles.`,
    ],
  },
];

export const thesis = {
  title: "Sales & Operations Planning applied to an Engineer-to-order environment: A case study at Tetra Pak",
  /** Plain-language line for the site. No names, products, interviewees or company figures. */
  publicLine:
    "Master's thesis (co-authored): how to plan supply and demand together when every machine is built to order, a case study at Tetra Pak.",
  period: "Jan 2019 - Jun 2019",
} as const;

export const earlierRoles = [
  { company: "Tetra Pak", title: "Master's Thesis Student (co-authored)", period: thesis.period, location: identity.workplace },
  { company: "Citadel Intelligent Systems", title: "Supply Chain Analyst", period: "Jun 2018 - Aug 2018", location: "Bangalore" },
  { company: "Jigsaw Thinking", title: "Creativity Lead", period: "Aug 2017", location: "Bangalore" },
  { company: "ITC Limited", title: "Industrial Engineering Intern", period: "Jan 2017 - May 2017", location: "Bangalore" },
  { company: "SELCO Foundation", title: "Industrial Engineering Intern", period: "Aug 2016 - Nov 2016", location: "Bangalore" },
  { company: "Biz Sherpa", title: "Program Coordinator", period: "Jun 2016 - Oct 2016", location: "Bangalore" },
];

export const education = [
  { institution: "LTH, Lund University", degree: "M.Sc. Logistics & Supply Chain Management", period: "2017 - 2019" },
  { institution: "R. V. College of Engineering, Bangalore", degree: "B.Eng. Industrial Engineering & Management", period: "2013 - 2017" },
];

/** Verified line by line by Poornajith, 30 Oct 2026. */
export const competencies = [
  { area: "Supply & Production Planning", detail: "IBP/S&OP, mid- and short-term planning, scenario modelling" },
  { area: "Purchasing & Sourcing", detail: "Operational purchasing, supplier and PO management, delivery expediting, sourcing strategy" },
  { area: "Team Leadership", detail: "People development, budget ownership, performance management, KPI design" },
  { area: "Process Improvement", detail: "WCM/LEAN, root-cause analysis, continuous improvement" },
  { area: "Systems & Data", detail: "SAP ECC, SAP IBP, Microsoft Copilot Studio, Power BI, Excel, Claude Code, Codex, GitHub" },
  { area: "Cross-functional Collaboration", detail: "Commercial, finance, procurement, suppliers" },
];

/** DE&I Europe panelist and Culture Champion. Confirmed by year only; no months recorded. */
export const dei = {
  title: "DE&I Europe Panelist & Culture Champion",
  org: "Tetra Pak",
  start: "2022",
  end: "2025",
  period: "2022 - 2025",
} as const;

// ---------------------------------------------------------------------------
// Projects

export type ProjectStatus = "live" | "wip" | "planned" | "paused";

export const projects: { id: string; name: string; status: ProjectStatus; description: string }[] = [
  { id: "shettysdesk", name: "ShettysDesk.com", status: "wip", description: "This website. Built with Claude Code, Next.js and Tailwind." },
  { id: "workflow", name: "Shetty's Desk workflow", status: "wip", description: "The LinkedIn content workflow behind Shetty's Desk, built as a product." },
  { id: "die-with-zero", name: "Die with Zero Planner", status: "wip", description: "Interactive financial planner for Sweden, based on the book by Bill Perkins." },
  { id: "journey-lab", name: "Product Journey Lab", status: "wip", description: "3D walkthroughs of how everyday products move through a supply chain." },
  { id: "twin-lab", name: "Supply Chain Twin Lab", status: "planned", description: "A 3D supply chain game where you run a network for a shift and watch the KPIs move." },
  { id: "bucket-list", name: "Bucket List Compiler", status: "planned", description: "A tool to collect and organize life experiences worth having." },
  { id: "command", name: "Supply Chain Command", status: "paused", description: "A hidden 3D simulation of five sites over one shift. Separate build, paused." },
];

export const projectStatus = (id: string) => projects.find((p) => p.id === id)?.status;

// ---------------------------------------------------------------------------
// Voice

export const tagline = "I break down how supply chains actually work. One real topic at a time, for anyone curious enough to ask why.";
export const brandLine = "Supply chain, one breakdown at a time.";
