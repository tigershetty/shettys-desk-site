import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  Clock3,
  FileCheck2,
  FileSpreadsheet,
  GitCompareArrows,
  PackageOpen,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ResourcePreview from "@/components/ResourcePreview";
import ResourceDownload from "@/components/ResourceDownload";
import { getResource } from "@/data/resources";

const resource = getResource("demand-sensing-router")!;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shettysdesk.vercel.app";

export const metadata: Metadata = {
  title: "Demand Sensing Router | Shetty's Desk",
  description: resource.description,
  alternates: { canonical: `${siteUrl}/resources/${resource.slug}` },
  openGraph: {
    title: "Demand Sensing Router | Shetty's Desk",
    description: resource.description,
    url: `${siteUrl}/resources/${resource.slug}`,
    images: [{ url: resource.visual, width: 1024, height: 1536 }],
  },
};

const workflow = [
  ["01", "Bring the evidence", "Demand history, current forecast, recent signals, lead time, service priority, lifecycle, and planner comments."],
  ["02", "Profile the demand", "Run the included ADI and CV² script to separate regularity from order-size variability."],
  ["03", "Route the cadence", "Recommend frequent sensing, monthly planning, or special-method review using the supplied policy."],
  ["04", "Verify every move", "Reject stale signals, missing evidence, closed response windows, and unsupported route changes."],
  ["05", "Start the review forward", "Bring changed lanes, exceptions, and open operating decisions to the planner approval board."],
];

const files = [
  [BookOpenCheck, "Four-page field guide", "A compact Shetty's Desk PDF with the safe first run, exact file replacements, evidence fields, review order, and troubleshooting."],
  [FileSpreadsheet, "Sample portfolio data", "Synthetic SKU-location history and context fields, ready for a safe first run."],
  [Route, "Installable agent skill", "A concise routing workflow with policy, schema, deterministic scripts, and output contract."],
  [GitCompareArrows, "Three worker definitions", "Demand profiling, cadence routing, and independent verification responsibilities."],
  [FileCheck2, "Expected outputs", "Example routing board, route-change log, data-quality exceptions, and review brief."],
  [ShieldCheck, "Validation controls", "Checks that stop missing evidence and unsupported frequent-sensing recommendations."],
  [PackageOpen, "Tool adapters", "Setup paths for Claude Cowork, Claude Code, and a portable chat-first starter."],
];

