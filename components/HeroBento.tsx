"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlurFade from "./BlurFade";
import TextShimmer from "./TextShimmer";

function getGreeting(hour: number): { text: string; emoji: string } {
  if (hour >= 5 && hour < 12) return { text: "Good morning, friend", emoji: "sunrise" };
  if (hour >= 12 && hour < 17) return { text: "Good afternoon, friend", emoji: "sun" };
  if (hour >= 17 && hour < 21) return { text: "Good evening, friend", emoji: "sunset" };
  return { text: "Hey there, night owl", emoji: "moon" };
}

const emojiIcons: Record<string, React.ReactNode> = {
  sunrise: (
    <svg className="inline-block h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  sun: (
    <svg className="inline-block h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  sunset: (
    <svg className="inline-block h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  moon: (
    <svg className="inline-block h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
};

export default function HeroBento() {
  const [greetingData, setGreetingData] = useState({ text: "Hey there, friend", emoji: "sunrise" });

  useEffect(() => {
    setGreetingData(getGreeting(new Date().getHours()));
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 lg:p-8">
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0 opacity-20 animate-gradient-mesh"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, var(--primary) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, var(--accent) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="relative z-10">
        <BlurFade delay={0}>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground lg:text-3xl">
            {greetingData.text}
            {emojiIcons[greetingData.emoji]}
          </h1>
        </BlurFade>

        <BlurFade delay={0.1}>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Open to speaking &amp; collaborations
          </span>
        </BlurFade>

        <BlurFade delay={0.2}>
          <p className="mt-3 max-w-xl text-sm leading-relaxed">
            <TextShimmer className="text-base font-medium">
              I break down how supply chains actually work.
            </TextShimmer>
            <span className="block mt-1 text-muted-foreground">
              One real topic at a time, for anyone curious enough to ask why.
            </span>
          </p>
        </BlurFade>

        <BlurFade delay={0.3}>
          <div className="mt-4 flex gap-3">
            <Link
              href="/articles"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Read my articles
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              About me
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
