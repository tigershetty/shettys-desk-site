"use client"

import { Globe, type GlobePlace } from "./Globe"
import travel from "@/data/travel.json"

const places = travel.places as (GlobePlace & { country: string; continent: string })[]
const destinations = places.filter((p) => p.kind !== "transit")

const countries = Array.from(new Set(destinations.map((p) => p.country))).sort((a, b) => a.localeCompare(b))

export default function GlobeSection() {
  return (
    <section className="mb-12 rounded-3xl border border-border bg-card p-5 sm:p-6" aria-labelledby="travel-heading">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </div>
        <div>
          <h2 id="travel-heading" className="font-semibold text-foreground">Where I&apos;ve travelled</h2>
          <p className="text-xs text-muted-foreground">Rebuilt from a decade of boarding passes. Drag to spin.</p>
        </div>
      </div>

      {/* One big globe: the places, and a single flight hopping between them. */}
      <div className="relative mx-auto w-full max-w-[680px]">
        <Globe places={places} className="max-w-[680px]" />
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[rgb(251,100,21)]" />Home: Bangalore, Malmö</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Visited</span>
        {places.some((p) => p.kind === "transit") && (
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Transit hub</span>
        )}
      </div>

      {/* The same places as text, for screen readers and search. */}
      <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
        {countries.join(" · ")}
      </p>
      <ul className="sr-only">
        {destinations.map((p) => (
          <li key={p.city}>
            {p.city}, {p.country}
          </li>
        ))}
      </ul>
    </section>
  )
}
