"use client";
import AnimatedTextCycle from "./AnimatedTextCycle";

export default function ArticlesHeading() {
  return (
    <h1 className="text-3xl font-bold text-foreground">
      Supply chain, one{" "}
      <AnimatedTextCycle
        words={["breakdown", "question", "story"]}
        interval={3500}
        className="text-primary"
      />{" "}
      at a time
    </h1>
  );
}
