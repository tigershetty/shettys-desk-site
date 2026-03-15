"use client";

import React from "react";

/**
 * GlassCard — 3-layer glass effect for bounded card-sized elements.
 * Uses backdrop-filter + specular gradient + inner refraction edges.
 * Works best on elements over contrasting or colorful backgrounds.
 */
export function GlassCard({
  children,
  className = "",
  blur = 12,
  tint = 0.06,
}: {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  tint?: number;
}) {
  return (
    <div className={`relative ${className}`} style={{ background: "transparent" }}>
      {/* Layer 1: backdrop blur */}
      <div
        className="absolute inset-0 z-0 rounded-[inherit]"
        style={{
          backdropFilter: `blur(${blur}px) saturate(1.4)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(1.4)`,
          background: `rgba(255, 255, 255, ${tint})`,
        }}
      />
      {/* Layer 2: specular highlight */}
      <div
        className="absolute inset-0 z-10 rounded-[inherit] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.0) 50%, rgba(255,255,255,0.05) 100%)",
        }}
      />
      {/* Layer 3: inner refraction edges */}
      <div
        className="absolute inset-0 z-20 rounded-[inherit] pointer-events-none"
        style={{
          boxShadow:
            "inset 1px 1px 0 0 rgba(255, 255, 255, 0.35), inset -1px -1px 0 0 rgba(255, 255, 255, 0.12), 0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
      />
      {/* Content */}
      <div className="relative z-30">{children}</div>
    </div>
  );
}

/**
 * GlassEdge — lightweight CSS-only glass accent.
 * Adds inner-light refraction edges and a subtle specular gradient.
 * Use on nav pills, buttons, badges — no backdrop-filter needed.
 */
export function GlassEdge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        boxShadow:
          "inset 1px 1px 0 0 rgba(255, 255, 255, 0.4), inset -1px -1px 0 0 rgba(255, 255, 255, 0.15)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.0) 60%)",
      }}
    >
      {children}
    </div>
  );
}
