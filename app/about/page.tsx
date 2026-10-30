import { TasteIsAllYouNeed } from "@/components/ui/taste-pong";
import ControlTower from "@/components/ControlTower";
import VinylPlayer from "@/components/VinylPlayer";
import AboutHero from "@/components/AboutHero";
import AboutHeading from "@/components/AboutHeading";
import GlobeSection from "@/components/GlobeSection";
import BoardingPasses from "@/components/BoardingPasses";
import Bookshelf from "@/components/bookshelf/Bookshelf";
import { fig, roleYears, tetraPakRoles, yearsAtTetraPak } from "@/data/profile";
import travel from "@/data/travel.json";

const origin = travel.places.find((p) => p.kind === "home")?.city ?? "Bangalore";

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

export default function AboutPage() {
  return (
    <>
      <section className="mb-10">
        <AboutHeading />
      </section>

      {/* The person, at the foot of a globe with the work in orbit */}
      <AboutHero />

      {/* Tiny themed Pong that spells "Taste is all you need" */}
      <div className="mb-10">
        <div className="relative mx-auto h-[13rem] w-full max-w-[32.5rem] overflow-hidden rounded-xl border border-border shadow-sm sm:h-[16.25rem]">
          <TasteIsAllYouNeed />
        </div>
      </div>

      {/* Personal letter in gradient card */}
      <section className="mb-12 rounded-3xl border border-border bg-gradient-to-br from-card to-background p-5 sm:p-8">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">Personal note</p>
        <div className="space-y-4 text-foreground/90 leading-relaxed">
          <p>
            Originally from {origin}. Moved to Sweden for a master&apos;s in
            Logistics &amp; Supply Chain Management at Lund University, and
            stayed. I&apos;ve spent {yearsAtTetraPak()}+ years at Tetra Pak, starting as a thesis
            student. Today I&apos;m Replenishment Manager in the Services Supply
            Network, leading a team of {fig("teamNow")} purchasing and sourcing specialists who
            keep {fig("spareParts")} spare parts moving to customers worldwide, with {fig("purchasingVolume")} a
            year in purchasing volume across {fig("suppliers")} suppliers. Before that I spent {roleYears(tetraPakRoles[1])} years in
            supply planning for capital equipment, leading a team across Sweden,
            Italy and China.
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

      {/* Globe - places I've travelled */}
      <GlobeSection />

      {/* The journey, one boarding pass per leg */}
      <BoardingPasses />

      {/* Control tower: career KPIs, network, capabilities */}
      <ControlTower />

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

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Vinyl player: live Spotify top tracks, playlist fallback */}
          <div className="rounded-2xl border border-border/60 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Listening</p>
            <VinylPlayer />
          </div>

          <div className="space-y-5">
            {[
              { label: "Watching", items: onRotation.watching },
            ].map(({ label, items }) => (
              <div key={label}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">{label}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.title} className="rounded-xl border border-border/50 px-3 py-2">
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                        {"author" in item && <span className="font-normal text-muted-foreground"> · {String(item.author)}</span>}
                      </p>
                      <p className="text-xs italic text-muted-foreground/70">{item.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books I love, on a shelf you can browse */}
      <section className="mb-12 rounded-3xl border border-border bg-card p-6" aria-labelledby="shelf-heading">
        <div className="mb-4">
          <h2 id="shelf-heading" className="font-semibold text-foreground">On the shelf</h2>
          <p className="text-xs text-muted-foreground">Books I love. Pick one off the shelf to see the front, the back and what it&apos;s about.</p>
        </div>
        <Bookshelf />
      </section>
    </>
  );
}
