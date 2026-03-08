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
      className="w-full rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {number}
          </span>
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        <span className="text-muted-foreground transition-transform">{open ? "-" : "+"}</span>
      </div>
      {open && (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </button>
  );
}
