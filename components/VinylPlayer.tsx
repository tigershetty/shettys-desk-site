"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TopTrack } from "@/app/api/spotify/top-tracks/route";

const PLAYLIST_ID = "1v1rJhgqiZCxVS9Hx0xurm";

/**
 * Turntable for "On rotation". Shows the owner's live Spotify top tracks when
 * the API is configured, otherwise the curated playlist. The Spotify embed
 * (and its cookies) only loads after the visitor drops the needle.
 */
export default function VinylPlayer() {
  const [tracks, setTracks] = useState<TopTrack[]>([]);
  const [selected, setSelected] = useState<TopTrack | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/spotify/top-tracks")
      .then((r) => (r.ok ? r.json() : { tracks: [] }))
      .then((data: { tracks: TopTrack[] }) => {
        if (cancelled || !data.tracks?.length) return;
        setTracks(data.tracks);
        setSelected(data.tracks[0]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const embedSrc = selected
    ? `https://open.spotify.com/embed/track/${selected.id}?utm_source=generator&theme=0`
    : `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;

  const pick = (track: TopTrack) => {
    setSelected(track);
    setPlaying(true);
  };

  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,240px)_1fr] sm:items-center">
      {/* Turntable */}
      <div className="relative mx-auto aspect-square w-full max-w-[240px] rounded-2xl border border-foreground/80 bg-gradient-to-br from-white to-neutral-100 p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.6)]">
        <div
          className={cn(
            "relative h-full w-full rounded-full shadow-[inset_0_0_0_2px_rgba(255,255,255,0.06),0_8px_20px_-8px_rgba(0,0,0,0.6)] motion-safe:animate-[vinyl-spin_2.2s_linear_infinite]",
            !playing && "[animation-play-state:paused]"
          )}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 0 30%, rgba(255,255,255,0.05) 30.5%, transparent 31%), repeating-radial-gradient(circle at 50% 50%, #111 0 2px, #1c1c1c 2px 3px), #111",
          }}
          aria-hidden
        >
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0deg,rgba(255,255,255,0.10)_25deg,transparent_60deg,transparent_180deg,rgba(255,255,255,0.08)_210deg,transparent_240deg)]" />
          <div className="absolute left-1/2 top-1/2 h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-neutral-800 bg-primary">
            {selected?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-indigo-800 font-mono text-[9px] font-semibold uppercase tracking-widest text-amber-300">
                Shetty&apos;s
              </span>
            )}
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-200 ring-2 ring-neutral-900" />
          </div>
        </div>

        {/* Tonearm */}
        <svg
          viewBox="0 0 60 140"
          className={cn("absolute -right-1 top-2 h-[62%] origin-[48px_12px] transition-transform duration-700 ease-out", playing ? "rotate-[24deg]" : "rotate-0")}
          style={{ transformBox: "view-box" }}
          aria-hidden
        >
          <circle cx="48" cy="12" r="9" fill="#e5e5e5" stroke="#0f172a" strokeWidth="2" />
          <path d="M48 12 L44 104 L30 128" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="22" y="124" width="14" height="10" rx="2" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" transform="rotate(35 29 129)" />
        </svg>
      </div>

      {/* Deck */}
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {tracks.length ? "Top tracks this month · live from Spotify" : "Curated playlist"}
        </p>
        <p className="mt-1 truncate text-base font-semibold text-foreground">
          {selected ? selected.name : "What's spinning at the desk"}
        </p>
        <p className="truncate text-sm text-muted-foreground">{selected ? selected.artists : "A rotating playlist for deep work"}</p>

        {tracks.length > 0 && (
          <ol className="mt-3 space-y-1">
            {tracks.map((t, i) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => pick(t)}
                  aria-pressed={selected?.id === t.id}
                  className={cn(
                    "flex w-full min-h-10 items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                    selected?.id === t.id ? "bg-muted" : "hover:bg-muted/60"
                  )}
                >
                  <span className="w-4 font-mono text-[11px] text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium text-foreground">{t.name}</span>
                    <span className="text-muted-foreground"> · {t.artists}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-4">
          {playing ? (
            <iframe
              key={embedSrc}
              title={selected ? `${selected.name} by ${selected.artists} on Spotify` : "Shetty's Desk playlist on Spotify"}
              src={embedSrc}
              width="100%"
              height={selected ? 80 : 152}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="rounded-xl border-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
              Drop the needle
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes vinyl-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
