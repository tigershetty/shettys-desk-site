"use client";

import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  Scissors,
  Palette,
  Send,
  BarChart3,
} from "lucide-react";

const accentColors = [
  { bg: "bg-indigo-500/10", text: "text-indigo-600", border: "border-indigo-500/20", icon: "text-indigo-500" },
  { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/20", icon: "text-emerald-500" },
  { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20", icon: "text-amber-500" },
  { bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-500/20", icon: "text-rose-500" },
  { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20", icon: "text-blue-500" },
  { bg: "bg-orange-500/10", text: "text-orange-600", border: "border-orange-500/20", icon: "text-orange-500" },
];

const icons = [HelpCircle, Search, Scissors, Palette, Send, BarChart3];

export default function PhaseCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  const colors = accentColors[(number - 1) % accentColors.length];
  const Icon = icons[(number - 1) % icons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: (number - 1) * 0.1,
        ease: [0.25, 0.4, 0, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`rounded-xl border ${colors.border} bg-card p-6 transition-shadow hover:shadow-md hover:shadow-primary/5`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}
        >
          <Icon className={`h-5 w-5 ${colors.icon}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono ${colors.text}`}>
              0{number}
            </span>
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
