import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticles, getArticle } from "@/lib/articles";
import ArticleStats from "@/components/ArticleStats";

export const revalidate = 600;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | Shetty's Desk`,
    description: article.hook,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
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
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        View on LinkedIn
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
    </article>
  );
}
