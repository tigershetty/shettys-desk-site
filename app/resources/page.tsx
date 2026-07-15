import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, PackageOpen, Sparkles } from "lucide-react";
import { resources } from "@/data/resources";

export const metadata: Metadata = {
  title: "Resources | Shetty's Desk",
  description:
    "Free supply-chain workflow packs, planning tools, and AI operating artifacts from Shetty's Desk.",
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="max-w-3xl pb-9 pt-2">
        <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <PackageOpen className="h-4 w-4" aria-hidden />
          Shetty&apos;s Desk workflow packs
        </div>
        <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
          Take the artifact. Build the workflow.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Free, versioned resources that turn supply-chain ideas into planner-reviewable tools. Each pack includes the method, sample data, expected outputs, and the controls needed to challenge the result.
        </p>
      </header>

      <section aria-labelledby="available-resources" className="border-t border-border py-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="available-resources" className="text-xl font-bold text-foreground">
            Available now
          </h2>
          <span className="text-sm text-muted-foreground">
            {resources.length} complete pack
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {resources.map((resource) => (
            <article
              key={resource.slug}
              className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_16px_50px_-34px_rgba(15,23,42,0.55)]"
            >
              <Link href={`/resources/${resource.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden bg-white">
                  <Image
                    src={resource.visual}
                    alt={`${resource.title} workflow preview`}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="eager"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md border border-white/70 bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
                    Free workflow pack
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                    <span>{resource.eyebrow}</span>
                    <span aria-hidden>•</span>
                    <span>v{resource.version}</span>
                    <span aria-hidden>•</span>
                    <span>{resource.readTime}</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {resource.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {resource.description}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Open the complete guide
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Download className="h-3.5 w-3.5" aria-hidden />
                      ZIP included
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 border-y border-border py-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["Built to run", "Not a screenshot or isolated prompt. Every pack includes a working method and an expected output."],
            ["Planner-reviewable", "AI prepares the evidence and artifact. The operating decision remains visible and owned."],
            ["Versioned in public", "Each release records what changed, which assumptions matter, and when the method was tested."],
          ].map(([title, copy]) => (
            <div key={title}>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
