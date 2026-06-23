import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";
import { getArticles } from "@/lib/articles";

export const revalidate = 600;

export default async function ArticlesPage() {
  const articles = await getArticles();
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <>
      <header className="max-w-2xl py-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Published posts
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Writing from the desk.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Each one starts with a question I couldn&apos;t answer in one sentence.
        </p>
      </header>

      <section className="mt-12">
        {featured && (
          <Reveal>
            <ArticleCard article={featured} featured />
          </Reveal>
        )}

        {rest.length > 0 && (
          <Reveal
            stagger={0.1}
            className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {rest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </Reveal>
        )}
      </section>
    </>
  );
}
