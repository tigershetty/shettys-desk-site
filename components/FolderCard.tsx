"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type FolderColor = "indigo" | "amber" | "teal" | "dark";

type FolderCardProps = {
  label: string;
  color?: FolderColor;
  children: React.ReactNode;
  className?: string;
};

const tones: Record<
  FolderColor,
  { tab: string; body: string; shadow: string; back: string }
> = {
  indigo: {
    tab: "bg-linear-to-b from-[#6366f1] to-[#4f46e5] text-white",
    body: "border-[#4f46e5]/15 bg-linear-to-b from-[#eef2ff] to-card",
    shadow: "shadow-[0_18px_44px_-20px_rgba(79,70,229,0.5)]",
    back: "bg-[#4f46e5]/10",
  },
  amber: {
    tab: "bg-linear-to-b from-[#fbbf24] to-[#f59e0b] text-[#3a2a06]",
    body: "border-[#f59e0b]/20 bg-linear-to-b from-[#fffbeb] to-card",
    shadow: "shadow-[0_18px_44px_-20px_rgba(245,158,11,0.5)]",
    back: "bg-[#f59e0b]/12",
  },
  teal: {
    tab: "bg-linear-to-b from-[#2dd4bf] to-[#14b8a6] text-white",
    body: "border-[#14b8a6]/20 bg-linear-to-b from-[#f0fdfa] to-card",
    shadow: "shadow-[0_18px_44px_-20px_rgba(20,184,166,0.5)]",
    back: "bg-[#14b8a6]/12",
  },
  dark: {
    tab: "bg-linear-to-b from-neutral-700 to-neutral-900 text-white",
    body: "border-border bg-linear-to-b from-neutral-50 to-card",
    shadow: "shadow-[0_18px_44px_-20px_rgba(0,0,0,0.45)]",
    back: "bg-foreground/10",
  },
};

/**
 * Bento panel styled as a refined file folder: a soft layered "paper" peeking
 * behind, a gradient tab, and a tinted card body with a deep, soft shadow.
 * Lifts on hover. Holds arbitrary content.
 */
export default function FolderCard({
  label,
  color = "indigo",
  children,
  className,
}: FolderCardProps) {
  const tone = tones[color];

  return (
    <motion.div
      initial={false}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className={cn("relative flex flex-col", className)}
    >
      {/* Layered paper behind for depth */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 translate-x-1.5 translate-y-2 rounded-3xl",
          tone.back
        )}
      />

      {/* Tab */}
      <div
        className={cn(
          "relative z-10 -mb-px ml-5 inline-flex w-fit items-center gap-2 self-start rounded-t-2xl px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] shadow-sm",
          tone.tab
        )}
      >
        <svg
          className="h-3.5 w-3.5 opacity-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
          />
        </svg>
        {label}
      </div>

      {/* Body */}
      <div
        className={cn(
          "relative z-10 flex-1 rounded-3xl rounded-tl-none border p-5",
          tone.body,
          tone.shadow
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
