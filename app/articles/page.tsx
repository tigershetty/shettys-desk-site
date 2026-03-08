import ArticleCard from "@/components/ArticleCard";
import ArticlesHeading from "@/components/ArticlesHeading";
import articles from "@/data/articles.json";

export default function ArticlesPage() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <>
      <section className="mb-10">
        <ArticlesHeading />
        <p className="mt-2 text-muted-foreground">
          Each one starts with a question I couldn&apos;t answer in one
          sentence.
        </p>
      </section>

      {featured && (
        <section className="mb-8">
          <ArticleCard article={featured} featured />
        </section>
      )}

      <section>
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
