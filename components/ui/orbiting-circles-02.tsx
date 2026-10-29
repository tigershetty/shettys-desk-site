"use client";

import type { LucideIcon } from "lucide-react";
import { Boxes, CalendarRange, Compass, Handshake, Sparkles, Users } from "lucide-react";
import React from "react";
import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";
import { cn } from "@/lib/utils";

// Concentric rings turning around a half-risen particle globe. Each icon rides
// a ring and counter-rotates so it always stays upright. Pass your own
// `orbits`; `children` sit centred over the globe (a profile, a headline).
// The motion is plain CSS (keyframes in globals.css) and stops for people who
// prefer reduced motion. Hover or focus an icon to pause it and read its name.

export type OrbitTone = "indigo" | "teal" | "amber";

export type OrbitIcon = {
  icon: LucideIcon;
  label: string;
  /** Where on the ring it starts, in degrees from the top. */
  angle: number;
  tone?: OrbitTone;
};

export type Orbit = {
  /** Tailwind width and height classes for the ring's diameter. */
  size: string;
  /** Seconds for one full turn. */
  duration: number;
  icons: OrbitIcon[];
};

const toneClass: Record<OrbitTone, string> = {
  indigo: "text-primary",
  teal: "text-teal-600",
  amber: "text-amber-500",
};

export const defaultOrbits: Orbit[] = [
  {
    size: "w-110 h-110 md:w-180 md:h-180",
    duration: 70,
    icons: [
      { icon: CalendarRange, label: "Planning", angle: 0, tone: "teal" },
      { icon: Boxes, label: "Inventory", angle: 120, tone: "teal" },
      { icon: Handshake, label: "Sourcing", angle: 240, tone: "teal" },
    ],
  },
  {
    size: "w-150 h-150 md:w-220 md:h-220",
    duration: 95,
    icons: [
      { icon: Users, label: "People", angle: 60, tone: "amber" },
      { icon: Compass, label: "Direction", angle: 240, tone: "amber" },
    ],
  },
  {
    size: "w-180 h-180 md:w-265 md:h-265",
    duration: 120,
    icons: [
      { icon: Sparkles, label: "AI", angle: 0, tone: "indigo" },
      { icon: Sparkles, label: "Automation", angle: 180, tone: "indigo" },
    ],
  },
];

export default function OrbitingCirclesGlobe({
  orbits = defaultOrbits,
  className,
  children,
}: {
  orbits?: Orbit[];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative flex h-110 w-full justify-center overflow-hidden md:h-160", className)}>
      {/* Centre particle globe */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 aspect-square w-80 -translate-x-1/2 translate-y-1/2 md:w-170">
        <ParticleSphereAnimation />
      </div>

      {/* Orbiting rings */}
      {orbits.map((orbit, index) => {
        const cw = index % 2 === 0;
        return (
          <div
            key={index}
            className={cn(
              // the ring is only a line: it must not catch the pointer meant for icons on rings beneath it
              "pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-foreground/10",
              orbit.size
            )}
          >
            {orbit.icons.map(({ icon: Icon, label, angle, tone = "indigo" }) => (
              <div
                key={label}
                className="orbit-rot absolute left-1/2 top-0 h-1/2 w-0 origin-bottom"
                style={
                  {
                    "--start-angle": `${angle}deg`,
                    animation: `${cw ? "orbit-cw" : "orbit-ccw"} ${orbit.duration}s linear infinite`,
                  } as React.CSSProperties
                }
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                  <div
                    tabIndex={0}
                    role="img"
                    aria-label={label}
                    className={cn(
                      "orbit-chip group pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full md:h-14 md:w-14",
                      "border border-foreground/10 bg-white/90 shadow-[0_10px_26px_-14px_rgba(30,27,75,0.45)] backdrop-blur",
                      "outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    )}
                    style={
                      {
                        "--counter-offset": `${-angle}deg`,
                        animation: `${cw ? "counter-cw" : "counter-ccw"} ${orbit.duration}s linear infinite`,
                      } as React.CSSProperties
                    }
                  >
                    <Icon className={cn("h-5 w-5 md:h-6 md:w-6", toneClass[tone])} strokeWidth={1.6} />
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
                      {label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {children && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center">{children}</div>}
    </div>
  );
}
