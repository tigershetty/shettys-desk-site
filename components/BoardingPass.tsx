"use client";

import { motion } from "framer-motion";

interface Pass {
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  date: string;
  reason: string;
  seat: string;
  gate: string;
  accent: string;
}

const passes: Pass[] = [
  {
    from: "Bangalore",
    fromCode: "BLR",
    to: "Malmö",
    toCode: "MMX",
    date: "AUG 2017",
    reason: "Master's at Lund University",
    seat: "1A",
    gate: "LU",
    accent: "bg-chart-1",
  },
  {
    from: "Academia",
    fromCode: "MSC",
    to: "Tetra Pak",
    toCode: "TPK",
    date: "JAN 2019",
    reason: "Thesis student → full time",
    seat: "2B",
    gate: "TP",
    accent: "bg-chart-2",
  },
  {
    from: "Analyst",
    fromCode: "ANA",
    to: "Scheduler",
    toCode: "MPS",
    date: "OCT 2021",
    reason: "180M+ EUR COGS, 6 countries",
    seat: "3C",
    gate: "SC",
    accent: "bg-chart-3",
  },
  {
    from: "Individual",
    fromCode: "IC",
    to: "Leader",
    toCode: "MGR",
    date: "MAY 2024",
    reason: "Team Coordinator, then Manager",
    seat: "4D",
    gate: "PL",
    accent: "bg-chart-4",
  },
  {
    from: "Operations",
    fromCode: "OPS",
    to: "Content",
    toCode: "DSK",
    date: "2025",
    reason: "Shetty's Desk is born",
    seat: "5E",
    gate: "SD",
    accent: "bg-primary",
  },
];

function DashedLine() {
  return (
    <div className="flex flex-col items-center gap-0.5 mx-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-1 w-px bg-border" />
      ))}
    </div>
  );
}

function SinglePass({ pass, index }: { pass: Pass; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex min-w-[280px] max-w-[320px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-sm"
    >
      {/* Accent bar */}
      <div className={`h-1 w-full ${pass.accent}`} />

      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
          Boarding Pass
        </p>
        <p className="text-[10px] font-mono text-muted-foreground/50">{pass.date}</p>
      </div>

      {/* Route */}
      <div className="flex items-center justify-center px-4 pb-3">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">{pass.fromCode}</p>
          <p className="text-[10px] text-muted-foreground">{pass.from}</p>
        </div>

        <div className="mx-4 flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full border border-muted-foreground/30" />
          <div className="h-px w-10 bg-muted-foreground/20" />
          <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          <div className="h-px w-10 bg-muted-foreground/20" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        </div>

        <div className="text-center">
          <p className="text-xl font-bold text-foreground">{pass.toCode}</p>
          <p className="text-[10px] text-muted-foreground">{pass.to}</p>
        </div>
      </div>

      {/* Tear line */}
      <div className="relative mx-0 border-t border-dashed border-border" />

      {/* Details row */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/50">Reason</p>
          <p className="text-xs text-foreground">{pass.reason}</p>
        </div>
        <div className="flex gap-3 text-center">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/50">Seat</p>
            <p className="text-xs font-mono text-foreground">{pass.seat}</p>
          </div>
          <div>
            <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/50">Gate</p>
            <p className="text-xs font-mono text-foreground">{pass.gate}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BoardingPass() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-foreground">The journey so far</h2>
          <p className="text-xs text-muted-foreground">Each stop taught something different</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
        {passes.map((pass, i) => (
          <SinglePass key={pass.date} pass={pass} index={i} />
        ))}
      </div>
    </div>
  );
}
