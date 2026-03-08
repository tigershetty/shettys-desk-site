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
      "YouTube deep dives, industry reports, annual filings. I go until the story connects.",
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
      "Who read it? What seniority? What industry? The analytics tell me if the message landed.",
  },
];

export default function ApproachPage() {
  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          How a breakdown gets made
        </h1>
        <p className="mt-2 text-muted-foreground">
          There&apos;s no formula. But there&apos;s a rhythm.
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

      <div className="mt-10 rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          I&apos;m building a workflow engine to speed up the repetitive parts
          (research aggregation, prompt templates, analytics tracking) so I can
          spend more time on the part that actually matters: the thinking.
        </p>
      </div>
    </>
  );
}
