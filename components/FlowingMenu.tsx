"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface FlowingMenuItem {
  title: string;
  period: string;
  location: string;
  lesson: string;
}

interface FlowingMenuProps {
  items: FlowingMenuItem[];
}

const accentColors = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-1",
];

const accentTextColors = [
  "text-chart-1",
  "text-chart-2",
  "text-chart-3",
  "text-chart-4",
  "text-chart-5",
  "text-chart-1",
];

function MarqueeText({ text, className }: { text: string; className?: string }) {
  return (
    <div className="overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className={`mr-8 ${className}`}>{text}</span>
        <span className={`mr-8 ${className}`}>{text}</span>
        <span className={`mr-8 ${className}`}>{text}</span>
        <span className={`mr-8 ${className}`}>{text}</span>
      </div>
    </div>
  );
}

export default function FlowingMenu({ items }: FlowingMenuProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {items.map((item, i) => {
        const isActive = activeIndex === i;
        const accent = accentColors[i % accentColors.length];
        const accentText = accentTextColors[i % accentTextColors.length];

        return (
          <motion.div
            key={item.title}
            layout={!prefersReducedMotion}
            className={`relative border-b border-border last:border-b-0 cursor-pointer transition-colors ${
              isActive ? "bg-background/50" : "hover:bg-background/30"
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => setActiveIndex(isActive ? null : i)}
          >
            {/* Accent bar */}
            <motion.div
              className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isActive ? 1 : 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
            />

            <div className="px-5 py-4 pl-6">
              {/* Title row */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                {isActive && !prefersReducedMotion ? (
                  <MarqueeText
                    text={item.title}
                    className={`text-lg font-semibold ${accentText}`}
                  />
                ) : (
                  <h4 className={`text-lg font-semibold transition-colors ${
                    isActive ? accentText : "text-foreground"
                  }`}>
                    {item.title}
                  </h4>
                )}
                <span className="shrink-0 text-sm text-muted-foreground">
                  {item.period} &middot; {item.location}
                </span>
              </div>

              {/* Expandable lesson */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed italic">
                      {item.lesson}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
