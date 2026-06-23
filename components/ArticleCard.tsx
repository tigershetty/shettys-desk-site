import Image from "next/image";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  hook: string;
  image: string | null;
  tags: string[];
  linkedinUrl?: string;
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, 3).map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ReadMore({ label = "Read" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-all group-hover:gap-2.5">
      {label}
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </span>
  );
}

export default function ArticleCard({
  article,
  featured = false,
  bento = false,
}: {
  article: Article;
  featured?: boolean;
  bento?: boolean;
}) {
  const articleUrl = `/articles/${article.slug}`;

  // Compact row: small thumbnail + title.
  if (bento) {
    return (
      <Link
        href={articleUrl}
        className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-all duration-300 hover:border-foreground/20 hover:shadow-sm"
      >
        {article.image && (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <Image src={article.image} alt={article.title} fill className="object-cover" sizes="56px" />
          </div>
        )}
        <p className="line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </p>
      </Link>
    );
  }

  // Large horizontal feature card.
  if (featured) {
    return (
      <Link
        href={articleUrl}
        className="group grid overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-md sm:grid-cols-2"
      >
        {article.image && (
          <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:h-full sm:min-h-[18rem]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority
            />
          </div>
        )}
        <div className="flex flex-col justify-center p-7 sm:p-9">
          <Tags tags={article.tags} />
          <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-foreground">
            {article.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {article.hook}
          </p>
          <div className="mt-6">
            <ReadMore label="Read article" />
          </div>
        </div>
      </Link>
    );
  }

  // Default vertical card.
  return (
    <Link
      href={articleUrl}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-md"
    >
      {article.image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <Tags tags={article.tags} />
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
          {article.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {article.hook}
        </p>
        <div className="mt-4">
          <ReadMore />
        </div>
      </div>
    </Link>
  );
}
