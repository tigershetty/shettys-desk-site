import siteData from "@/data/site.json";
import radarData from "@/data/radar.json";

export default function ShettysDesk() {
  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          Shetty&apos;s Desk
        </h1>
        <p className="mt-2 text-muted-foreground">
          A how-to for supply chain, one real topic at a time.
        </p>
      </section>

      {/* The problem */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          The problem
        </h2>
        <p className="max-w-2xl text-foreground/90 leading-relaxed">
          Most supply chain content is either buried in academic papers or
          oversimplified by people who&apos;ve never managed a supplier
          commitment. I wanted something in between. Real depth, made
          accessible.
        </p>
      </section>

      {/* Who reads it */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Who reads it
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Top industries</p>
            <p className="mt-1 text-foreground">
              Transportation &amp; Logistics, IT Services, Manufacturing
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Top seniority</p>
            <p className="mt-1 text-foreground">
              Senior (35%), Manager (14%), Director (12%)
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Reach</p>
            <p className="mt-1 text-foreground">
              India, Scandinavia, Singapore, UK, US
            </p>
          </div>
        </div>
      </section>

      {/* What's next */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          What&apos;s next
        </h2>
        <div className="space-y-3">
          {radarData.map((item) => (
            <div
              key={item.topic}
              className="flex items-baseline gap-3 text-sm"
            >
              <span className="font-medium text-foreground">
                {item.topic}
              </span>
              <span className="text-muted-foreground">{item.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <a
        href={siteData.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/80"
      >
        Follow Shetty&apos;s Desk on LinkedIn
      </a>
    </>
  );
}
