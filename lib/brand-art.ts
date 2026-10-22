import type { ArtRecipe } from "@/components/ui/glass-folder-cards";

// Folder artwork in the Shetty's Desk palette. Kept calm on purpose: soft,
// long streaks of one brand colour over a pale field, so the folder reads
// as indigo, teal or amber rather than as a busy picture.
export const brandArt = {
  indigo: {
    style: "streak",
    colors: ["#f5f6ff", "#e0e4ff", "#c7cdfb", "#8b93f0", "#4f46e5", "#eef0ff"],
    scale: 0.85,
    warp: 1.1,
    angle: -0.5,
    gloss: 0.14,
    veins: 0,
  },
  teal: {
    style: "streak",
    colors: ["#f2fbf9", "#d5f3ec", "#a7e5d8", "#4fbfa9", "#14b8a6", "#eefaf7"],
    scale: 0.85,
    warp: 1.1,
    angle: 0.4,
    gloss: 0.14,
    veins: 0,
  },
  amber: {
    style: "streak",
    colors: ["#fffaf0", "#fdecc8", "#f9d48a", "#f2b441", "#f59e0b", "#fff6e2"],
    scale: 0.85,
    warp: 1.1,
    angle: 0.9,
    gloss: 0.14,
    veins: 0,
  },
  ink: {
    style: "streak",
    colors: ["#0c0c1d", "#17163a", "#24226a", "#3b37a8", "#4f46e5", "#12112b"],
    scale: 0.85,
    warp: 1.1,
    angle: -0.4,
    gloss: 0.2,
    veins: 0,
  },
} satisfies Record<string, ArtRecipe>;

export type BrandArt = keyof typeof brandArt;
