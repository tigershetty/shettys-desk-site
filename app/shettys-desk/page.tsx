import siteData from "@/data/site.json";
import radarData from "@/data/radar.json";
import ShettysAnimation from "@/components/ShettysAnimation";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export default function ShettysDesk() {
  return (
    <>
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Shetty&apos;s Desk
        </h1>
        <p className="mt-2 text-muted-foreground">
          A how-to for supply chain, one real topic at a time.
        </p>
      </section>

      {/* The problem */}
      <Reveal>
        <section className="mb-12">
          <SectionHeading eyebrow="Why this exists" title="The problem" />
          <p className="max-w-2xl text-foreground/90 leading-relaxed">
            Most supply chain content is either buried in academic papers or
            oversimplified by people who&apos;ve never managed a supplier
            commitment. I wanted something in between. Real depth, made
            accessible.
          </p>
        </section>
      </Reveal>

      {/* Who reads it */}
      <section className="mb-12">
        <SectionHeading eyebrow="The audience" title="Who reads it" />
        <ShettysAnimation />
      </section>

      {/* What's next */}
      <Reveal>
        <section className="mb-12">
          <SectionHeading eyebrow="Coming up" title="What's next" />
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
      </Reveal>

      {/* CTA */}
      <a
        href={siteData.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/80 hover:shadow-md hover:shadow-primary/10"
      >
        Follow Shetty&apos;s Desk on LinkedIn
      </a>
    </>
  );
}
