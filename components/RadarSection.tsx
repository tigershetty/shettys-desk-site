import radarData from "@/data/radar.json";

export default function RadarSection() {
  return (
    <section className="mb-12">
      <h2 className="mb-2 text-lg font-semibold text-foreground">
        Supply Chain Radar
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        What I&apos;m looking into next
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {radarData.map((item) => (
          <div
            key={item.topic}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="font-medium text-foreground">{item.topic}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
