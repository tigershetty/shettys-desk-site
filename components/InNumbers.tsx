"use client";

import { Briefcase, CalendarDays, Globe2, MapPin, Route } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import experience from "@/data/experience.json";
import travel from "@/data/travel.json";

// The person in figures, not the team: the career arc from Bangalore and the
// world around it. Each figure sits on a small card with a quiet graphic that
// shows the number rather than restating it. Everything is derived from the
// site's own data, so it stays true as the data changes.

const FIRST_ROLE_YEAR = 2016; // first role, Bangalore (see experience.earlier)
const thisYear = new Date().getFullYear();
const years = thisYear - FIRST_ROLE_YEAR;

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

/** Shows the real figure from the first render (for readers and parsers),
 * then counts up once when it scrolls into view. */
function Figure({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fmt = (v: number) => Math.round(v).toLocaleString("en-US");
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / 1200);
          el.textContent = fmt(n * (1 - Math.pow(1 - k, 4)));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        el.textContent = "0";
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [n]);
  return <span ref={ref}>{n.toLocaleString("en-US")}</span>;
}

function Card({ n, label, note, icon: Icon, children, className = "" }: { n: number; label: string; note?: string; icon: typeof Globe2; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative flex flex-col rounded-2xl border border-foreground/10 bg-white p-4 ${className}`}>
      <Icon aria-hidden className="absolute right-4 top-4 h-5 w-5 text-foreground/15" strokeWidth={1.5} />
      <p className="text-2xl font-semibold leading-none tracking-[-0.03em] text-primary tabular-nums">
        <Figure n={n} />
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
        <Card n={years} label="years in supply chain" icon={CalendarDays}>
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
            <span>Lund</span>
          </div>
        </Card>
      </div>

      <Link href="/experience" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        View experience <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
