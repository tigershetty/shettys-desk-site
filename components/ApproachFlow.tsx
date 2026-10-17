import {
  BookOpenCheck,
  ChartNoAxesCombined,
  CircleCheckBig,
  FileStack,
  ScanSearch,
  Sparkles,
} from "lucide-react";

const stages = [
  {
    number: "01",
    short: "Question",
    line: "Start from a real operating decision, not a topic label.",
    Icon: ScanSearch,
    color: "text-primary",
  },
  {
    number: "02",
    short: "Evidence",
    line: "Research until every claim survives a planner's review.",
    Icon: BookOpenCheck,
    color: "text-secondary",
  },
  {
    number: "03",
    short: "Architecture",
    line: "Shape it into a board, table, or model with a clear reading order.",
    Icon: FileStack,
    color: "text-amber-600",
  },
  {
    number: "04",
    short: "Visual",
    line: "AI renders; I art direct the brand, logic, and depth.",
    Icon: Sparkles,
    color: "text-primary",
  },
  {
    number: "05",
    short: "QA",
    line: "Check every word, formula, and label before anything ships.",
    Icon: CircleCheckBig,
    color: "text-secondary",
  },
  {
    number: "06",
    short: "Learning",
    line: "Publish, watch what readers use, and feed the next build.",
    Icon: ChartNoAxesCombined,
    color: "text-amber-600",
  },
];

/**
 * Compact six-step strip describing how every post and pack is made.
 * AI automates the repetition; the judgment and final approval stay human.
 */
export default function ApproachFlow() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {stages.map(({ number, short, line, Icon, color }) => (
        <li key={number} className="flex gap-3 bg-card p-4">
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} aria-hidden />
          <div>
            <p className="text-sm font-semibold text-foreground">
              <span className="mr-2 font-mono text-[11px] text-muted-foreground">{number}</span>
              {short}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{line}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
