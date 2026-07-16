"use client";

import { motion } from "framer-motion";
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
    title: "Frame the question",
    short: "Question",
    description:
      "Start with the operating tension, not the topic label. Name the meeting, decision, and person the artifact must help.",
    evidence:
      "Calendar intent, audience need, recent signal, and one practical decision pressure.",
    output: "Decision-led content brief",
    Icon: ScanSearch,
    color: "text-primary",
  },
  {
    number: "02",
    title: "Build the evidence",
    short: "Evidence",
    description:
      "Research the concept, current tools, operating constraints, and counterexamples until every important claim can survive review.",
    evidence:
      "Primary sources, practitioner references, data definitions, and the Top-100 visual intelligence library.",
    output: "Research brief and fact table",
    Icon: BookOpenCheck,
    color: "text-secondary",
  },
  {
    number: "03",
    title: "Design the decision",
    short: "Architecture",
    description:
      "Turn the research into an operating artifact: a board, table, map, process, or model with a clear reading order.",
    evidence:
      "Inputs, transformations, outputs, exception logic, and the human decision boundary.",
    output: "Creative packet and content architecture",
    Icon: FileStack,
    color: "text-amber-600",
  },
  {
    number: "04",
    title: "Art direct the visual",
    short: "Visual",
    description:
      "Use GPT Image 2 as the creative renderer, then lock the brand story, hero relevance, typography, logos, and editorial depth.",
    evidence:
      "Approved reference grammar, Shetty's Desk brand kit, exact logos, and a written creative contract.",
    output: "Final still and layout-specific motion",
    Icon: Sparkles,
    color: "text-primary",
  },
  {
    number: "05",
    title: "Run the quality gates",
    short: "QA",
    description:
      "Check every word, formula, label, connection, logo, and motion endpoint. Reject polish that changes the operating meaning.",
    evidence:
      "Text QA, semantic QA, logo QA, source-fidelity checks, and voice QA against the final caption.",
    output: "Approved publication package",
    Icon: CircleCheckBig,
    color: "text-secondary",
  },
  {
    number: "06",
    title: "Publish and learn",
    short: "Learning",
    description:
      "Publish the still, motion companion, and caption as one idea. Record what readers save, question, and use in practice.",
    evidence:
      "Post analytics, reader comments, iteration notes, and the reusable learning captured for the next build.",
    output: "A stronger next cycle",
    Icon: ChartNoAxesCombined,
    color: "text-amber-600",
  },
];

export default function ApproachFlow() {
  return (
    <>
      <div className="relative mt-9 border-y border-border py-5">
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.25, 0.4, 0, 1] }}
          className="absolute left-0 right-0 top-[52px] hidden h-px origin-left bg-primary/30 sm:block"
        />
        <div className="relative grid grid-cols-2 gap-y-5 sm:grid-cols-6 sm:gap-2">
          {stages.map(({ number, short, Icon, color }, index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <span className="font-mono text-[10px] font-semibold text-muted-foreground">
                {number}
              </span>
              <span className="my-2 flex h-8 w-8 items-center justify-center bg-background">
                <Icon className={`h-5 w-5 ${color}`} aria-hidden />
              </span>
              <span className="text-xs font-semibold text-foreground">{short}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-12 divide-y divide-border border-y border-border">
        {stages.map(
          ({ number, title, description, evidence, output, Icon, color }, index) => (
            <motion.article
              key={number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.03 }}
              className="grid gap-4 py-7 sm:grid-cols-[64px_220px_1fr] sm:gap-6"
            >
              <div className="flex items-center gap-3 sm:block">
                <Icon className={`h-5 w-5 ${color}`} aria-hidden />
                <span className="font-mono text-xs font-semibold text-muted-foreground sm:mt-3 sm:block">
                  {number}
                </span>
              </div>
              <h2 className="text-xl font-bold leading-tight text-foreground">{title}</h2>
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
                <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                  <div className="border-l-2 border-secondary pl-3">
                    <dt className="text-[10px] font-semibold uppercase text-muted-foreground">
                      Evidence in
                    </dt>
                    <dd className="mt-1 leading-relaxed text-foreground">{evidence}</dd>
                  </div>
                  <div className="border-l-2 border-primary pl-3">
                    <dt className="text-[10px] font-semibold uppercase text-muted-foreground">
                      Artifact out
                    </dt>
                    <dd className="mt-1 font-medium leading-relaxed text-foreground">
                      {output}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.article>
          )
        )}
      </div>
    </>
  );
}
