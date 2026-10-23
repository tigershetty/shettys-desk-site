"use client";

import { RotateCw, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { books, coverUrl, type Book } from "@/data/books";
import { cn } from "@/lib/utils";

const ShelfScene = dynamic(() => import("./ShelfScene"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Dusting the shelf…</div>,
});

function DesignedCover({ b }: { b: Book }) {
  return (
    <div className="flex h-full w-full flex-col justify-between p-5" style={{ background: b.color, color: b.ink }}>
      <span className="h-1 w-10" style={{ background: b.ink }} />
      <div>
        <p className="text-2xl font-bold leading-tight">{b.title}</p>
        <p className="mt-2 text-sm font-medium opacity-80">{b.author}</p>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">{b.year}</p>
    </div>
  );
}

function Front({ b }: { b: Book }) {
  const [failed, setFailed] = useState(!b.isbn);
  return (
    <div className="relative h-full w-full overflow-hidden rounded-r-md rounded-l-sm bg-neutral-200 shadow-[inset_4px_0_6px_-3px_rgba(0,0,0,.35)]">
      {failed || !b.isbn ? (
        <DesignedCover b={b} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverUrl(b.isbn)} alt={`Cover of ${b.title}`} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

function Back({ b }: { b: Book }) {
  return (
    <div className="flex h-full w-full flex-col rounded-l-md rounded-r-sm p-5 shadow-[inset_-4px_0_6px_-3px_rgba(0,0,0,.35)]" style={{ background: b.color, color: b.ink }}>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] opacity-75">{b.theme}</p>
      <p className="mt-3 text-[15px] leading-relaxed">{b.summary}</p>
      <div className="mt-auto flex items-end justify-between pt-4">
        <p className="text-xs opacity-80">
          {b.author} · {b.year}
        </p>
        {b.isbn && (
          <div className="rounded-sm bg-white px-2 py-1 text-neutral-900">
            <div className="flex h-6 gap-[1.5px]">
              {b.isbn.split("").map((d, i) => (
                <span key={i} className="bg-neutral-900" style={{ width: 1 + (Number(d) % 3) }} />
              ))}
            </div>
            <p className="mt-0.5 font-mono text-[8px] tracking-wider">{b.isbn}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Preview({ b, onClose }: { b: Book; onClose: () => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="pointer-events-auto rounded-2xl border border-foreground bg-white p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,.5)] sm:p-5" role="dialog" aria-label={`${b.title} by ${b.author}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-foreground">{b.title}</p>
          <p className="text-xs text-muted-foreground">
            {b.author} · {b.year}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button type="button" onClick={() => setFlipped((f) => !f)} className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted sm:hidden" aria-label="Turn the book over">
            <RotateCw className="h-4 w-4" />
          </button>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted" aria-label="Put the book back">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* desktop: front and back side by side; phone: one book that flips */}
      <div className="hidden grid-cols-2 gap-3 sm:grid">
        <div className="aspect-[2/3]">
          <Front b={b} />
        </div>
        <div className="aspect-[2/3]">
          <Back b={b} />
        </div>
      </div>
      <button type="button" onClick={() => setFlipped((f) => !f)} className="mx-auto block w-full max-w-[240px] [perspective:1200px] sm:hidden" aria-label={flipped ? "Show the front cover" : "Show the back cover"}>
        <div className={cn("relative aspect-[2/3] transition-transform duration-700 [transform-style:preserve-3d]", flipped && "[transform:rotateY(180deg)]")}>
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <Front b={b} />
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Back b={b} />
          </div>
        </div>
      </button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground sm:hidden">Tap the book to turn it over</p>
    </div>
  );
}

export default function Bookshelf() {
  const [picked, setPicked] = useState<string | null>(null);
  const [lite, setLite] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(max-width: 1023px), (prefers-reduced-motion: reduce)");
    const on = () => setLite(q.matches);
    on();
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  const book = books.find((b) => b.id === picked) ?? null;

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-[#f7f3ec]">
        <div className="relative h-[260px] sm:h-[460px]">
          <ShelfScene picked={picked} onPick={setPicked} lite={lite} />
        </div>
        {book && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden lg:right-3 lg:left-auto lg:top-3 lg:block lg:w-[460px]">
            <Preview key={book.id} b={book} onClose={() => setPicked(null)} />
          </div>
        )}
      </div>
      {book && (
        <div className="mt-3 lg:hidden">
          <Preview key={book.id} b={book} onClose={() => setPicked(null)} />
        </div>
      )}
      {/* Every title as text, and a way to pick without the 3D shelf. */}
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Books on the shelf">
        {books.map((b) => (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => setPicked(b.id)}
              aria-pressed={picked === b.id}
              className={cn("rounded-full border px-2.5 py-1 text-xs transition-colors", picked === b.id ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:border-foreground/40")}
            >
              {b.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
