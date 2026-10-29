"use client";

import React from "react";
import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";
import { cn } from "@/lib/utils";

// Concentric rings turning around a small particle globe. Each logo rides a
// ring and counter-rotates so it always stays upright. Pass your own `orbits`;
// `children` sit on the centre line, over the globe (a profile photo). The
// motion is plain CSS (keyframes in globals.css) and stops for people who
// prefer reduced motion. Hover or focus a logo to pause it and read its name.

export type OrbitIcon = {
  /** Path or URL of the logo image. */
  src: string;
  label: string;
  /** Where on the ring it starts, in degrees from the top. */
  angle: number;
};

export type Orbit = {
  /** Tailwind width and height classes for the ring's diameter. */
  size: string;
  /** Seconds for one full turn. */
  duration: number;
  icons: OrbitIcon[];
};

export default function OrbitingCirclesGlobe({
  orbits,
  className,
  globeClassName = "w-40 md:w-48",
  children,
}: {
  orbits: Orbit[];
  /** Sets the height of the whole area, including the strip under the centre line. */
  className?: string;
  /** Width classes for the globe (it is square). */
  globeClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden [--orbit-floor:3.25rem]", className)}>
      {/* Everything above the centre line: the rings and the globe, cut in half */}
      <div className="absolute inset-x-0 bottom-[var(--orbit-floor)] top-0 overflow-hidden">
        <div className={cn("pointer-events-none absolute bottom-0 left-1/2 z-10 aspect-square -translate-x-1/2 translate-y-1/2", globeClassName)}>
          <ParticleSphereAnimation />
        </div>

        {orbits.map((orbit, index) => {
          const cw = index % 2 === 0;
          return (
            <div
              key={index}
              className={cn(
                // the ring is only a line: it must not catch the pointer meant for logos on rings beneath it
                "pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-foreground/10",
                orbit.size
              )}
            >
              {orbit.icons.map(({ src, label, angle }) => (
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
                        "orbit-chip group pointer-events-auto relative flex h-10 w-10 items-center justify-center rounded-full md:h-12 md:w-12",
                        "border border-foreground/10 bg-white shadow-[0_10px_26px_-14px_rgba(30,27,75,0.45)]",
                        "outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      )}
                      style={
                        {
                          "--counter-offset": `${-angle}deg`,
                          animation: `${cw ? "counter-cw" : "counter-ccw"} ${orbit.duration}s linear infinite`,
                        } as React.CSSProperties
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG logos */}
                      <img src={src} alt="" width={24} height={24} draggable={false} className="h-[18px] w-[18px] object-contain md:h-5 md:w-5" />
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
      </div>

      {/* On the centre line, so it overlaps both the rings above and the strip below */}
      {children && <div className="absolute bottom-[var(--orbit-floor)] left-1/2 z-30 -translate-x-1/2 translate-y-1/2">{children}</div>}
    </div>
  );
}
