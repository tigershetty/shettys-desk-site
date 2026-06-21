import { Sparkles, Code2, Coffee, Heart, Triangle } from "lucide-react";
import { AnimatedCard } from "./ui/animated-card";

export default function Footer() {
  return (
    <footer className="flex justify-center px-6 py-10">
      <AnimatedCard
        className="border-border bg-card shadow-sm"
        title="Built with curiosity"
        description="Made with Claude Code, Next.js, Tailwind and Vercel. And a generous amount of coffee and trial and error."
        icons={[
          { icon: <Sparkles className="h-4 w-4 text-indigo-500" />, size: "sm" },
          { icon: <Code2 className="h-6 w-6 text-sky-500" />, size: "md" },
          { icon: <Coffee className="h-7 w-7 text-amber-500" />, size: "lg" },
          { icon: <Triangle className="h-6 w-6 text-foreground" />, size: "md" },
          { icon: <Heart className="h-4 w-4 text-rose-500" />, size: "sm" },
        ]}
      />
    </footer>
  );
}
