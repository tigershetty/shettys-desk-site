import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import articles from "@/data/articles.json";
import ArticleStats from "@/components/ArticleStats";

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | Shetty's Desk`,
    description: article.hook,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <article className="max-w-3xl">
      <Link
        href="/articles"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-primary"
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
            className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
        {article.title}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">{article.date}</p>

      {article.audienceBadge && (
        <p className="mt-3 text-xs text-primary/80 italic">
          {article.audienceBadge}
        </p>
      )}

      <div className="mt-8 space-y-4 text-foreground/90 leading-relaxed whitespace-pre-line">
        {article.caption}
      </div>

      <ArticleStats stats={article.stats} />

      <a
        href={article.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/80"
      >
        View on LinkedIn
      </a>
    </article>
  );
}
