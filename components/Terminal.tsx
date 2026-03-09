"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

export default function Terminal() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-foreground p-3 font-mono text-xs">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
      </div>
      <div className="space-y-1 text-primary-foreground">
        <p className="text-primary-foreground/60">~/shettys-desk $ git log --oneline</p>
        <p>v3 &lt;- live</p>
        <p>v4 &lt;- in progress</p>
        {expanded && (
          <>
            <p className="text-primary-foreground/70">adding new article: US-Iran Hormuz</p>
            <p className="text-primary-foreground/70">building shettysdesk.com</p>
          </>
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center gap-1 text-primary-foreground/50 transition-colors hover:text-primary-foreground/80"
      >
        <ExternalLink className="h-3 w-3" />
        <span>{expanded ? "hide details" : "view details"}</span>
      </button>
    </div>
  );
}
