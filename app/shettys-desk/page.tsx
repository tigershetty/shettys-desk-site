import siteData from "@/data/site.json";
import radarData from "@/data/radar.json";
import ShettysAnimation from "@/components/ShettysAnimation";

export default function ShettysDesk() {
  return (
    <>
      <header className="max-w-2xl py-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Shetty&apos;s Desk
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          A how-to for supply chain.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          One real topic at a time.
        </p>
      </header>

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
        <ShettysAnimation />
      </section>

      {/* What's next */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          What&apos;s next
        </h2>
        <div className="flex flex-wrap gap-2">
          {radarData.map((item) => (
            <div
              key={item.topic}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <span className="font-medium text-foreground">
                {item.topic}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <a
        href={siteData.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Follow Shetty&apos;s Desk on LinkedIn
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </>
  );
}
