import ArticleCard from "@/components/ArticleCard";
import ArticlesHeading from "@/components/ArticlesHeading";
import FolderCard from "@/components/FolderCard";
import Reveal from "@/components/Reveal";
import articles from "@/data/articles.json";

const folderColors = ["teal", "amber", "indigo", "dark"] as const;

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

      <section>
        <div className="grid gap-7 sm:grid-cols-2">
          {featured && (
            <Reveal className="sm:col-span-2">
              <FolderCard label="Featured" color="indigo">
                <ArticleCard article={featured} folder wide />
              </FolderCard>
            </Reveal>
          )}

          {rest.map((article, i) => (
            <Reveal key={article.slug}>
              <FolderCard
                label={article.tags[0] ?? "Post"}
                color={folderColors[i % folderColors.length]}
              >
                <ArticleCard article={article} folder />
              </FolderCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
