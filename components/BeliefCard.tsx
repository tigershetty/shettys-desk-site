"use client";

import { useState } from "react";

export default function BeliefCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full rounded-xl border border-brand-border bg-brand-card p-5 text-left transition-colors hover:border-brand-accent/30"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-brand-white">
          &ldquo;{title}&rdquo;
        </h3>
        <span className="ml-4 text-brand-muted">{open ? "-" : "+"}</span>
      </div>
      {open && (
        <p className="mt-3 text-sm text-brand-muted leading-relaxed">{body}</p>
      )}
    </button>
  );
}
