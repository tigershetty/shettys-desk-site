import HeroBento from "@/components/HeroBento";
import ArticleCard from "@/components/ArticleCard";
import StatsGrid from "@/components/StatsGrid";
import RadarSection from "@/components/RadarSection";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import Folder from "@/components/Folder";
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
        <Reveal className="h-full">
          <div className="h-full rounded-3xl bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 p-5">
            <h2 className="mb-4 text-sm font-semibold text-primary-foreground/80 uppercase tracking-wider">
              Latest articles
            </h2>
            {featured[0] && <ArticleCard article={featured[0]} featured />}
          </div>
        </Reveal>
      </div>

      {/* My Numbers - top right */}
      <div className="lg:col-span-2">
        <Reveal>
          <StatsGrid />
        </Reveal>
      </div>

      {/* Radar - bottom right */}
      <div className="lg:col-span-2">
        <Reveal>
          <RadarSection />
        </Reveal>
      </div>

      {/* Secondary articles - 4 compact cards */}
      {secondary.map((article) => (
        <div key={article.slug} className="lg:col-span-1">
          <Reveal>
            <ArticleCard article={article} bento />
          </Reveal>
        </div>
      ))}

      {/* Explore - brand folder cards */}
      <div className="lg:col-span-4 mt-2">
        <SplitHeading
          text="Explore the desk"
          className="text-xl font-bold text-foreground lg:text-2xl"
        />
        <Reveal
          stagger={0.08}
          className="mt-6 flex flex-wrap justify-center gap-6 sm:justify-start sm:gap-8"
        >
          <Folder color="indigo" size="md" label="Articles" href="/articles" />
          <Folder color="amber" size="md" label="Approach" href="/approach" />
          <Folder color="teal" size="md" label="About" href="/about" />
          <Folder color="dark" size="md" label="Experience" href="/experience" />
        </Reveal>
      </div>
    </div>
  );
}
