import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Brain, Check, Eye } from "lucide-react";
import ApproachFlow from "@/components/ApproachFlow";
import Reveal from "@/components/Reveal";

const qualityGates = [
  ["Evidence", "Every important claim points to a source, definition, or approved operating assumption."],
  ["Meaning", "The layout and motion preserve the real process, formula, hierarchy, and decision logic."],
  ["Brand", "Typography, palette, logo treatment, visual depth, and caption voice belong to one studio system."],
  ["Usefulness", "The reader can take a question, method, or artifact into the next planning conversation."],
];

const proof = [
  {
    href: "/articles/supply-chain-resilience-operating-system",
    image: "/images/articles/recent/supply-chain-resilience-os.png",
    title: "Resilience OS",
    detail: "A response system",
  },
  {
    href: "/articles/optimal-batch-size-decision-board",
    image: "/images/articles/recent/optimal-batch-size-decision-board.png",
    title: "Batch Size Board",
    detail: "A decision artifact",
  },
  {
    href: "/resources/demand-sensing-router",
    image: "/resources/demand-sensing-router/visual.png",
    title: "Demand Sensing Router",
    detail: "A reusable workflow pack",
  },
];

export default function ApproachPage() {
  return (
    <article className="mx-auto w-full max-w-6xl">
      <header className="max-w-4xl border-b border-border pb-9">
        <p className="text-sm font-semibold text-primary">How Shetty&apos;s Desk gets made</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
          From operating question to useful artifact
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          The workflow is built to produce more than attractive content. Every
          post should turn supply-chain evidence into a visual that helps someone
          understand a decision, challenge an assumption, or run a better review.
        </p>
      </header>

      <ApproachFlow />

      <Reveal>
        <section className="mt-14 border-y border-border py-11" aria-labelledby="division-heading">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">The division of work</p>
            <h2 id="division-heading" className="mt-2 text-3xl font-bold text-foreground">
              Automate the repetition. Keep ownership of the judgment.
            </h2>
          </div>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
            <div className="bg-[#eef2ff] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Bot className="h-4 w-4" aria-hidden />
                The system prepares
              </div>
              <ul className="mt-5 space-y-3 text-sm text-foreground">
                {["Source aggregation and reference retrieval", "First-pass research synthesis and structured briefs", "Prompt compilation, image variants, and motion frames", "Mechanical text, schema, logo, and endpoint checks"].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#f0fdfa] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                <Brain className="h-4 w-4" aria-hidden />
                I still own
              </div>
              <ul className="mt-5 space-y-3 text-sm text-foreground">
                {["The point of view and operating question", "Which evidence is trusted and what remains uncertain", "The visual architecture, brand story, and final caption", "Publication approval and the lesson carried into the next post"].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-11" aria-labelledby="quality-heading">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Eye className="h-4 w-4" aria-hidden />
                Quality gates
              </div>
              <h2 id="quality-heading" className="mt-2 text-3xl font-bold text-foreground">
                A post is not finished when it looks finished.
              </h2>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {qualityGates.map(([title, detail], index) => (
                <div key={title} className="grid gap-2 py-5 sm:grid-cols-[42px_130px_1fr]">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="border-y border-border py-11" aria-labelledby="proof-heading">
          <p className="text-sm font-semibold text-primary">Proof from the workflow</p>
          <h2 id="proof-heading" className="mt-2 text-3xl font-bold text-foreground">
            Different topics, one design language
          </h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            {proof.map((item) => (
              <Link key={item.href} href={item.href} className="group block">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border bg-white">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
                    sizes="(max-width: 640px) 100vw, 30vw"
                  />
                </div>
                <p className="mt-3 text-xs font-semibold text-primary">{item.detail}</p>
                <h3 className="mt-1 font-semibold text-foreground group-hover:text-primary">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="mt-11 rounded-lg bg-foreground px-6 py-8 text-background sm:px-8">
        <p className="text-sm font-semibold text-[#5eead4]">The bet</p>
        <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-3xl text-lg leading-relaxed text-background/80">
            AI should move the work forward, but it should also make the method
            easier to inspect, repeat, and improve. The result still has to sound
            like me, teach something real, and hold up in an operating room.
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#5eead4]"
          >
            See the published work
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </article>
  );
}
