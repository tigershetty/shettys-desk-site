"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning, friend";
  if (hour >= 12 && hour < 17) return "Good afternoon, friend";
  if (hour >= 17 && hour < 21) return "Good evening, friend";
  return "Hey there, night owl";
}

export default function Greeting() {
  const [greeting, setGreeting] = useState("Hey there, friend");

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  return (
    <section className="mb-12">
      <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
        {greeting}
      </h1>
      <span className="mt-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
        Open to speaking &amp; collaborations
      </span>
      <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
        This is Shetty&apos;s Desk. I break down how supply chains actually
        work. One real topic at a time, for anyone curious enough to ask why.
      </p>
    </section>
  );
}
