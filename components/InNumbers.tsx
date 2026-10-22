"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import experience from "@/data/experience.json";
import travel from "@/data/travel.json";

// The person in figures, not the team: the career arc from Bangalore and
// the world around it. Every figure is derived from the site's own data so
// it stays true as the data changes.

const FIRST_ROLE_YEAR = 2016; // first role, Bangalore (see experience.earlier)

const places = travel.places.filter((p) => p.kind !== "transit");
const roles = experience.primary.flatMap((c) => c.roles).length + experience.earlier.length;
const orgs = new Set([...experience.primary.map((c) => c.company), ...experience.earlier.map((r) => r.company)]).size;

const groups = [
  {
    name: "Career",
    items: [
      { n: new Date().getFullYear() - FIRST_ROLE_YEAR, label: "years in supply chain", note: "Since a first role in Bangalore, 2016." },
      { n: roles, label: "roles", note: `At ${orgs} organisations, internships to a global network.` },
      { n: experience.education.length, label: "degrees", note: "Engineering in Bangalore, logistics at Lund." },
      { n: 3, label: "countries led across", note: "Teams in Sweden, Italy and China." },
    ],
  },
  {
    name: "World",
    items: [
      { n: new Set(places.map((p) => p.city)).size, label: "cities", note: "Most of them by boarding pass." },
      { n: new Set(places.map((p) => p.country)).size, label: "countries", note: `On ${new Set(places.map((p) => p.continent)).size} continents.` },
      { n: experience.languages.length, label: "languages", note: experience.languages.join(", ") + "." },
      { n: 7200, label: "km from the start", note: "Bangalore to Sweden, as the crow flies." },
    ],
  },
];

/** Shows the real figure from the first render (for readers and parsers),
 * then counts up once when it scrolls into view. */
function Figure({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fmt = (v: number) => Math.round(v).toLocaleString("en-US");
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        el.textContent = fmt(n * (1 - Math.pow(1 - k, 4)));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      el.textContent = "0";
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [n]);
  return <span ref={ref}>{n.toLocaleString("en-US")}</span>;
}

export default function InNumbers() {
  return (
    <div>
      <div className="space-y-7">
        {groups.map((g) => (
          <section key={g.name} aria-label={g.name}>
            <p className="text-sm font-medium text-muted-foreground">{g.name}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4">
              {g.items.map((it) => (
                <div key={it.label} className="min-w-0">
                  <dt className="sr-only">{it.label}</dt>
                  <dd>
                    <span className="block text-[2.5rem] font-semibold leading-none tracking-[-0.045em] text-foreground tabular-nums">
                      <Figure n={it.n} />
                    </span>
                    <span className="mt-2 block text-sm font-medium text-foreground">{it.label}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{it.note}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      {/* the route it all runs along */}
      <div className="mt-7 flex items-center gap-3 text-xs text-muted-foreground">
        <span>Bangalore</span>
        <span aria-hidden className="relative h-px flex-1 bg-foreground/15">
          <span className="numbers-dot absolute -top-[2.5px] left-0 h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        <span>Lund</span>
        <Link href="/about" className="ml-2 font-medium text-primary hover:underline">
          More about me
        </Link>
      </div>
    </div>
  );
}
