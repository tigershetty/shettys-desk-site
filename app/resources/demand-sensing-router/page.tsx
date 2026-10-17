import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, Sparkles } from "lucide-react";
import ResourcePreview from "@/components/ResourcePreview";
import ResourceDownload from "@/components/ResourceDownload";
import { getResource } from "@/data/resources";

const resource = getResource("demand-sensing-router")!;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tigershetty.com";

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

const files = [
  ["Four-page field guide", "Safe first run, files to replace, review order, troubleshooting."],
  ["Sample portfolio data", "Synthetic SKU-location history for a no-risk first run."],
  ["Installable agent skill", "Routing policy, schema, deterministic ADI/CV² scripts, output contract."],
  ["Three worker definitions", "Demand profiling, cadence routing, independent verification."],
  ["Expected outputs", "Routing board, route-change log, data-quality exceptions, review brief."],
  ["Validation controls", "Stops missing evidence and unsupported frequent-sensing moves."],
  ["Tool adapters", "Claude Cowork, Claude Code, and a portable chat-first starter."],
];

const limits = [
  "It does not claim demand sensing is automatically more accurate.",
  "It does not update master data, release orders, or change forecast policy.",
  "The planner owns the final route and any system-of-record change.",
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
        <h1 className="mt-5 text-3xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          Demand Sensing Router
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {resource.promise} Claude builds the first routing board; every recommendation must prove its signal and response window before a planner signs off.
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

      <section id="get-the-pack" className="mt-10 scroll-mt-20 border-y border-border bg-[#fffbeb] py-8">
        <div className="grid gap-7 px-1 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
              <Sparkles className="h-4 w-4" aria-hidden />
              Free • v{resource.version} • Synthetic data only
            </div>
            <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
              Your first run
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-foreground">
              <li className="grid grid-cols-[24px_1fr] gap-2">
                <span className="font-mono text-xs font-semibold text-amber-700">01</span>
                <span>Run <code className="font-mono text-xs">python3 START.py</code> to prove the package with synthetic data.</span>
              </li>
              <li className="grid grid-cols-[24px_1fr] gap-2">
                <span className="font-mono text-xs font-semibold text-amber-700">02</span>
                <span>Replace the sample rows in the two CSVs under <code className="break-all font-mono text-xs">skills/demand-sensing-router/assets/</code> with your governed fields.</span>
              </li>
              <li className="grid grid-cols-[24px_1fr] gap-2">
                <span className="font-mono text-xs font-semibold text-amber-700">03</span>
                <span>Build the outputs, validate the board, and review changed or failed routes before any system update.</span>
              </li>
            </ol>
          </div>
          <ResourceDownload />
        </div>
      </section>

      <section className="py-9" aria-labelledby="package-heading">
        <h2 id="package-heading" className="text-xl font-bold text-foreground sm:text-2xl">
          Inside the ZIP
        </h2>
        <dl className="mt-4 grid gap-x-8 divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-y-0">
          {files.map(([title, copy]) => (
            <div key={title} className="py-3 sm:border-b sm:border-border">
              <dt className="text-sm font-semibold text-foreground">{title}</dt>
              <dd className="mt-0.5 text-sm text-muted-foreground">{copy}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="pb-9" aria-labelledby="output-heading">
        <h2 id="output-heading" className="text-xl font-bold text-foreground sm:text-2xl">
          Expected output
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The review starts with the rows that changed.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[560px] border-collapse text-left text-xs">
            <thead className="bg-[#eef2ff] text-foreground">
              <tr>
                {["SKU", "Evidence", "Proposed lane", "Status"].map((heading) => (
                  <th key={heading} className="border-b border-border px-4 py-3 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="px-4 py-3 font-semibold text-foreground">A100 / TOR</td>
                <td className="px-4 py-3">Daily POS, 3-day response</td>
                <td className="px-4 py-3 font-semibold text-blue-700">Sense frequently</td>
                <td className="px-4 py-3">Ready to review</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-foreground">C310 / VAN</td>
                <td className="px-4 py-3">Stable, 45-day horizon</td>
                <td className="px-4 py-3 font-semibold text-slate-700">Plan monthly</td>
                <td className="px-4 py-3">No lane change</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-foreground">D440 / MTL</td>
                <td className="px-4 py-3">ADI 3.8, long zero gaps</td>
                <td className="px-4 py-3 font-semibold text-orange-700">Special review</td>
                <td className="px-4 py-3">Planner required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t border-border py-8" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-xl font-bold text-foreground sm:text-2xl">
          Limitations
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          {limits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
