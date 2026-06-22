import HeroBento from "@/components/HeroBento";
import ArticleCard from "@/components/ArticleCard";
import StatsGrid from "@/components/StatsGrid";
import RadarSection from "@/components/RadarSection";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import FolderCard from "@/components/FolderCard";
import { getArticles } from "@/lib/articles";

export const revalidate = 600;

export default async function Home() {
  const articles = await getArticles();
  const featured = articles.filter((a) => a.featured);
  const secondary = articles.filter((a) => !a.featured).slice(0, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto_auto]">
      {/* Hero - full width */}
      <div className="lg:col-span-4">
        <HeroBento />
      </div>

      {/* Latest articles - folder */}
      <div className="lg:col-span-2 lg:row-span-2 min-h-0">
        <Reveal className="h-full">
          <FolderCard label="Latest articles" color="indigo" className="h-full">
            {featured[0] && <ArticleCard article={featured[0]} featured />}
          </FolderCard>
        </Reveal>
      </div>

      {/* My numbers - folder */}
      <div className="lg:col-span-2">
        <Reveal>
          <FolderCard label="My numbers" color="amber">
            <StatsGrid bare />
          </FolderCard>
        </Reveal>
      </div>

      {/* Supply chain radar - folder */}
      <div className="lg:col-span-2">
        <Reveal>
          <FolderCard label="Supply chain radar" color="teal">
            <RadarSection bare />
          </FolderCard>
        </Reveal>
      </div>

      {/* More reads */}
      <div className="lg:col-span-4 mt-2">
        <SplitHeading
          text="More from the desk"
          className="text-lg font-bold text-foreground lg:text-xl"
        />
      </div>

      {/* Secondary articles - 4 compact cards */}
      {secondary.map((article) => (
        <div key={article.slug} className="lg:col-span-1">
          <Reveal>
            <ArticleCard article={article} bento />
          </Reveal>
        </div>
      ))}
    </div>
  );
}
