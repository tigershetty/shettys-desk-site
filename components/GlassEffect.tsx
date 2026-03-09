"use client";

import React from "react";

/**
 * SVG filter that produces the liquid glass distortion.
 * Best on smaller elements (cards, buttons). On large surfaces
 * like the sidebar, we skip this and rely on backdrop-filter only.
 */
export function GlassFilter() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true">
      <filter
        id="glass-distortion"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.001 0.005"
          numOctaves="1"
          seed="17"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting
          in="softMap"
          surfaceScale="5"
          specularConstant="1"
          specularExponent="100"
          lightingColor="white"
          result="specLight"
        >
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="1"
          k4="0"
          result="litImage"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="80"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

/**
 * Wraps children in the liquid glass layered effect.
 * The container MUST NOT have any opaque background — it relies on
 * backdrop-filter to show what's behind it.
 */
export function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${className}`}
      style={{
        background: "transparent",
      }}
    >
      {/* Layer 1: backdrop blur — this is what makes the background visible but softened */}
      <div
        className="absolute inset-0 z-0 rounded-[inherit]"
        style={{
          backdropFilter: "blur(16px) saturate(1.4)",
          WebkitBackdropFilter: "blur(16px) saturate(1.4)",
          background: "rgba(255, 255, 255, 0.12)",
        }}
      />

      {/* Layer 2: specular highlight gradient — simulates light hitting glass */}
      <div
        className="absolute inset-0 z-10 rounded-[inherit] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.0) 50%, rgba(255,255,255,0.06) 100%)",
        }}
      />

      {/* Layer 3: inner light refraction edges */}
      <div
        className="absolute inset-0 z-20 rounded-[inherit] pointer-events-none"
        style={{
          boxShadow:
            "inset 1px 1px 0 0 rgba(255, 255, 255, 0.4), inset -1px -1px 0 0 rgba(255, 255, 255, 0.15), 0 4px 24px rgba(0, 0, 0, 0.06)",
        }}
      />

      {/* Content */}
      <div className="relative z-30">{children}</div>
    </div>
  );
}
