"use client";
import AnimatedTextCycle from "./AnimatedTextCycle";

export default function AboutHeading() {
  return (
    <h1 className="text-3xl font-bold text-foreground">
      The person behind the{" "}
      <AnimatedTextCycle
        words={["desk", "data", "decisions"]}
        interval={3500}
        className="text-primary"
      />
    </h1>
  );
}
