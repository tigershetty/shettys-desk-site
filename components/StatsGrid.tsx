import Link from "next/link";
import CountUp from "./CountUp";

const stats = [
  { value: 7, suffix: "+", label: "Years in supply chain" },
  { value: 5, suffix: "", label: "Articles published" },
  { value: 47, suffix: "%", label: "Transport & Logistics audience" },
  { value: 38, suffix: "%", label: "Senior & Director-level readers" },
];

export default function StatsGrid({ bare = false }: { bare?: boolean }) {
  const grid = (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card p-6">
          <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            <CountUp to={stat.value} duration={1.5} separator="," />
            {stat.suffix}
          </p>
          <p className="mt-2 text-sm leading-snug text-muted-foreground">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );

  if (bare) return grid;

  return (
    <section className="py-16 sm:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            By the numbers
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A track record, not a pitch.
          </h2>
        </div>
        <Link
          href="/experience"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-all hover:gap-2.5"
        >
          View experience
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
      {grid}
    </section>
  );
}
