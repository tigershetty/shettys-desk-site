"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FolderColor = "indigo" | "amber" | "teal" | "dark";
type FolderSize = "sm" | "md" | "lg";

type FolderProps = {
  color?: FolderColor;
  size?: FolderSize;
  label?: string;
  href?: string;
  className?: string;
};

const MotionLink = motion.create(Link);

const sizeMap: Record<
  FolderSize,
  {
    container: string;
    tabLeft: string;
    tabRight: string;
    tabBridge: string;
    flapBody: string;
    papers: string;
    paperOffset: string;
    paperH: string;
    paperContent: string;
    label: string;
    hoverY: number;
    hoverBackY: number;
  }
> = {
  sm: {
    container: "size-24 rounded-[24px]",
    tabLeft: "w-9 h-3 rounded-tl-lg",
    tabRight: "w-2 h-3 rounded-tr-[24px]",
    tabBridge: "w-2 h-2",
    flapBody: "h-9",
    papers: "inset-x-5 top-2",
    paperOffset: "top-1",
    paperH: "h-16",
    paperContent: "pt-2.5 px-2.5 space-y-1",
    label: "bottom-2 left-2 text-[9px] py-0.5 px-1.5",
    hoverY: -3,
    hoverBackY: -4,
  },
  md: {
    container: "size-32 rounded-[32px]",
    tabLeft: "w-12 h-4 rounded-tl-lg",
    tabRight: "w-2.5 h-4 rounded-tr-[32px]",
    tabBridge: "w-2.5 h-2.5",
    flapBody: "h-12",
    papers: "inset-x-6 top-3",
    paperOffset: "top-1.5",
    paperH: "h-24",
    paperContent: "pt-3 px-3 space-y-1",
    label: "bottom-3 left-3 text-[10px] py-0.5 px-1.5",
    hoverY: -3,
    hoverBackY: -5,
  },
  lg: {
    container: "size-40 rounded-[40px]",
    tabLeft: "w-16 h-5.5 rounded-tl-xl",
    tabRight: "w-3.25 h-5.5 rounded-tr-[40px]",
    tabBridge: "w-3.25 h-3.25",
    flapBody: "h-16",
    papers: "inset-x-8 top-4",
    paperOffset: "top-2",
    paperH: "h-30",
    paperContent: "pt-4 px-4 space-y-1.5",
    label: "bottom-4 left-4 text-xs py-1 px-2",
    hoverY: -4,
    hoverBackY: -6,
  },
};

// Reskinned to the Shetty's brand palette (indigo / amber / teal / dark).
const colorMap: Record<
  FolderColor,
  {
    folder: string;
    flap: string;
    paperBack: string;
    paperFront: string;
    paperLine: string;
    paperBorder: string;
    labelBg: string;
    folderBorder: string;
  }
> = {
  indigo: {
    folder: "from-[#6366f1] to-[#4f46e5]",
    flap: "bg-[#a5b4fc]/50",
    paperBack: "bg-[#c7d2fe]/70",
    paperFront: "bg-[#eef2ff]",
    paperLine: "bg-[#a5b4fc]/60",
    paperBorder: "border-[#c7d2fe]",
    labelBg: "bg-[#312e81]/25",
    folderBorder: "border-white/30",
  },
  amber: {
    folder: "from-[#fbbf24] to-[#f59e0b]",
    flap: "bg-[#fcd34d]/50",
    paperBack: "bg-[#fde68a]/70",
    paperFront: "bg-[#fffbeb]",
    paperLine: "bg-[#fbbf24]/60",
    paperBorder: "border-[#fde68a]",
    labelBg: "bg-[#78350f]/25",
    folderBorder: "border-white/30",
  },
  teal: {
    folder: "from-[#2dd4bf] to-[#14b8a6]",
    flap: "bg-[#5eead4]/50",
    paperBack: "bg-[#99f6e4]/70",
    paperFront: "bg-[#f0fdfa]",
    paperLine: "bg-[#5eead4]/60",
    paperBorder: "border-[#99f6e4]",
    labelBg: "bg-[#134e4a]/25",
    folderBorder: "border-white/30",
  },
  dark: {
    folder: "from-neutral-800 to-neutral-900",
    flap: "bg-neutral-600/50",
    paperBack: "bg-neutral-500/60",
    paperFront: "bg-neutral-100",
    paperLine: "bg-neutral-300",
    paperBorder: "border-neutral-500",
    labelBg: "bg-white/10",
    folderBorder: "border-white/10",
  },
};

const spring = { type: "spring", stiffness: 300, damping: 22 } as const;

export const Folder = ({
  color = "indigo",
  size = "lg",
  label,
  href = "#",
  className,
}: FolderProps) => {
  const c = colorMap[color];
  const s = sizeMap[size];

  return (
    <MotionLink
      href={href}
      aria-label={label ? `${label} folder` : "Folder"}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate="rest"
      variants={{ rest: {}, hover: {} }}
      className={cn(
        "relative block cursor-pointer overflow-hidden border-t-2 bg-linear-to-b outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        s.container,
        c.folder,
        c.folderBorder,
        className
      )}
    >
      {/* Front flap */}
      <div className="absolute right-0 bottom-0 left-0 z-20">
        <div className="flex items-end">
          <div className={cn(s.tabLeft, "backdrop-blur-sm", c.flap)} />
          <div className={cn(s.tabRight, "backdrop-blur-sm", c.flap)} />
          <div
            className={cn(
              s.tabBridge,
              "mask-[radial-gradient(200%_200%_at_100%_0%,transparent_50%,black_50%)]",
              c.flap
            )}
          />
        </div>
        <div
          className={cn(s.flapBody, "rounded-tr-xl backdrop-blur-sm", c.flap)}
        />
      </div>

      {/* Papers */}
      <div className={cn("absolute z-10", s.papers)}>
        <motion.div
          variants={{
            rest: { rotate: 4, y: 0, transition: spring },
            hover: { rotate: 6, y: s.hoverBackY, transition: spring },
          }}
          style={{ originY: 1 }}
          className={cn(
            "absolute inset-x-0 rounded-2xl",
            s.paperOffset,
            s.paperH,
            c.paperBack
          )}
        />
        <motion.div
          variants={{
            rest: { rotate: -4, y: 0, transition: spring },
            hover: { rotate: -6, y: s.hoverBackY, transition: spring },
          }}
          style={{ originY: 1 }}
          className={cn(
            "absolute inset-x-0 rounded-2xl",
            s.paperOffset,
            s.paperH,
            c.paperBack
          )}
        />
        <motion.div
          variants={{
            rest: { y: 0, transition: spring },
            hover: { y: s.hoverY, transition: spring },
          }}
          className={cn(
            "absolute inset-x-0 top-0 rounded-xl border-t",
            s.paperH,
            c.paperFront,
            c.paperBorder
          )}
        >
          <div className={s.paperContent}>
            <div className={cn("h-1 w-3/4 rounded-full", c.paperLine)} />
            <div className={cn("h-1 w-1/2 rounded-full", c.paperLine)} />
            <div className={cn("h-1 w-2/3 rounded-full", c.paperLine)} />
          </div>
        </motion.div>
      </div>

      {/* Label */}
      {label && (
        <div className={cn("absolute z-20 rounded-full", s.label, c.labelBg)}>
          <span className="font-medium text-white">{label}</span>
        </div>
      )}
    </MotionLink>
  );
};

export default Folder;
