"use client";

import { useState } from "react";
import radarData from "@/data/radar.json";

const radarColors = [
  "border-chart-1/30 bg-chart-1/8 hover:bg-chart-1/15 hover:border-chart-1/50",
  "border-chart-2/30 bg-chart-2/8 hover:bg-chart-2/15 hover:border-chart-2/50",
  "border-chart-3/30 bg-chart-3/8 hover:bg-chart-3/15 hover:border-chart-3/50",
  "border-chart-4/30 bg-chart-4/8 hover:bg-chart-4/15 hover:border-chart-4/50",
  "border-chart-5/30 bg-chart-5/8 hover:bg-chart-5/15 hover:border-chart-5/50",
];

export default function RadarSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-1 text-sm font-semibold text-foreground uppercase tracking-wider">
        Supply Chain Radar
      </h2>
      <p className="mb-3 text-xs text-muted-foreground">
        What I&apos;m currently exploring
      </p>
      <div className="flex flex-wrap gap-2">
        {radarData.map((item, i) => (
          <button
            key={item.topic}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className={`rounded-xl border px-3 py-1.5 text-left text-sm transition-all duration-300 ${radarColors[i]} ${
              expanded === i ? "basis-full" : ""
            }`}
          >
            <p className="font-medium text-foreground text-xs">{item.topic}</p>
            {expanded === i && (
              <p className="mt-1.5 text-xs text-muted-foreground italic leading-relaxed">
                {item.commentary}
              </p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
