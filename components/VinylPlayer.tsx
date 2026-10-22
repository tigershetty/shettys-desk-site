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
    <div className="grid gap-5 sm:grid-cols-[minmax(0,300px)_1fr] sm:items-center">
      {/* Turntable: one SVG so the plinth, platter and tonearm keep exact proportions at any size */}
      <svg viewBox="0 0 400 300" className="mx-auto block w-full max-w-[320px]" role="img" aria-label={playing ? "Turntable playing" : "Turntable, needle up"}>
        <defs>
          <linearGradient id="vp-plinth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#f1f1f3" />
          </linearGradient>
          <radialGradient id="vp-sheen" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <clipPath id="vp-label">
            <circle cx="150" cy="150" r="40" />
          </clipPath>
        </defs>
        {/* plinth */}
        <rect x="4" y="4" width="392" height="292" rx="22" fill="url(#vp-plinth)" stroke="#111" strokeWidth="2.5" />
        {/* platter mat */}
        <circle cx="150" cy="150" r="128" fill="#d4d4d8" />
        <circle cx="150" cy="150" r="126" fill="#27272a" />
        {/* the record: everything in this group spins */}
        <g
          className={cn("motion-safe:animate-[vinyl-spin_1.8s_linear_infinite]", !playing && "[animation-play-state:paused]")}
          style={{ transformOrigin: "150px 150px", transformBox: "view-box" }}
        >
          <circle cx="150" cy="150" r="120" fill="#0b0b0c" />
          {[112, 104, 96, 88, 80, 72, 64, 56, 48].map((r) => (
            <circle key={r} cx="150" cy="150" r={r} fill="none" stroke="#ffffff" strokeOpacity={r % 16 === 0 ? 0.07 : 0.04} strokeWidth="1" />
          ))}
          <path d="M150 30 A120 120 0 0 1 262 112" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />
          {selected?.image ? (
            <image href={selected.image} x="110" y="110" width="80" height="80" clipPath="url(#vp-label)" preserveAspectRatio="xMidYMid slice" />
          ) : (
            <>
              <circle cx="150" cy="150" r="40" fill="#4f46e5" />
              <text x="150" y="141" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="1.5" fill="#fcd34d" fontFamily="ui-monospace, monospace">
                SHETTY&apos;S
              </text>
              <text x="150" y="166" textAnchor="middle" fontSize="8" letterSpacing="2" fill="#c7d2fe" fontFamily="ui-monospace, monospace">
                DESK · 33⅓
              </text>
            </>
          )}
        </g>
        <circle cx="150" cy="150" r="120" fill="url(#vp-sheen)" pointerEvents="none" />
        <circle cx="150" cy="150" r="4" fill="#e4e4e7" stroke="#111" strokeWidth="1.5" />

        {/* arm rest and speed marks */}
        <rect x="338" y="214" width="18" height="10" rx="3" fill="#e4e4e7" stroke="#111" strokeWidth="1.5" />
        <text x="300" y="276" fontSize="11" fontFamily="ui-monospace, monospace" fill="#71717a">
          33 · 45
        </text>
        <circle cx="282" cy="272" r="5" fill={playing ? "#22c55e" : "#d4d4d8"} stroke="#111" strokeWidth="1.2" />

        {/* tonearm: pivots on its bearing, swings onto the record when playing */}
        <g
          className="transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transformOrigin: "340px 62px", transformBox: "view-box", transform: playing ? "rotate(34deg)" : "rotate(0deg)" }}
        >
          <rect x="331" y="22" width="18" height="16" rx="3" fill="#3f3f46" />
          <path d="M340 38 L340 62 L344 196 L336 226" fill="none" stroke="#18181b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M327 222 L345 222 L343 238 L329 238 Z" fill="#f59e0b" stroke="#18181b" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <circle cx="340" cy="62" r="17" fill="#f4f4f5" stroke="#111" strokeWidth="2" />
        <circle cx="340" cy="62" r="6" fill="#18181b" />
      </svg>

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
