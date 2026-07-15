"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon, Play } from "lucide-react";

type PreviewMode = "motion" | "still";

export default function ArticleVisual({
  title,
  still,
  motion,
  width,
  height,
}: {
  title: string;
  still: string;
  motion: string | null;
  width: number;
  height: number;
}) {
  const [mode, setMode] = useState<PreviewMode>(motion ? "motion" : "still");

  return (
    <section aria-label={`${title} visual`} className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          The published artifact
        </p>
        {motion && (
          <div
            className="inline-flex rounded-lg border border-border bg-card p-1"
            aria-label="Preview format"
          >
            <button
              type="button"
              onClick={() => setMode("motion")}
              aria-pressed={mode === "motion"}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                mode === "motion"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Play className="h-3.5 w-3.5" aria-hidden />
              Motion
            </button>
            <button
              type="button"
              onClick={() => setMode("still")}
              aria-pressed={mode === "still"}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                mode === "still"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" aria-hidden />
              Still
            </button>
          </div>
        )}
      </div>

      <div className="relative mx-auto w-full max-w-[760px] overflow-hidden rounded-lg border border-border bg-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.45)]">
        {mode === "motion" && motion ? (
          // The GIF is the exact source-fidelity asset approved for the post.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={motion}
            alt={`${title} motion graphic`}
            className="block h-auto w-full"
          />
        ) : (
          <Image
            src={still}
            alt={`${title} infographic`}
            width={width}
            height={height}
            className="block h-auto w-full"
            sizes="(max-width: 768px) 100vw, 760px"
            priority
          />
        )}
      </div>
    </section>
  );
}
