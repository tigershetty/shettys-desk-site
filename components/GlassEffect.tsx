"use client";

import React from "react";

/**
 * SVG filter that produces the liquid glass distortion.
 * Rendered once (hidden) and referenced by id.
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
      className={`relative overflow-hidden ${className}`}
      style={{
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.12), 0 0 20px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Layer 1: backdrop blur + distortion */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        style={{
          backdropFilter: "blur(12px) saturate(1.2)",
          WebkitBackdropFilter: "blur(12px) saturate(1.2)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />

      {/* Layer 2: frosted tint */}
      <div
        className="absolute inset-0 z-10 rounded-[inherit]"
        style={{ background: "rgba(255, 255, 255, 0.18)" }}
      />

      {/* Layer 3: inner light edges */}
      <div
        className="absolute inset-0 z-20 rounded-[inherit] overflow-hidden"
        style={{
          boxShadow:
            "inset 1px 1px 1px 0 rgba(255, 255, 255, 0.45), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.25)",
        }}
      />

      {/* Content */}
      <div className="relative z-30">{children}</div>
    </div>
  );
}
