"use client"

import { Globe } from "@/components/ui/cobe-globe"
import travel from "@/data/travel.json"

// Every place on the globe comes from data/travel.json. Only the two homes are
// named on it; the rest are quiet dots, and the long hauls from Malmö are arcs.

type Place = { city: string; country: string; lat: number; lng: number; kind: string }
const places = travel.places as Place[]

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
const HOME_COLOR: [number, number, number] = [0.96, 0.62, 0.04]

const markers = places.map((p) => ({
  id: slug(p.city),
  location: [p.lat, p.lng] as [number, number],
  ...(p.kind === "home" ? { label: p.city, size: 0.055, color: HOME_COLOR } : {}),
}))

const at = (city: string) => {
  const p = places.find((x) => x.city === city)
  if (!p) throw new Error(`travel.json has no ${city}`)
  return [p.lat, p.lng] as [number, number]
}

const arcs = [
  { id: "blr-mmx", from: at("Bangalore"), to: at("Malmö") },
  { id: "mmx-yyz", from: at("Malmö"), to: at("Toronto") },
  { id: "mmx-sin", from: at("Malmö"), to: at("Singapore") },
  { id: "mmx-dps", from: at("Malmö"), to: at("Bali") },
]

const countries = Array.from(new Set(places.map((p) => p.country))).sort((a, b) => a.localeCompare(b))

export default function GlobeSection() {
  return (
    <section
      className="mb-12 overflow-hidden rounded-3xl border border-border bg-card bg-[radial-gradient(ellipse_60%_55%_at_50%_58%,rgba(79,70,229,0.07),transparent)] p-5 sm:p-6"
      aria-labelledby="travel-heading"
    >
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </div>
        <div>
          <h2 id="travel-heading" className="font-semibold text-foreground">Where I&apos;ve travelled</h2>
          <p className="text-xs text-muted-foreground">Drag to spin.</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[540px] py-2">
        <Globe
          markers={markers}
          arcs={arcs}
          markerColor={[0.31, 0.27, 0.9]}
          arcColor={[0.96, 0.62, 0.04]}
          baseColor={[1, 1, 1]}
          glowColor={[0.92, 0.93, 1]}
          markerSize={0.022}
          markerElevation={0.012}
          arcWidth={0.5}
          arcHeight={0.28}
          mapBrightness={9}
          speed={0.0025}
          theta={0.25}
          label={`A globe of the places visited, from Bangalore to Malmö and beyond. Drag to spin it.`}
        />
      </div>

      {/* The places as text, for screen readers and search. */}
      <p className="sr-only">Countries visited: {countries.join(", ")}.</p>
      <ul className="sr-only">
        {places.map((p) => (
          <li key={p.city}>
            {p.city}, {p.country}
          </li>
        ))}
      </ul>
    </section>
  )
}
