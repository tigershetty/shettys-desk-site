"use client";

import { useState } from "react";
import Image from "next/image";
import Nav from "./Nav";
import Terminal from "./Terminal";
import AnimatedTextCycle from "./AnimatedTextCycle";
import { GlassPanel } from "./GlassEffect";
import siteData from "@/data/site.json";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 rounded-xl bg-white/15 p-2 backdrop-blur-sm lg:hidden"
        style={{
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.06), inset 1px 1px 0 rgba(255,255,255,0.35)",
        }}
        aria-label="Toggle menu"
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

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <GlassPanel
        className={`fixed top-0 left-0 z-40 h-screen w-64 rounded-none border-r border-white/10 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Brand */}
          <div className="mb-8 flex flex-col items-center">
            <Image
              src="/images/logo.png"
              alt="Shetty's Desk"
              width={96}
              height={96}
              className="rounded-2xl"
              style={{
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.3)",
              }}
            />
            <p className="mt-2 text-xs text-muted-foreground">
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
          <div>
            <Terminal />
          </div>
        </div>
      </GlassPanel>
    </>
  );
}
