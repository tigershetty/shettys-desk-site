import BeliefCard from "@/components/BeliefCard";
import OrbitingSkillsLoader from "@/components/OrbitingSkillsLoader";
import AboutHeading from "@/components/AboutHeading";
import GlobeSection from "@/components/GlobeSection";
import BoardingPass from "@/components/BoardingPass";
import beliefs from "@/data/beliefs.json";
import siteData from "@/data/site.json";

const onRotation = {
  reading: [
    { title: "Tiny Experiments", author: "Anne-Laure Le Cunff", note: "Ship imperfect, learn fast" },
    { title: "The Goal", author: "Eliyahu Goldratt", note: "Theory of constraints. Still holds up." },
  ],
  listening: [
    { title: "Acquired", note: "Business deep dives" },
    { title: "Supply Chain Revolution", note: "Industry trends and case studies" },
  ],
  watching: [
    { title: "How I Built This", note: "Founder stories, operational lessons" },
  ],
};

const workingWithMe = [
  {
    icon: "📐",
    title: "I default to structure",
    body: "I think in frameworks and systems. If something can be structured, I'll structure it before discussing it.",
  },
  {
    icon: "🎯",
    title: "I lead with questions",
    body: "My first instinct in any room is to ask what problem we're actually solving. Not what tool we're buying.",
  },
  {
    icon: "📝",
    title: "I write to think",
    body: "LinkedIn posts, internal documents, this site. Writing is how I process complex topics and test whether I actually understand them.",
  },
  {
    icon: "🤝",
    title: "I value directness",
    body: "Say what you mean. Disagree openly. I'd rather have an honest 'no' than a polite delay.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mb-10">
        <AboutHeading />
      </section>

      {/* Intro + Orbiting Skills */}
      <div className="mb-10 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <OrbitingSkillsLoader />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">Poornajith Shetty</p>
          <p className="text-sm text-muted-foreground">Replenishment Manager at Tetra Pak, Malm&ouml;</p>
          <p className="mt-2 text-xs text-muted-foreground/60">Hover the orbits to explore tools &amp; domains</p>
          <a
            href={siteData.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Connect on LinkedIn
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>

      {/* Personal letter in gradient card */}
      <section className="mb-12 rounded-3xl border border-border bg-gradient-to-br from-card to-background p-8">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">Personal note</p>
        <div className="space-y-4 text-foreground/90 leading-relaxed">
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
        </div>
      </section>

      {/* Globe - places I've lived */}
      <GlobeSection />

      {/* Boarding Pass */}
      <section className="mb-12">
        <BoardingPass />
      </section>

      {/* Working With Me */}
      <section className="mb-12">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          Working with me
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {workingWithMe.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2.5">
                <span className="text-lg">{item.icon}</span>
                <h3 className="font-medium text-foreground">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beliefs in grid */}
      <section className="mb-12">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          What I believe
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {beliefs.map((belief, i) => (
            <BeliefCard
              key={belief.title}
              title={belief.title}
              body={belief.body}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* On Rotation */}
      <section className="mb-12 rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15 text-purple-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
          </div>
          <h2 className="font-semibold text-foreground">On Rotation</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Reading */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Reading</p>
            <div className="space-y-3">
              {onRotation.reading.map((item) => (
                <div key={item.title} className="rounded-xl border border-border/50 p-3">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.author}</p>
                  <p className="mt-1 text-xs text-muted-foreground/70 italic">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Listening */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Listening</p>
            <div className="space-y-3">
              {onRotation.listening.map((item) => (
                <div key={item.title} className="rounded-xl border border-border/50 p-3">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground/70 italic">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Watching */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Watching</p>
            <div className="space-y-3">
              {onRotation.watching.map((item) => (
                <div key={item.title} className="rounded-xl border border-border/50 p-3">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground/70 italic">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
