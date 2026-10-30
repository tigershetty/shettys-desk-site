// The Experience page's data, built from data/profile.ts. Do not type facts here.

import {
  competencies,
  earlierRoles,
  education,
  identity,
  tetraPakRoles,
  yearsAtTetraPak,
  type Tier,
} from "@/data/profile";

export function buildExperience(tier: Tier = "web", now: Date = new Date()) {
  const tenure = `${yearsAtTetraPak(now)}+ years`;
  return {
    summary: `Supply chain planning leader with ${tenure} at ${identity.employer}, across global replenishment operations, master scheduling, and cross-functional S&OP/IBP execution. I lead teams and budgets, and I build the automation and AI agents that take the repetitive work off the table. Beyond the day job I run Shetty's Desk, an agentic supply-chain content workflow built on Claude Code.`,
    resumeUrl: identity.linkedin,
    competencies,
    primary: [
      {
        company: identity.employer,
        totalYears: tenure,
        roles: tetraPakRoles.map((r) => ({
          title: r.title,
          period: r.period,
          location: r.location,
          lesson: r.lesson,
          highlights: r.highlights(tier),
        })),
      },
    ],
    earlier: earlierRoles,
    education,
    languages: [...identity.languages],
  };
}

const experience = buildExperience("web");
export default experience;
