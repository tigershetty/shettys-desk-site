import ArticleCard from "@/components/ArticleCard";
import articles from "@/data/articles.json";

export default function ArticlesPage() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          Supply chain, one breakdown at a time
        </h1>
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
