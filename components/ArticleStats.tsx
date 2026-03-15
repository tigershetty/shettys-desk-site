"use client";

import CountUp from "./CountUp";
import { Eye, Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";

interface Stats {
  impressions: number;
  reactions: number;
  comments: number;
  reposts: number;
  saves: number;
}

const statConfig = [
  {
    key: "impressions" as const,
    label: "Impressions",
    Icon: Eye,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    key: "reactions" as const,
    label: "Reactions",
    Icon: Heart,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    key: "comments" as const,
    label: "Comments",
    Icon: MessageCircle,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    key: "reposts" as const,
    label: "Reposts",
    Icon: Repeat2,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    key: "saves" as const,
    label: "Saves",
    Icon: Bookmark,
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
];

export default function ArticleStats({ stats }: { stats: Stats }) {
  return (
    <div className="mt-10 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
        LinkedIn Performance
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {statConfig.map((stat, i) => {
          const value = stats[stat.key];
          return (
            <div
              key={stat.key}
              className="flex flex-col items-center rounded-xl border border-border/50 bg-background/50 p-3 text-center transition-all hover:border-border hover:shadow-sm"
            >
              <div
                className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <CountUp
                to={value}
                duration={1.8}
                delay={i * 0.1}
                separator=","
                className={`text-xl font-bold tabular-nums ${stat.color}`}
              />
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