export default function DemandSensingRouterPage() {
  return (
    <article className="mx-auto w-full max-w-6xl">
      <Link
        href="/resources"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to resources
      </Link>

      <header className="mx-auto max-w-4xl pb-2 pt-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-primary">
          <span>{resource.eyebrow}</span>
          <span aria-hidden>•</span>
          <span>Free workflow pack</span>
          <span aria-hidden>•</span>
          <span>v{resource.version}</span>
        </div>
        <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          Demand Sensing Router
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {resource.promise} Build the first routing board with Claude, then make every recommendation prove its signal, response window, and operating decision.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" aria-hidden />
            {resource.readTime}
          </span>
          <span>Updated {resource.updated}</span>
          <a href="#get-the-pack" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
            Get the pack
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </header>

      <ResourcePreview
        title={resource.title}
        still={resource.visual}
        motion={resource.motion}
        motionMp4={resource.motionMp4}
      />

      <section className="mt-12 border-y border-border py-10" aria-labelledby="why-this-exists">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold text-primary">The operating problem</p>
            <h2 id="why-this-exists" className="mt-2 text-3xl font-bold text-foreground">
              Faster is only useful when the signal can still change a decision.
            </h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Demand sensing and monthly forecasting solve different planning-horizon problems. A volatile SKU does not automatically deserve a faster cycle, and a stable SKU does not automatically belong in a monthly lane.
            </p>
            <p>
              This pack forces the routing decision through five tests: regularity, variability, volume and value, signal freshness, and the remaining response window. Intermittent, lumpy, new, and phase-out items receive their own review path instead of being forced into a false binary.
            </p>
            <p className="font-medium text-foreground">
              Claude prepares the evidence and the first-pass board. The planner owns the final policy and any system-of-record change.
            </p>
          </div>
        </div>
      </section>

      <section className="py-11" aria-labelledby="workflow-heading">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">How it runs</p>
          <h2 id="workflow-heading" className="mt-2 text-3xl font-bold text-foreground">
            From portfolio data to a reviewable routing decision
          </h2>
        </div>
        <ol className="mt-7 divide-y divide-border border-y border-border">
          {workflow.map(([number, title, copy]) => (
            <li key={number} className="grid gap-2 py-5 sm:grid-cols-[64px_220px_1fr] sm:items-start">
              <span className="font-mono text-sm font-semibold text-primary">{number}</span>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-white/70 py-11" aria-labelledby="package-heading">
        <div className="px-1">
          <p className="text-sm font-semibold text-secondary">Inside the ZIP</p>
          <h2 id="package-heading" className="mt-2 text-3xl font-bold text-foreground">
            Everything needed for a safe first run
          </h2>
          <div className="mt-7 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {files.map(([Icon, title, copy]) => {
              const ItemIcon = Icon as typeof PackageOpen;
              return (
                <div key={String(title)} className="bg-card p-5">
                  <ItemIcon className="h-5 w-5 text-primary" aria-hidden />
                  <h3 className="mt-4 font-semibold text-foreground">{String(title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{String(copy)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-11" aria-labelledby="output-heading">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-sm font-semibold text-primary">Expected output</p>
            <h2 id="output-heading" className="mt-2 text-3xl font-bold text-foreground">
              The meeting starts with the rows that changed.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Stable rows remain available, but the review begins with changed lanes, failed validation, and response windows that are closing.
            </p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[680px] border-collapse text-left text-xs">
              <thead className="bg-[#eef2ff] text-foreground">
                <tr>
                  {["SKU", "Evidence", "Proposed lane", "Decision", "Status"].map((heading) => (
                    <th key={heading} className="border-b border-border px-4 py-3 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">A100 / TOR</td>
                  <td className="px-4 py-3">Daily POS, 3-day response</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">Sense frequently</td>
                  <td className="px-4 py-3">Replenish</td>
                  <td className="px-4 py-3">Ready to review</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">C310 / VAN</td>
                  <td className="px-4 py-3">Stable, 45-day horizon</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">Plan monthly</td>
                  <td className="px-4 py-3">Capacity</td>
                  <td className="px-4 py-3">No lane change</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">D440 / MTL</td>
                  <td className="px-4 py-3">ADI 3.8, long zero gaps</td>
                  <td className="px-4 py-3 font-semibold text-orange-700">Special review</td>
                  <td className="px-4 py-3">Method choice</td>
                  <td className="px-4 py-3">Planner required</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="get-the-pack" className="scroll-mt-8 border-y border-border bg-[#fffbeb] py-10">
        <div className="grid gap-7 px-1 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
              <Sparkles className="h-4 w-4" aria-hidden />
              Free • v{resource.version}
            </div>
            <h2 className="mt-3 text-3xl font-bold text-foreground">
              Get the complete Demand Sensing Router Pack
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The archive includes a four-page field guide, one-command sample run, the skill, deterministic profiling scripts, sample data, routing policy, worker definitions, expected outputs, and validation checklist.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-foreground">
              {[
                "Run python3 START.py for the synthetic first-run check",
                "Synthetic data only; no production access required",
                "Runs as a skill or as a guided Claude project",
                "Designed for planner review before any policy change",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-amber-200 pt-5">
              <p className="text-xs font-semibold uppercase text-amber-700">
                Your first run
              </p>
              <ol className="mt-3 space-y-3 text-sm text-foreground">
                <li className="grid grid-cols-[24px_1fr] gap-2">
                  <span className="font-mono text-xs font-semibold text-amber-700">01</span>
                  <span>Run <code className="font-mono text-xs">python3 START.py</code> to prove the package with synthetic data.</span>
                </li>
                <li className="grid grid-cols-[24px_1fr] gap-2">
                  <span className="font-mono text-xs font-semibold text-amber-700">02</span>
                  <span>Copy the two CSVs in <code className="font-mono text-xs">skills/demand-sensing-router/assets/</code> and replace the sample rows with your governed fields.</span>
                </li>
                <li className="grid grid-cols-[24px_1fr] gap-2">
                  <span className="font-mono text-xs font-semibold text-amber-700">03</span>
                  <span>Build the five outputs, validate the board, and review changed or failed routes before any system update.</span>
                </li>
              </ol>
            </div>
          </div>
          <ResourceDownload />
        </div>
      </section>

      <section className="py-11" aria-labelledby="before-heading">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">Before you run it</p>
          <h2 id="before-heading" className="mt-2 text-3xl font-bold text-foreground">
            What the pack will not decide for you
          </h2>
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>It does not claim that demand sensing is automatically more accurate or that every volatile item should move faster.</p>
            <p>It does not update planning master data, release orders, or change the approved forecast policy.</p>
            <p>It does make the evidence, missing data, route changes, and remaining operating decision visible enough for a planner to challenge.</p>
          </div>
        </div>
      </section>
    </article>
  );
}
