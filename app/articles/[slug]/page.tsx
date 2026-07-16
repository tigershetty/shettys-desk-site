import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { getArticles, getArticle } from "@/lib/articles";
import ArticleStats from "@/components/ArticleStats";
import ArticleVisual from "@/components/ArticleVisual";

export const revalidate = 600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | Shetty's Desk`,
    description: article.hook,
    openGraph: article.image
      ? {
          title: article.title,
          description: article.hook,
          images: [article.image],
        }
      : undefined,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const hasStats = Object.values(article.stats).some((value) => value > 0);

  return (
    <article className="mx-auto w-full max-w-6xl">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to published posts
      </Link>

      <header className="mx-auto max-w-4xl pb-2 pt-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-primary">
          <span>{article.series}</span>
          <span aria-hidden>•</span>
          <span>{article.readTime}</span>
          {article.sourceWeek && (
            <>
              <span aria-hidden>•</span>
              <span>{article.sourceWeek}</span>
            </>
          )}
        </div>
        <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          {article.title}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {article.hook}
        </p>
        {article.audienceBadge && (
          <p className="mt-5 text-sm text-muted-foreground">
            {article.audienceBadge}
          </p>
        )}
      </header>

      {article.image && (
        <ArticleVisual
          title={article.title}
          still={article.image}
          motion={article.motion}
          motionMp4={article.motionMp4}
          width={article.imageWidth}
          height={article.imageHeight}
        />
      )}

      <section
        className="mt-12 border-y border-border py-11"
        aria-labelledby="architecture-heading"
      >
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-sm font-semibold text-primary">
              Decision architecture
            </p>
            <h2
              id="architecture-heading"
              className="mt-2 text-3xl font-bold text-foreground"
            >
              How to read the artifact
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Follow the operating logic in order. Each step should leave a
              clearer piece of evidence, question, or decision for the review.
            </p>
          </div>
          <ol className="divide-y divide-border border-y border-border">
            {article.framework.map((item, index) => (
              <li
                key={item.title}
                className="grid gap-2 py-5 sm:grid-cols-[52px_190px_1fr] sm:items-start"
              >
                <span className="font-mono text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grid gap-10 py-11 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Layers3 className="h-4 w-4" aria-hidden />
            Bring this evidence
          </div>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            The minimum input pack
          </h2>
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {article.inputPack.map((item) => (
              <li key={item} className="flex gap-3 py-3 text-sm text-foreground">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <ClipboardCheck className="h-4 w-4" aria-hidden />
            Use it in the room
          </div>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            Questions for the next review
          </h2>
          <ol className="mt-5 divide-y divide-border border-y border-border">
            {article.reviewPrompts.map((item, index) => (
              <li
                key={item}
                className="grid grid-cols-[32px_1fr] gap-3 py-3 text-sm text-foreground"
              >
                <span className="font-mono text-xs font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="border-y border-border bg-[#eef2ff] py-10"
        aria-labelledby="boundary-heading"
      >
        <div className="grid gap-5 px-1 sm:grid-cols-[36px_1fr]">
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">
              Decision boundary
            </p>
            <h2
              id="boundary-heading"
              className="mt-2 text-2xl font-bold text-foreground"
            >
              What the artifact prepares, and what the team still owns
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {article.decisionBoundary}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl py-11" aria-labelledby="caption-heading">
        <p className="text-sm font-semibold text-primary">Published caption</p>
        <h2 id="caption-heading" className="mt-2 text-3xl font-bold text-foreground">
          The thinking behind the visual
        </h2>
        <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-foreground/90">
          {article.caption}
        </div>
      </section>

      {article.resourceUrl && (
        <section
          className="border-y border-border bg-[#fffbeb] py-10"
          aria-labelledby="resource-heading"
        >
          <div className="grid gap-5 px-1 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-amber-700">
                Downloadable workflow
              </p>
              <h2
                id="resource-heading"
                className="mt-2 text-2xl font-bold text-foreground"
              >
                Take the operating artifact into your own demand review
              </h2>
              {article.resourceDescription && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {article.resourceDescription}
                </p>
              )}
            </div>
            <Link
              href={article.resourceUrl}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {article.resourceLabel ?? "Open the resource"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      )}

      {hasStats && <ArticleStats stats={article.stats} />}

      <footer className="flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Explore downloadable resources
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        {article.linkedinUrl && (
          <a
            href={article.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
          >
            View the original post
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
      </footer>
    </article>
  );
}
