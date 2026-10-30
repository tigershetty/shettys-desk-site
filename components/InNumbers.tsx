"use client";

import { Briefcase, CalendarDays, Globe2, MapPin, Route } from "lucide-react";
import Link from "next/link";
import CountFigure from "@/components/CountFigure";
import experience from "@/data/experience.json";
import travel from "@/data/travel.json";

// The person in figures, not the team: the career arc from Bangalore and the
// world around it. Each figure sits on a small card with a quiet graphic that
// shows the number rather than restating it. Everything is derived from the
// site's own data, so it stays true as the data changes.

const FIRST_ROLE_YEAR = 2016; // first role, Bangalore (Biz Sherpa, Jun 2016; see experience.earlier)
const FIRST_ROLE_START = new Date(2016, 5, 1);
const now = new Date();
// Whole years since the first role, so the figure rolls over on the anniversary, not on 1 January.
const years = now.getFullYear() - FIRST_ROLE_START.getFullYear() - (now < new Date(now.getFullYear(), 5, 1) ? 1 : 0);

const places = travel.places.filter((p) => p.kind !== "transit");
const cities = new Set(places.map((p) => p.city)).size;
const byContinent = Object.entries(
  places.reduce<Record<string, Set<string>>>((m, p) => ((m[p.continent] ??= new Set()).add(p.country), m), {})
)
  .map(([name, set]) => ({ name, n: set.size }))
  .sort((a, b) => b.n - a.n);
const countries = byContinent.reduce((s, c) => s + c.n, 0);

const roleOrgs = [...experience.earlier.map((r) => r.company).reverse(), ...experience.primary.flatMap((c) => c.roles.map(() => c.company))];
const orgs = [...new Set(roleOrgs)];

function Card({ n, label, note, icon: Icon, children, className = "" }: { n: number; label: string; note?: string; icon: typeof Globe2; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative flex flex-col rounded-2xl border border-foreground/10 bg-white p-4 ${className}`}>
      <Icon aria-hidden className="absolute right-4 top-4 h-5 w-5 text-foreground/15" strokeWidth={1.5} />
      <p className="text-2xl font-semibold leading-none tracking-[-0.03em] text-primary tabular-nums">
        <CountFigure n={n} />
      </p>
      <p className="mt-1.5 text-sm text-foreground">{label}</p>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
      <div aria-hidden className="mt-auto pt-4">
        {children}
      </div>
    </div>
  );
}

export default function InNumbers() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <Card n={years} label="years in supply chain" note="Since my first role in 2016" icon={CalendarDays}>
          <div className="relative flex items-center justify-between">
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary/25" />
            {Array.from({ length: years + 1 }, (_, i) => (
              <span key={i} className={`relative h-1.5 w-1.5 rounded-full ${i === years ? "bg-primary ring-4 ring-primary/15" : "bg-primary/40"}`} />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
            <span>{FIRST_ROLE_YEAR}</span>
            <span>Now</span>
          </div>
        </Card>

        <Card n={roleOrgs.length} label="roles" note={`At ${orgs.length} organisations`} icon={Briefcase}>
          <div className="flex gap-1">
            {roleOrgs.map((o, i) => (
              <span key={i} className="h-3 flex-1 rounded-[3px]" style={{ background: `color-mix(in srgb, var(--primary) ${25 + (orgs.indexOf(o) / Math.max(1, orgs.length - 1)) * 75}%, white)` }} />
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">Internships → Tetra Pak</p>
        </Card>

        <Card n={cities} label="cities" note="Most of them by boarding pass" icon={MapPin}>
          <div className="grid grid-cols-[repeat(11,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(16,minmax(0,1fr))]">
            {Array.from({ length: cities }, (_, i) => (
              <span key={i} className="aspect-square rounded-[2px] bg-primary" style={{ opacity: 0.35 + ((i * 37) % 11) / 16 }} />
            ))}
          </div>
        </Card>

        <Card n={countries} label="countries" note={`On ${byContinent.length} continents`} icon={Globe2}>
          <div className="flex h-2 overflow-hidden rounded-full">
            {byContinent.map((c, i) => (
              <span key={c.name} style={{ flexGrow: c.n, background: ["var(--primary)", "var(--secondary)", "var(--accent)"][i % 3] }} />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 text-[11px] text-muted-foreground">
            {byContinent.map((c) => (
              <span key={c.name}>
                {c.name} {c.n}
              </span>
            ))}
          </div>
        </Card>

        <Card n={7200} label="km from where it started" note={`${experience.languages.length} languages along the way: ${experience.languages.join(", ")}`} icon={Route} className="col-span-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Bangalore</span>
            <span className="relative h-px flex-1 bg-primary/25">
              <span className="numbers-dot absolute -top-[2.5px] left-0 h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span>Malmö</span>
          </div>
        </Card>
      </div>

      <Link href="/experience" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        View experience <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
