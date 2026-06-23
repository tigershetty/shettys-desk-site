import Pipeline from "@/components/Pipeline";
import PhaseCard from "@/components/PhaseCard";

const phases = [
  {
    title: "Curiosity",
    description:
      "It starts with a question I can't let go of. Usually from work, sometimes from a headline, sometimes from a conversation.",
  },
  {
    title: "Research",
    description:
      "YouTube deep dives, industry reports, annual filings. I go until the story connects, the same way I'd pressure-test a supply plan before I trust it.",
  },
  {
    title: "Synthesize",
    description:
      "Strip it down to what matters. If I can't explain it simply, I don't understand it yet.",
  },
  {
    title: "Visualize",
    description:
      "The infographic. I use AI tools (Gemini) with custom prompts to match the Shetty's Desk look.",
  },
  {
    title: "Publish",
    description:
      "LinkedIn first. The caption matters as much as the visual. That's where the real thinking lives.",
  },
  {
    title: "Reflect",
    description:
      "Who read it? What seniority? What industry? The analytics tell me if the message landed, then they feed the next question.",
  },
];

export default function ApproachPage() {
  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          How a breakdown gets made
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
          There&apos;s no formula. But there&apos;s a rhythm. Shetty&apos;s Desk
          is an agentic supply-chain content workflow built on Claude Code,
          applying the same instinct for automation I bring to planning at Tetra
          Pak to explaining how supply chains actually work.
        </p>
      </section>

      <Pipeline />

      <div className="space-y-3">
        {phases.map((phase, i) => (
          <PhaseCard
            key={phase.title}
            number={i + 1}
            title={phase.title}
            description={phase.description}
          />
        ))}
      </div>

      {/* The bet */}
      <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
          The bet
        </h2>
        <p className="mt-3 text-sm text-foreground leading-relaxed">
          Dashboards and BI are table stakes now. My bet is that the supply-chain
          professionals who understand how to deploy{" "}
          <span className="font-semibold">agentic AI</span> will operate at a
          different level over the next few years. That&apos;s where I&apos;m
          investing.
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          It&apos;s not theory. At Tetra Pak I built and deployed{" "}
          <span className="font-medium text-foreground">
            &ldquo;Optimus Prime at P&amp;Q&rdquo;
          </span>
          , an AI agent over our Quality Management System and 200+ work
          instructions serving 50+ global users, cutting query and review time by
          over 90%. Shetty&apos;s Desk runs on the same idea: let agents handle
          the repetitive parts (research aggregation, prompt templates, analytics
          tracking) so I can spend more time on the part that actually matters:
          the thinking.
        </p>
      </div>
    </>
  );
}
