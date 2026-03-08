import BeliefCard from "@/components/BeliefCard";
import beliefs from "@/data/beliefs.json";
import siteData from "@/data/site.json";

export default function AboutPage() {
  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          The person behind the desk
        </h1>
      </section>

      {/* Photo placeholder */}
      <div className="mb-8 flex h-48 w-48 items-center justify-center rounded-xl border border-border bg-card">
        <span className="text-sm text-muted-foreground">Photo coming soon</span>
      </div>

      {/* Personal letter */}
      <section className="mb-10 max-w-2xl space-y-4 text-foreground/90 leading-relaxed">
        <p>
          Originally from Bangalore. Moved to Sweden for a master&apos;s in
          Logistics &amp; Supply Chain at Lund University, and stayed. I&apos;ve
          spent 7+ years at Tetra Pak, starting as a thesis student and now
          managing replenishment for capital equipment supply chains worth 180M+
          euros annually.
        </p>
        <p>
          Supply chain decisions go wrong not because the data wasn&apos;t
          there. They go wrong because of how decisions get made, who makes them,
          what they&apos;re measuring, and what never makes it into the room in
          the first place. That gap is why I started Shetty&apos;s Desk.
        </p>
        <p>
          Outside of operations: DE&amp;I Europe Panelist, Culture Champion at
          Tetra Pak. I believe the same thing about inclusion that I believe
          about supply chains. The information exists. The gap is always in the
          translation and execution.
        </p>
        <p>
          I&apos;m also very interested in people leadership and public
          speaking. I think the ability to make complex things simple, whether in
          a planning meeting or on a stage, is the same skill.
        </p>
        <p className="italic text-muted-foreground">
          &ldquo;I may not be a scientist, but some of the previous years
          experiments have yielded positive results.&rdquo; (Trial and error,
          they call it.)
        </p>
      </section>

      {/* LinkedIn CTA */}
      <a
        href={siteData.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-12 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/80"
      >
        Connect on LinkedIn
      </a>

      {/* Beliefs */}
      <section className="mb-12">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          What I believe
        </h2>
        <div className="space-y-3">
          {beliefs.map((belief) => (
            <BeliefCard
              key={belief.title}
              title={belief.title}
              body={belief.body}
            />
          ))}
        </div>
      </section>

      {/* On Rotation placeholder */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-2 font-semibold text-foreground">On Rotation</h2>
        <p className="text-sm text-muted-foreground">Coming soon. Current reads, listens, and watches.</p>
      </section>
    </>
  );
}
