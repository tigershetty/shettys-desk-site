import Link from "next/link";

const stats = [
  { value: "7+", label: "Years in supply chain", sublabel: "2019 - Now" },
  { value: "5", label: "Articles published", sublabel: "LinkedIn" },
  { value: "47%", label: "Transport & Logistics", sublabel: "Top industry" },
  { value: "38%", label: "Senior & Director-level", sublabel: "Top seniority" },
];

export default function StatsGrid() {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        My numbers
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="mt-1 text-sm text-foreground">{stat.label}</p>
            <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
          </div>
        ))}
      </div>
      <Link
        href="/experience"
        className="mt-4 inline-block text-sm text-primary hover:underline"
      >
        View experience
      </Link>
    </section>
  );
}
