"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import radarData from "@/data/radar.json";

/* Each item gets a unique color set + glow color for the spatial effect */
const radarItems = [
  {
    colors: "border-chart-1/30 bg-chart-1/10 hover:bg-chart-1/20 hover:border-chart-1/50",
    activeColors: "border-chart-1/50 bg-chart-1/15",
    glow: "rgba(79, 70, 229, 0.15)",
    dotColor: "bg-chart-1",
  },
  {
    colors: "border-chart-2/30 bg-chart-2/10 hover:bg-chart-2/20 hover:border-chart-2/50",
    activeColors: "border-chart-2/50 bg-chart-2/15",
    glow: "rgba(20, 184, 166, 0.15)",
    dotColor: "bg-chart-2",
  },
  {
    colors: "border-chart-3/30 bg-chart-3/10 hover:bg-chart-3/20 hover:border-chart-3/50",
    activeColors: "border-chart-3/50 bg-chart-3/15",
    glow: "rgba(245, 158, 11, 0.15)",
    dotColor: "bg-chart-3",
  },
  {
    colors: "border-chart-4/30 bg-chart-4/10 hover:bg-chart-4/20 hover:border-chart-4/50",
    activeColors: "border-chart-4/50 bg-chart-4/15",
    glow: "rgba(236, 72, 153, 0.15)",
    dotColor: "bg-chart-4",
  },
  {
    colors: "border-chart-5/30 bg-chart-5/10 hover:bg-chart-5/20 hover:border-chart-5/50",
    activeColors: "border-chart-5/50 bg-chart-5/15",
    glow: "rgba(34, 197, 94, 0.15)",
    dotColor: "bg-chart-5",
  },
];

/* Staggered vertical offsets to break the flat grid feel */
const spatialOffsets = [0, 12, 4, 16, 6];
/* Varying animation durations for organic feel */
const floatDurations = [3.2, 2.8, 3.5, 2.6, 3.0];
const floatDelays = [0, 0.6, 1.2, 0.3, 0.9];
/* Varying pill sizes */
const sizeClasses = ["px-3.5 py-2", "px-3 py-1.5", "px-4 py-2", "px-3 py-1.5", "px-3.5 py-2"];

export default function RadarSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const hasExpanded = expanded !== null;

  return (
    <section
      className="rounded-3xl border border-border bg-card p-5 shadow-sm"
    >
      <h2 className="mb-1 text-sm font-semibold text-foreground uppercase tracking-wider">
        Supply Chain Radar
      </h2>
      <p className="mb-4 text-xs text-muted-foreground">
        What I&apos;m currently exploring
      </p>

      <div className="flex flex-wrap items-start gap-2.5">
        {radarData.map((item, i) => {
          const isExpanded = expanded === i;
          const style = radarItems[i];

          return (
            <motion.button
              key={item.topic}
              layout="position"
              animate={{
                y: hasExpanded ? 0 : [0, -4, 0],
                marginTop: hasExpanded ? 0 : spatialOffsets[i],
              }}
              transition={{
                y: hasExpanded
                  ? { duration: 0.25, ease: "easeOut" }
                  : {
                      duration: floatDurations[i],
                      repeat: Infinity,
                      delay: floatDelays[i],
                      ease: "easeInOut",
                    },
                marginTop: { duration: 0.25, ease: "easeOut" },
                layout: { duration: 0.25, ease: [0.25, 0.4, 0, 1] },
              }}
              onClick={() => setExpanded(isExpanded ? null : i)}
              className={`rounded-2xl border text-left transition-colors duration-200 ${sizeClasses[i]} ${
                isExpanded
                  ? `basis-full ${style.activeColors}`
                  : style.colors
              }`}
              style={{
                boxShadow: isExpanded
                  ? `0 4px 20px ${style.glow}, 0 0 0 1px ${style.glow}`
                  : "none",
              }}
            >
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${style.dotColor} shrink-0`} />
                <p className="font-medium text-foreground text-xs">{item.topic}</p>
              </div>
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pt-2 text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
