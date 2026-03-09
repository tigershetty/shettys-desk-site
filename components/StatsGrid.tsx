"use client";

import Link from "next/link";
import { Briefcase, FileText, TrendingUp, Users } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  {
    value: 7,
    suffix: "+",
    label: "Years in supply chain",
    color: "text-chart-1",
    iconBg: "bg-chart-1/10",
    iconColor: "text-chart-1",
    Icon: Briefcase,
    visual: "timeline",
  },
  {
    value: 5,
    suffix: "",
    label: "Articles published",
    color: "text-chart-2",
    iconBg: "bg-chart-2/10",
    iconColor: "text-chart-2",
    Icon: FileText,
    visual: "dots",
  },
  {
    value: 47,
    suffix: "%",
    label: "Transport & Logistics",
    color: "text-chart-3",
    iconBg: "bg-chart-3/10",
    iconColor: "text-chart-3",
    Icon: TrendingUp,
    visual: null,
  },
  {
    value: 38,
    suffix: "%",
    label: "Senior & Director-level",
    color: "text-chart-4",
    iconBg: "bg-chart-4/10",
    iconColor: "text-chart-4",
    Icon: Users,
    visual: null,
  },
];

function DotTimeline() {
  return (
    <div className="mt-2 flex items-center gap-1">
      <span className="text-[9px] text-muted-foreground/60">2019</span>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i < 6 ? "bg-chart-1/30" : "bg-chart-1"
            }`}
          />
        ))}
      </div>
      <span className="text-[9px] text-muted-foreground/60">Now</span>
    </div>
  );
}

function ArticleDots() {
  return (
    <div className="mt-2 flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-sm bg-chart-2/40"
        />
      ))}
    </div>
  );
}

export default function StatsGrid() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">
        My numbers
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/50 p-4 transition-all hover:border-border hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <p className={`text-2xl font-bold ${stat.color}`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.iconBg}`}>
                <stat.Icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            {stat.visual === "timeline" && <DotTimeline />}
            {stat.visual === "dots" && <ArticleDots />}
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
