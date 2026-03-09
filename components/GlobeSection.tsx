"use client"

import { Globe } from "./Globe"

const locations = [
  { name: "Bangalore", label: "Born & raised" },
  { name: "Malmö", label: "Home since 2017" },
]

export default function GlobeSection() {
  return (
    <section className="mb-12 rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <h2 className="font-semibold text-foreground">Where I&apos;ve lived</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative h-[280px] w-full max-w-[320px] shrink-0">
          <Globe className="pointer-events-auto" />
        </div>

        <div className="flex flex-row sm:flex-col gap-6">
          {locations.map((loc) => (
            <div key={loc.name} className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[rgb(251,100,21)]" />
              <div>
                <p className="text-sm font-medium text-foreground">{loc.name}</p>
                <p className="text-xs text-muted-foreground">{loc.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
