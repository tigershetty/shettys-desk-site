import Link from "next/link";
import BlurFade from "./BlurFade";

export default function Hero() {
  return (
    <section className="flex min-h-[58vh] flex-col justify-center py-10 sm:py-16">
      <BlurFade delay={0}>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Supply Chain &middot; Content
        </p>
      </BlurFade>

      <BlurFade delay={0.08}>
        <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          I break down how supply chains actually work.
        </h1>
      </BlurFade>

      <BlurFade delay={0.16}>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          One real topic at a time, for anyone curious enough to ask why.
          Replenishment Manager at Tetra Pak &mdash; 7+ years across €180M+
          capital-equipment supply chains.
        </p>
      </BlurFade>

      <BlurFade delay={0.24}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Read the articles
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            About me
          </Link>
          <span className="inline-flex items-center gap-2 px-1 text-sm text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Open to speaking &amp; collaborations
          </span>
        </div>
      </BlurFade>
    </section>
  );
}
