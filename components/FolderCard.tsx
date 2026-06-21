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

const tones: Record<FolderColor, { tab: string; body: string }> = {
  indigo: {
    tab: "bg-[#4f46e5] text-white",
    body: "border-[#4f46e5]/25",
  },
  amber: {
    tab: "bg-[#f59e0b] text-[#3a2a06]",
    body: "border-[#f59e0b]/30",
  },
  teal: {
    tab: "bg-[#14b8a6] text-white",
    body: "border-[#14b8a6]/30",
  },
  dark: {
    tab: "bg-foreground text-background",
    body: "border-border",
  },
};

/**
 * A bento panel styled as a labelled file folder: a colour-coded tab on top of a
 * card body that holds arbitrary content. Lifts slightly on hover.
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
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn("flex flex-col", className)}
    >
      {/* Tab */}
      <div
        className={cn(
          "z-10 -mb-px ml-4 inline-flex w-fit items-center gap-1.5 self-start rounded-t-xl px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider",
          tone.tab
        )}
      >
        <svg
          className="h-3.5 w-3.5"
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
          "flex-1 rounded-2xl rounded-tl-none border bg-card p-5 shadow-sm",
          tone.body
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
