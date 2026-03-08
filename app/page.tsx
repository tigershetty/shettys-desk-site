import Greeting from "@/components/Greeting";
import ArticleCard from "@/components/ArticleCard";
import StatsGrid from "@/components/StatsGrid";
import RadarSection from "@/components/RadarSection";
import articles from "@/data/articles.json";

export default function Home() {
  const featured = articles.filter((a) => a.featured);
  const recent = articles.filter((a) => !a.featured).slice(0, 2);
  const topArticles = [...featured, ...recent];

  return (
    <>
      <Greeting />

      <section className="mb-12">
        <h2 className="mb-6 text-lg font-semibold text-brand-white">
          Featured articles
        </h2>
        <div className="space-y-6">
          {topArticles.slice(0, 1).map((article) => (
            <ArticleCard key={article.slug} article={article} featured />
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {topArticles.slice(1).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <StatsGrid />
      <RadarSection />
    </>
  );
}
