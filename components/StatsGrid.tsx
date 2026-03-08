"use client";

import Link from "next/link";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { value: 7, suffix: "+", label: "Years in supply chain", color: "text-chart-1" },
  { value: 5, suffix: "", label: "Articles published", color: "text-chart-2" },
  { value: 47, suffix: "%", label: "Transport & Logistics", color: "text-chart-3" },
  { value: 38, suffix: "%", label: "Senior & Director-level", color: "text-chart-4" },
];

export default function StatsGrid() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">
        My numbers
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className={`text-2xl font-bold ${stat.color}`}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <Link
        href="/experience"
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:gap-2.5 transition-all"
      >
        View experience
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </section>
  );
}
