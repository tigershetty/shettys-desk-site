"use client"

import { Globe, type GlobePlace } from "./Globe"
import travel from "@/data/travel.json"

const places = travel.places as (GlobePlace & { country: string; continent: string })[]
const destinations = places.filter((p) => p.kind !== "transit")

const countries = Array.from(new Set(destinations.map((p) => p.country)))
const continents = new Set(destinations.map((p) => p.continent))

const byCountry = countries
  .map((country) => ({
    country,
    cities: destinations.filter((p) => p.country === country).map((p) => p.city),
  }))
  .sort((a, b) => b.cities.length - a.cities.length || a.country.localeCompare(b.country))

const stats = [
  { value: destinations.length, label: "Cities" },
  { value: countries.length, label: "Countries" },
  { value: continents.size, label: "Continents" },
]

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

      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,340px)_1fr]">
        <div className="relative mx-auto w-full max-w-[340px]">
          <Globe places={places} />
        </div>

        <div>
          <dl className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border">
            {stats.map((s) => (
              <div key={s.label} className="px-3 py-3 text-center">
                <dd className="font-mono text-2xl font-bold text-foreground">{s.value}</dd>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[rgb(251,100,21)]" />Home: Bangalore, Malmö</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Visited</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Transit hub</span>
          </div>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {byCountry.map(({ country, cities }) => (
              <li
                key={country}
                title={cities.join(", ")}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground"
              >
                {country}
                <span className="sr-only">: {cities.join(", ")}</span>
                {cities.length > 1 && <span className="ml-1 font-mono text-[10px] text-muted-foreground">×{cities.length}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
