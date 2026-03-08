"use client";

import { useState } from "react";

export default function PhaseCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full rounded-xl border border-brand-border bg-brand-card p-5 text-left transition-colors hover:border-brand-accent/30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-accent/10 text-xs font-bold text-brand-accent">
            {number}
          </span>
          <h3 className="font-medium text-brand-white">{title}</h3>
        </div>
        <span className="text-brand-muted transition-transform">{open ? "-" : "+"}</span>
      </div>
      {open && (
        <p className="mt-3 text-sm text-brand-muted leading-relaxed">
          {description}
        </p>
      )}
    </button>
  );
}
