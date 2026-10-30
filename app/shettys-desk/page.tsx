import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Megaphone, Rocket, Workflow } from "lucide-react";
import { fig, identity, yearsAtTetraPak } from "@/data/profile";
import radarData from "@/data/radar.json";
import articles from "@/data/articles.json";
import ShettysAnimation from "@/components/ShettysAnimation";
import ApproachFlow from "@/components/ApproachFlow";
import AtcRadar, { type Flight } from "@/components/AtcRadar";

export const metadata: Metadata = {
  title: "Shetty's Desk | What it is and where it's heading",
  description:
    "A practitioner's desk for supply chain planning: real planning decisions explained by someone who makes them, the AI behind the work built in public, and a practice for planning teams on the horizon.",
};

const pillars = [
  {
    Icon: Megaphone,
    title: "An expert voice",
    body: `Long-form breakdowns of real planning problems (S&OP, availability, sourcing lead times, allocation) written from ${yearsAtTetraPak()}+ years inside a global supply network. Depth for practitioners, plain language for everyone else.`,
    link: { href: "/articles", label: "Read the articles" },
  },
  {
    Icon: Workflow,
    title: "AI, built in public",
    body: "The desk runs on an agentic workflow built with Claude Code: research, drafting, visuals and review, with a human deciding every publish. The same habits I use to build planning agents at work, shown openly.",
    link: { href: "#method", label: "See how a post gets made" },
  },
  {
    Icon: Rocket,
    title: "Where it's heading",
    body: "A practice for planning teams: decision workshops, S&OP health checks and AI-in-planning sessions. It isn't open yet. The writing and the tools come first, and they have to earn it.",
    link: { href: "#radar", label: "See what's on the radar" },
  },
];

const flights: Flight[] = [
  {
    callsign: "SD-01",
    name: "Shetty's Desk articles",
    status: "CRUISING",
    bearing: 60,
    range: 0.78,
    route: `${articles.length} published · next: ${radarData[0].topic}`,
    note: "Long-form breakdowns of planning decisions, one real topic at a time. Next on the list: " + radarData.slice(0, 3).map((r) => r.topic).join(", ") + ".",
  },
  {
    callsign: "WF-04",
    name: "The content workflow",
    status: "IN SERVICE",
    bearing: 300,
    range: 0.32,
    route: "Claude Code · research → draft → visual → review",
    note: "The agentic pipeline behind every post. A human approves the caption and the final visual before anything is published.",
  },
  {
    callsign: "AI-02",
    name: "Agentic planning AI",
    status: "ON APPROACH",
    bearing: 150,
    range: 0.55,
    route: "From one QMS agent to planning agents",
    note: `After Optimus Prime (an agent over ${fig("workInstructions")} work instructions that cut query time by ${fig("agentTimeCut")}) and the order-confirmation automation, the next step is agents that prepare planning and purchasing decisions for a human to approve. Shared here as it's built.`,
  },
  {
    callsign: "LAB-03",
    name: "Product Journey Lab",
    status: "WIP",
    bearing: 235,
    range: 0.86,
    route: "WIP · separate build",
    note: "3D walkthroughs of how everyday products move: a burger order through a restaurant, a part picked and packed in a fulfilment centre. In progress as its own build, with the research done properly first.",
  },
];

export default function ShettysDesk() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Shetty&apos;s Desk</p>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-foreground sm:text-4xl">A practitioner&apos;s desk for supply chain planning.</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Real planning decisions, explained by someone who makes them, with the AI behind the work built in public. Today it&apos;s
          writing and tools. Tomorrow it&apos;s a practice for planning teams.
        </p>
      </header>

      <section className="mb-14 grid gap-4 md:grid-cols-3" aria-label="What Shetty's Desk is">
        {pillars.map(({ Icon, title, body, link }) => (
          <div key={title} className="flex flex-col rounded-2xl border border-foreground bg-card p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <h2 className="mt-3 font-semibold text-foreground">{title}</h2>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
            <Link href={link.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              {link.label} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        ))}
      </section>

      <section id="radar" className="mb-14 scroll-mt-20" aria-labelledby="radar-heading">
        <h2 id="radar-heading" className="text-lg font-semibold text-foreground">
          What&apos;s on the radar
        </h2>
        <p className="mb-4 mt-1 max-w-2xl text-sm text-muted-foreground">
          What I&apos;m building now and what I want to pick up next. Select a flight for its plan.
        </p>
        <AtcRadar flights={flights} />
      </section>

      <section id="method" className="mb-14 scroll-mt-20" aria-labelledby="method-heading">
        <h2 id="method-heading" className="text-lg font-semibold text-foreground">
          How a post gets made
        </h2>
        <p className="mb-4 mt-1 max-w-2xl text-sm text-muted-foreground">
          Six steps, from a real operating question to a published piece. AI does the heavy lifting; I own the judgement.
        </p>
        <ApproachFlow />
      </section>

      <section className="mb-14" aria-labelledby="readers-heading">
        <h2 id="readers-heading" className="mb-4 text-lg font-semibold text-foreground">
          Who reads it
        </h2>
        <ShettysAnimation />
      </section>

      <section className="mb-12" aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="mb-4 text-lg font-semibold text-foreground">
          Topics coming up
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {radarData.map((item) => (
            <li key={item.topic} className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{item.topic}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <a
        href={identity.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-white transition-all hover:bg-primary/80"
      >
        Follow Shetty&apos;s Desk on LinkedIn
      </a>
    </div>
  );
}
