"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "./Nav";
import Terminal from "./Terminal";
import AnimatedTextCycle from "./AnimatedTextCycle";
import ElectricBorder from "./ElectricBorder";
import siteData from "@/data/site.json";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar: keeps the menu reachable without floating over content */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md lg:hidden">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label="Go to homepage"
          className="flex items-center gap-2"
        >
          <Image
            src="/images/logo-full.png"
            alt="Shetty's Desk"
            width={150}
            height={150}
            priority
            className="h-11 w-auto"
          />
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card shadow-sm"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg
            className="h-5 w-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 border-r border-border bg-sidebar transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <div className="relative z-10 flex h-full flex-col p-6 pt-20 lg:pt-6">
          {/* Brand */}
          <div className="mb-8 flex flex-col items-center">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label="Go to homepage"
              className="rounded-md transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Image
                src="/images/logo-full.png"
                alt="Shetty's Desk"
                width={150}
                height={150}
                priority
                className="h-auto w-[120px]"
              />
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">
              {siteData.subtitle}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <Nav
              primary={siteData.nav.primary}
              secondary={siteData.nav.secondary}
              onNavigate={() => setOpen(false)}
            />
          </div>

          {/* Status indicator */}
          <div className="mt-6 mb-2 text-xs text-primary">
            <AnimatedTextCycle
              words={["building", "writing", "exploring", "shipping"]}
              interval={4000}
              className="text-primary text-xs"
            />
          </div>

          {/* Terminal */}
          <ElectricBorder color="#4f46e5" speed={0.2} chaos={0.08} borderRadius={8}>
            <Terminal />
          </ElectricBorder>
        </div>
      </aside>
    </>
  );
}
