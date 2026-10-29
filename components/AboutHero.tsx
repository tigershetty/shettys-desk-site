"use client";

import { BarChart3, Bot, CalendarRange, Database, HeartHandshake, Mic, RefreshCw, Sheet, ShoppingCart, Boxes, Terminal, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OrbitingCirclesGlobe, { type Orbit } from "@/components/ui/orbiting-circles-02";
import siteData from "@/data/site.json";

// The top of About: the domains, people and tools of the work in orbit around
// a particle globe that links Bangalore to Malmö, with the person at its foot.

const orbits: Orbit[] = [
  {
    size: "w-110 h-110 md:w-180 md:h-180",
    duration: 70,
    icons: [
      { icon: CalendarRange, label: "Supply & production planning", angle: 0, tone: "teal" },
      { icon: RefreshCw, label: "S&OP and IBP", angle: 90, tone: "teal" },
      { icon: ShoppingCart, label: "Purchasing & sourcing", angle: 180, tone: "teal" },
      { icon: Boxes, label: "Inventory & replenishment", angle: 270, tone: "teal" },
    ],
  },
  {
    size: "w-150 h-150 md:w-220 md:h-220",
    duration: 95,
    icons: [
      { icon: Users, label: "Team leadership", angle: 30, tone: "amber" },
      { icon: HeartHandshake, label: "People & inclusion", angle: 150, tone: "amber" },
      { icon: Mic, label: "Public speaking", angle: 270, tone: "amber" },
    ],
  },
  {
    size: "w-180 h-180 md:w-265 md:h-265",
    duration: 120,
    icons: [
      { icon: Database, label: "SAP ECC and IBP", angle: 0, tone: "indigo" },
      { icon: BarChart3, label: "Power BI", angle: 72, tone: "indigo" },
      { icon: Sheet, label: "Excel", angle: 144, tone: "indigo" },
      { icon: Bot, label: "Copilot Studio", angle: 216, tone: "indigo" },
      { icon: Terminal, label: "Claude Code", angle: 288, tone: "indigo" },
    ],
  },
];

const all = orbits.flatMap((o) => o.icons.map((i) => i.label));

export default function AboutHero() {
  return (
    <section
      aria-label="Poornajith Shetty"
      className="relative mb-10 overflow-hidden rounded-3xl border border-border bg-card bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(79,70,229,0.10),transparent)]"
    >
      <OrbitingCirclesGlobe orbits={orbits} className="h-[30rem] md:h-[37rem]">
        <div className="pointer-events-auto mb-5 flex flex-col items-center rounded-2xl border border-foreground/10 bg-white/80 px-5 pb-3.5 pt-4 text-center md:px-7 md:pb-4 md:pt-5 shadow-[0_24px_50px_-30px_rgba(30,27,75,0.55)] backdrop-blur-md md:mb-8">
          <Avatar className="mb-2.5 h-16 w-16 border-2 md:mb-3 md:h-20 md:w-20 border-primary/30 shadow-md ring-4 ring-white">
            <AvatarImage src="/images/profile.png" alt="Poornajith Shetty" className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">PS</AvatarFallback>
          </Avatar>
          <p className="text-lg font-semibold tracking-tight text-foreground">Poornajith Shetty</p>
          <p className="text-sm text-muted-foreground">Replenishment Manager at Tetra Pak, Malm&ouml;</p>
          <p className="mt-2 text-xs text-muted-foreground/70">Tap or hover an icon to see what it is</p>
          <a
            href={siteData.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Connect on LinkedIn
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </OrbitingCirclesGlobe>
      <ul className="sr-only">
        {all.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </section>
  );
}
