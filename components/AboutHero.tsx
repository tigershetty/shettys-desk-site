"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OrbitingCirclesGlobe, { type Orbit } from "@/components/ui/orbiting-circles-02";
import { identity } from "@/data/profile";

// The top of About: the tools of the work as real logos, in orbit around a
// small particle globe that links Bangalore to Malmö, with the person at its
// centre. Logos are static SVGs in /public/images/logos (from open icon sets).

const orbits: Orbit[] = [
  {
    size: "w-[190px] h-[190px] md:w-[220px] md:h-[220px]",
    duration: 80,
    icons: [
      { src: "/images/logos/claude.svg", label: "Claude Code", angle: 0 },
      { src: "/images/logos/sap.svg", label: "SAP ECC and IBP", angle: 120 },
      { src: "/images/logos/excel.svg", label: "Excel", angle: 240 },
    ],
  },
  {
    size: "w-[300px] h-[300px] md:w-[350px] md:h-[350px]",
    duration: 110,
    icons: [
      { src: "/images/logos/power-bi.svg", label: "Power BI", angle: 60 },
      { src: "/images/logos/copilot.svg", label: "Microsoft Copilot Studio", angle: 180 },
      { src: "/images/logos/github.svg", label: "GitHub", angle: 300 },
    ],
  },
  {
    size: "w-[410px] h-[410px] md:w-[480px] md:h-[480px]",
    duration: 140,
    icons: [
      { src: "/images/logos/nextjs.svg", label: "Next.js", angle: 30 },
      { src: "/images/logos/vercel.svg", label: "Vercel", angle: 210 },
    ],
  },
];

const tools = orbits.flatMap((o) => o.icons.map((i) => i.label));

export default function AboutHero() {
  return (
    <section
      aria-label={identity.name}
      className="relative mb-10 overflow-hidden rounded-3xl border border-border bg-card bg-[radial-gradient(ellipse_70%_50%_at_50%_70%,rgba(79,70,229,0.08),transparent)]"
    >
      <OrbitingCirclesGlobe orbits={orbits} className="h-[16.5rem] md:h-[19.5rem]">
        <Avatar className="h-[84px] w-[84px] border-2 border-primary/30 shadow-md ring-4 ring-white">
          <AvatarImage src="/images/profile.png" alt="Poornajith Shetty" className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">PS</AvatarFallback>
        </Avatar>
      </OrbitingCirclesGlobe>

      <div className="px-4 pb-6 text-center">
        <p className="text-lg font-semibold tracking-tight text-foreground">{identity.name}</p>
        <p className="text-sm text-muted-foreground">Replenishment Manager at {identity.employer}, {identity.workplace} &middot; based in {identity.home}</p>
        <a
          href={identity.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Connect on LinkedIn
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
        <p className="mt-2 text-xs text-muted-foreground/70">Tap or hover a logo to see the tool</p>
      </div>

      <ul className="sr-only">
        {tools.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </section>
  );
}
