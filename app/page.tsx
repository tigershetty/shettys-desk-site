import HeroBento from "@/components/HeroBento";
import ArticleCard from "@/components/ArticleCard";
import StatsGrid from "@/components/StatsGrid";
import RadarSection from "@/components/RadarSection";
import BlurFade from "@/components/BlurFade";
import articles from "@/data/articles.json";

export default function Home() {
  const featured = articles.filter((a) => a.featured);
  const secondary = articles.filter((a) => !a.featured).slice(0, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto_auto]">
      {/* Hero - full width */}
      <div className="lg:col-span-4">
        <HeroBento />
      </div>

      {/* Featured article - 2 cols, 2 rows */}
      <div className="lg:col-span-2 lg:row-span-2">
        <BlurFade delay={0.1}>
          {featured[0] && (
            <ArticleCard article={featured[0]} featured />
          )}
        </BlurFade>
      </div>

      {/* My Numbers - top right */}
      <div className="lg:col-span-2">
        <BlurFade delay={0.2}>
          <StatsGrid />
        </BlurFade>
      </div>

      {/* Radar - bottom right */}
      <div className="lg:col-span-2">
        <BlurFade delay={0.3}>
          <RadarSection />
        </BlurFade>
      </div>

      {/* Secondary articles - 4 compact cards */}
      {secondary.map((article, i) => (
        <div key={article.slug} className="lg:col-span-1">
          <BlurFade delay={0.4 + i * 0.05}>
            <ArticleCard article={article} bento />
          </BlurFade>
        </div>
      ))}
    </div>
  );
}
