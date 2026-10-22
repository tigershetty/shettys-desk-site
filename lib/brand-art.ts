import type { ArtRecipe } from "@/components/ui/glass-folder-cards";

// Generated folder artwork in the Shetty's Desk identity palette: indigo as
// the lead, teal and amber as the secondary accents, ink for depth.
export const brandArt = {
  indigo: {
    style: "streak",
    colors: ["#eef2ff", "#c7d2fe", "#818cf8", "#4f46e5", "#1e1b4b", "#6366f1", "#e0e7ff"],
    scale: 0.7,
    warp: 1.5,
    angle: -0.6,
    gloss: 0.22,
    veins: 0,
  },
  teal: {
    style: "streak",
    colors: ["#f0fdfa", "#99f6e4", "#2dd4bf", "#0f766e", "#134e4a", "#14b8a6", "#ecfeff"],
    scale: 0.7,
    warp: 1.6,
    angle: 0.4,
    gloss: 0.22,
    veins: 0,
  },
  amber: {
    style: "marble",
    colors: ["#fffbeb", "#fde68a", "#f59e0b", "#b45309", "#1e1b4b", "#4f46e5", "#fef3c7"],
    scale: 0.7,
    warp: 3,
    angle: 1.2,
    gloss: 0.45,
    veins: 0.25,
  },
  ink: {
    style: "marble",
    colors: ["#0b0b12", "#1e1b4b", "#312e81", "#0f172a", "#4f46e5", "#a5b4fc", "#f8fafc"],
    scale: 0.65,
    warp: 3.2,
    angle: -0.4,
    gloss: 0.5,
    veins: 0.4,
  },
} satisfies Record<string, ArtRecipe>;

export type BrandArt = keyof typeof brandArt;
