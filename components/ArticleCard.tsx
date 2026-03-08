import Image from "next/image";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  hook: string;
  image: string | null;
  tags: string[];
}

export default function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group block rounded-xl border border-brand-border bg-brand-card overflow-hidden transition-colors hover:border-brand-accent/40 ${
        featured ? "lg:flex lg:gap-6" : ""
      }`}
    >
      {article.image && (
        <div
          className={`relative overflow-hidden bg-brand-dark ${
            featured ? "lg:w-1/2 aspect-[4/3]" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        </div>
      )}
      <div className={`p-5 ${featured ? "lg:flex-1 lg:py-6" : ""}`}>
        <div className="mb-2 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-xs text-brand-accent"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3
          className={`font-semibold text-brand-white ${
            featured ? "text-xl lg:text-2xl" : "text-lg"
          }`}
        >
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-brand-muted leading-relaxed line-clamp-2">
          {article.hook}
        </p>
        <span className="mt-3 inline-block text-sm text-brand-accent group-hover:underline">
          Read the breakdown
        </span>
      </div>
    </Link>
  );
}
