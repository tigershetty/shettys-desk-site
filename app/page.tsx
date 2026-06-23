import Link from "next/link";
import Hero from "@/components/Hero";
import WhatIDo from "@/components/WhatIDo";
import StatsGrid from "@/components/StatsGrid";
import LogoStrip from "@/components/LogoStrip";
import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";
import { getArticles } from "@/lib/articles";

export const revalidate = 600;

export default async function Home() {
  const articles = await getArticles();
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured?.slug).slice(0, 6);

  return (
    <>
      <Hero />

      <LogoStrip />

      <WhatIDo />

      <StatsGrid />

      {/* Latest writing */}
      <section className="py-16 sm:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              From the desk
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Latest writing.
            </h2>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-all hover:gap-2.5"
          >
            View all articles
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

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
