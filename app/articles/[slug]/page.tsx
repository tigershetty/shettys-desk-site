import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import articles from "@/data/articles.json";

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | Shetty's Desk`,
    description: article.hook,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  return (
    <article className="max-w-3xl">
      <Link
        href="/articles"
        className="mb-6 inline-block text-sm text-brand-muted hover:text-brand-accent"
      >
        &larr; Back to articles
      </Link>

      {article.image && (
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs text-brand-accent"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-3xl font-bold text-brand-white lg:text-4xl">
        {article.title}
      </h1>

      <p className="mt-2 text-sm text-brand-muted">{article.date}</p>

      {article.audienceBadge && (
        <p className="mt-3 text-xs text-brand-accent/80 italic">
          {article.audienceBadge}
        </p>
      )}

      <div className="mt-8 space-y-4 text-brand-white/90 leading-relaxed whitespace-pre-line">
        {article.caption}
      </div>

      <div className="mt-10 flex flex-wrap gap-6 rounded-xl border border-brand-border bg-brand-card p-5 text-sm">
        <div>
          <p className="text-brand-muted">Impressions</p>
          <p className="text-lg font-semibold text-brand-white">
            {article.stats.impressions.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-brand-muted">Reactions</p>
          <p className="text-lg font-semibold text-brand-white">
            {article.stats.reactions}
          </p>
        </div>
        <div>
          <p className="text-brand-muted">Comments</p>
          <p className="text-lg font-semibold text-brand-white">
            {article.stats.comments}
          </p>
        </div>
        <div>
          <p className="text-brand-muted">Reposts</p>
          <p className="text-lg font-semibold text-brand-white">
            {article.stats.reposts}
          </p>
        </div>
        <div>
          <p className="text-brand-muted">Saves</p>
          <p className="text-lg font-semibold text-brand-white">
            {article.stats.saves}
          </p>
        </div>
      </div>

      <a
        href={article.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-md bg-brand-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent/80"
      >
        View on LinkedIn
      </a>
    </article>
  );
}
