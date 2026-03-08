import Image from "next/image";
import Link from "next/link";

const accentColors: Record<string, { bg: string; border: string; tag: string; ring: string }> = {
  blue:    { bg: "bg-blue-500/8",    border: "border-blue-500/20",    tag: "bg-blue-500/15 text-blue-600",    ring: "hover:ring-blue-500/30" },
  emerald: { bg: "bg-emerald-500/8", border: "border-emerald-500/20", tag: "bg-emerald-500/15 text-emerald-600", ring: "hover:ring-emerald-500/30" },
  orange:  { bg: "bg-orange-500/8",  border: "border-orange-500/20",  tag: "bg-orange-500/15 text-orange-600",  ring: "hover:ring-orange-500/30" },
  amber:   { bg: "bg-amber-500/8",   border: "border-amber-500/20",   tag: "bg-amber-500/15 text-amber-600",   ring: "hover:ring-amber-500/30" },
  rose:    { bg: "bg-rose-500/8",    border: "border-rose-500/20",    tag: "bg-rose-500/15 text-rose-600",    ring: "hover:ring-rose-500/30" },
};

interface Article {
  slug: string;
  title: string;
  hook: string;
  image: string | null;
  tags: string[];
  accent?: string;
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
  const colors = accentColors[article.accent || "blue"];

  // Compact bento card: thumbnail + title only
  if (bento) {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className={`group flex items-center gap-3 rounded-xl border ${colors.border} bg-card p-3 transition-all duration-300 hover:shadow-md hover:ring-1 ${colors.ring}`}
      >
        {article.image && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}
        <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </p>
      </Link>
    );
  }

  // Featured card: image background with overlay
  if (featured) {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20"
      >
        {article.image && (
          <div className="relative aspect-[16/10] max-h-[400px]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="mb-2 inline-block rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary-foreground">
            Featured
          </span>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-semibold text-white lg:text-2xl">
            {article.title}
          </h3>
          <p className="mt-1 text-sm text-white/70 line-clamp-2">
            {article.hook}
          </p>
        </div>
      </Link>
    );
  }

  // Default card (used on /articles page)
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group block rounded-2xl border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-300 hover:shadow-md hover:ring-1 ${colors.ring}`}
    >
      {article.image && (
        <div className="relative aspect-[16/10] max-h-[240px] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.tag}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {article.hook}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
          Read the breakdown
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
