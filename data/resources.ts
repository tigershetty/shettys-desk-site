export type Resource = {
  slug: string;
  title: string;
  eyebrow: string;
  promise: string;
  description: string;
  version: string;
  updated: string;
  readTime: string;
  visual: string;
  motion: string;
  tags: string[];
  outputs: string[];
};

export const resources: Resource[] = [
  {
    slug: "demand-sensing-router",
    title: "Demand Sensing Router",
    eyebrow: "AI for Supply Chain",
    promise: "Route each SKU to the planning cadence its evidence deserves.",
    description:
      "A planner-reviewable Claude workflow for separating frequent sensing, monthly planning, and special-method exceptions without treating demand sensing as the answer for every SKU.",
    version: "1.0.0",
    updated: "July 15, 2026",
    readTime: "10 min setup",
    visual: "/resources/demand-sensing-router/visual.png",
    motion: "/resources/demand-sensing-router/motion.gif",
    tags: ["Claude", "Demand planning", "Agent skill"],
    outputs: [
      "Routing board",
      "Route-change log",
      "Data-quality exceptions",
      "Demand-review brief",
    ],
  },
];

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}
