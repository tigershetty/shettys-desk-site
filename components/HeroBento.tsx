"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import BlurFade from "./BlurFade";
import AnimatedTextCycle from "./AnimatedTextCycle";
import { MorphingText } from "./MorphingText";
import DecryptedText from "./DecryptedText";
import Magnetic from "./Magnetic";

const HeroParticles = dynamic(() => import("./HeroParticles"), { ssr: false });

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
    // Client-only: derive the greeting from local time after mount to avoid an
    // SSR/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreetingData(getGreeting(new Date().getHours()));
  }, []);

  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 lg:p-8 shadow-sm"
    >
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0 opacity-20 animate-gradient-mesh motion-reduce:animate-none"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, var(--primary) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, var(--accent) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* three.js logistics-node field */}
      <HeroParticles />

      <div className="relative z-10">
        <BlurFade delay={0}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Shetty&apos;s Desk &middot; Supply chain, decoded
          </p>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            <DecryptedText
              text={greetingData.text}
              speed={35}
              delay={200}
              key={greetingData.text}
            />
            {emojiIcons[greetingData.emoji]}
          </h1>
        </BlurFade>

        <BlurFade delay={0.2}>
          <div className="mt-4 max-w-xl leading-relaxed">
            <span className="text-lg font-medium text-foreground lg:text-xl">
              I break down how{" "}
              <AnimatedTextCycle
                words={["supply chains", "logistics", "operations", "S&OP"]}
                interval={3000}
                className="text-primary font-bold"
              />{" "}
              actually works.
            </span>
            <p className="mt-1.5 text-sm text-muted-foreground lg:text-base">
              One real topic at a time, for anyone curious enough to ask why.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.3}>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex gap-3">
              <Magnetic>
                <Link
                  href="/articles"
                  className="block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Read my articles
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/about"
                  className="block rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  About me
                </Link>
              </Magnetic>
            </div>
            <span
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <MorphingText
                texts={[
                  "Open to networking",
                  "Open to partnerships",
                  "Open to experiences",
                  "Open to brainstorming",
                  "Available for collaborations",
                ]}
                className="text-xs font-medium text-primary"
              />
            </span>
          </div>
        </BlurFade>
      </div>

      {/* Profile thumbnail anchored to the right of the network */}
      <div className="relative z-10 mt-8 flex flex-col items-center gap-2 lg:absolute lg:right-8 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2">
        <Avatar className="h-24 w-24 border-2 border-primary/30 shadow-md ring-4 ring-card">
          <AvatarImage
            src="/images/profile.png"
            alt="Poornajith Shetty"
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
            PS
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground">
          Poornajith Shetty
        </span>
      </div>
    </section>
  );
}
