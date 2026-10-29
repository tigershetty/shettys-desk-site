"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&·-";

/**
 * Departure-board text: each character cycles through glyphs before landing,
 * left to right. Re-flaps when `text` changes. Reduced motion shows the final
 * text immediately. Screen readers always get the real text.
 */
export default function SplitFlap({
  text,
  className,
  cellClassName,
  speed = 28,
}: {
  text: string;
  className?: string;
  cellClassName?: string;
  speed?: number;
}) {
  const target = text.toUpperCase();
  const [shown, setShown] = useState(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(target);
      return;
    }
    let tick = 0;
    const settleAt = (i: number) => 4 + i * 1.4;
    const id = window.setInterval(() => {
      tick++;
      let done = true;
      const next = target
        .split("")
        .map((ch, i) => {
          if (ch === " " || tick >= settleAt(i)) return ch;
          done = false;
          return GLYPHS[(tick * 7 + i * 13) % GLYPHS.length];
        })
        .join("");
      setShown(next);
      if (done) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [target, speed]);

  // Group cells by word so narrow screens wrap between words, not letters.
  const words: { start: number; length: number }[] = [];
  target.split(" ").reduce((offset, word) => {
    words.push({ start: offset, length: word.length });
    return offset + word.length + 1;
  }, 0);

  return (
    <span className={cn("inline-flex flex-wrap gap-x-[0.5em] gap-y-[3px]", className)}>
      <span className="sr-only">{text}</span>
      {words.map(({ start, length }) => (
        <span key={start} aria-hidden className="inline-flex gap-[2px]">
          {shown
            .slice(start, start + length)
            .split("")
            .map((ch, i) => (
              <span
                key={i}
                className={cn(
                  "relative inline-flex min-w-[0.72em] justify-center overflow-hidden rounded-[3px] bg-neutral-900 px-[0.08em] font-mono font-semibold leading-[1.35] text-amber-300",
                  "after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/70",
                  cellClassName
                )}
              >
                {ch}
              </span>
            ))}
        </span>
      ))}
    </span>
  );
}
