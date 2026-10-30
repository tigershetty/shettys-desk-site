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
  motionMp4: string;
  tags: string[];
  outputs: string[];
  /** Hidden resources return 404 on every route and are listed nowhere. Files stay in git. */
  hidden?: boolean;
};

export const resources: Resource[] = [
  {
    slug: "demand-sensing-router",
    hidden: true,
    title: "Demand Sensing Router",
    eyebrow: "AI for Supply Chain",
    promise: "Route each SKU to the planning cadence its evidence deserves.",
    description:
      "A planner-reviewable Claude workflow for separating frequent sensing, monthly planning, and special-method exceptions without treating demand sensing as the answer for every SKU.",
    version: "1.2.0",
    updated: "July 15, 2026",
    readTime: "5 min first run",
    visual: "/resources/demand-sensing-router/visual.png",
    motion: "/resources/demand-sensing-router/motion.gif",
    motionMp4: "/resources/demand-sensing-router/motion.mp4",
    tags: ["Claude", "Demand planning", "Agent skill"],
    outputs: [
      "Routing board",
      "Route-change log",
      "Data-quality exceptions",
      "Demand-review brief",
      "Run manifest",
    ],
  },
];

/** Resources that may be listed and served. */
export const visibleResources = resources.filter((resource) => !resource.hidden);

/** A visible resource by slug, or undefined when it is hidden or unknown. */
export function getResource(slug: string) {
  return visibleResources.find((resource) => resource.slug === slug);
}

/** Any resource, hidden or not. For build-time metadata only. */
export function getAnyResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}
