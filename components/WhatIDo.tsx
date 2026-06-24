import Link from "next/link";
import { PenLine, Boxes, Mic } from "lucide-react";
import Reveal from "./Reveal";

const pillars = [
  {
    no: "01",
    Icon: PenLine,
    title: "Break it down",
    body: "Essays and LinkedIn posts that turn messy supply-chain topics into clear, usable frameworks — for anyone curious enough to ask why.",
    href: "/articles",
    cta: "Read the writing",
  },
  {
    no: "02",
    Icon: Boxes,
    title: "Run the operation",
    body: "Replenishment management for €180M+ capital-equipment supply chains at Tetra Pak — planning, sourcing, and execution at real scale.",
    href: "/experience",
    cta: "See the experience",
  },
  {
    no: "03",
    Icon: Mic,
    title: "Bring people in",
    body: "Speaking, DE&I Europe panels, and culture work. Making complex things simple — whether in a planning meeting or on a stage.",
    href: "/about",
    cta: "More about me",
  },
];

export default function WhatIDo() {
  return (
    <section className="mt-2">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          What I do
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground lg:text-2xl">
          Three ways the work shows up
        </h2>
      </div>

      <Reveal stagger={0.1} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => (
          <Link
            key={p.no}
            href={p.href}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <p.Icon className="h-5 w-5" />
              </span>
              <span className="font-mono text-xs text-muted-foreground/50">{p.no}</span>
            </div>
            <h3 className="font-semibold text-foreground">{p.title}</h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
              {p.body}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5">
              {p.cta}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
