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

      {/* Dark wrapper for featured article */}
      <div className="lg:col-span-2 lg:row-span-2 min-h-0">
        <BlurFade delay={0.1} className="h-full">
          <div className="h-full rounded-3xl bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 p-5">
            <h2 className="mb-4 text-sm font-semibold text-primary-foreground/80 uppercase tracking-wider">
              Latest articles
            </h2>
            {featured[0] && (
              <ArticleCard article={featured[0]} featured />
            )}
          </div>
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
