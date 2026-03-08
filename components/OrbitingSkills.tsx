"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

// --- Type Definitions ---
type IconType =
  | "sap" | "powerbi" | "excel" | "claude" | "linkedin"
  | "sop" | "planning" | "purchasing" | "inventory" | "leadership" | "people";

type GlowColor = "blue" | "amber";

interface SkillConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  iconType: IconType;
  phaseShift: number;
  glowColor: GlowColor;
  label: string;
}

// --- SVG Icon Components ---
const iconComponents: Record<IconType, { component: () => React.ReactNode; color: string }> = {
  sap: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#0070F2" />
        <text x="12" y="15.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">SAP</text>
      </svg>
    ),
    color: "#0070F2",
  },
  powerbi: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect x="4" y="10" width="4" height="10" rx="1" fill="#F2C811" />
        <rect x="10" y="6" width="4" height="14" rx="1" fill="#F2C811" />
        <rect x="16" y="2" width="4" height="18" rx="1" fill="#F2C811" />
      </svg>
    ),
    color: "#F2C811",
  },
  excel: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#217346" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif">X</text>
      </svg>
    ),
    color: "#217346",
  },
  claude: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#D97706" />
        <path d="M7 8l5 4-5 4M13 16h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#D97706",
  },
  linkedin: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#0A66C2" />
        <path d="M8 10v6M8 7v.01M11 10v6m0-3.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#0A66C2",
  },
  sop: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="1.5" />
        <path d="M12 2v10l7 7" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="#f59e0b" />
      </svg>
    ),
    color: "#f59e0b",
  },
  planning: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="#fb923c" strokeWidth="1.5" />
        <path d="M3 9h18M8 4v5M16 4v5" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="15" r="2" fill="#fb923c" />
      </svg>
    ),
    color: "#fb923c",
  },
  purchasing: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <path d="M3 3h2l3 12h10l3-8H8" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="19" r="1.5" fill="#f97316" />
        <circle cx="17" cy="19" r="1.5" fill="#f97316" />
      </svg>
    ),
    color: "#f97316",
  },
  inventory: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="#fbbf24" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="#fbbf24" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="#fbbf24" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="#fbbf24" strokeWidth="1.5" />
      </svg>
    ),
    color: "#fbbf24",
  },
  leadership: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <path d="M12 2l3 6 6 1-4.5 4L17.5 20 12 17l-5.5 3 1-7L3 9l6-1z" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#f59e0b",
  },
  people: {
    component: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <circle cx="9" cy="7" r="3" stroke="#fb923c" strokeWidth="1.5" />
        <circle cx="17" cy="7" r="2.5" stroke="#fb923c" strokeWidth="1.5" />
        <path d="M2 20c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 14c2.2 0 4 1.8 4 4v2" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: "#fb923c",
  },
};

// --- Skill configs ---
const skillsConfig: SkillConfig[] = [
  // Inner orbit — Tools (5 items, evenly spaced)
  { id: "sap", orbitRadius: 80, size: 36, speed: 0.6, iconType: "sap", phaseShift: 0, glowColor: "blue", label: "SAP" },
  { id: "powerbi", orbitRadius: 80, size: 36, speed: 0.6, iconType: "powerbi", phaseShift: (2 * Math.PI) / 5, glowColor: "blue", label: "Power BI" },
  { id: "excel", orbitRadius: 80, size: 36, speed: 0.6, iconType: "excel", phaseShift: (4 * Math.PI) / 5, glowColor: "blue", label: "Excel" },
  { id: "claude", orbitRadius: 80, size: 36, speed: 0.6, iconType: "claude", phaseShift: (6 * Math.PI) / 5, glowColor: "blue", label: "Claude Code" },
  { id: "linkedin", orbitRadius: 80, size: 36, speed: 0.6, iconType: "linkedin", phaseShift: (8 * Math.PI) / 5, glowColor: "blue", label: "LinkedIn" },
  // Outer orbit — Domains (6 items, evenly spaced)
  { id: "sop", orbitRadius: 145, size: 40, speed: -0.4, iconType: "sop", phaseShift: 0, glowColor: "amber", label: "S&OP" },
  { id: "planning", orbitRadius: 145, size: 40, speed: -0.4, iconType: "planning", phaseShift: Math.PI / 3, glowColor: "amber", label: "Planning" },
  { id: "purchasing", orbitRadius: 145, size: 40, speed: -0.4, iconType: "purchasing", phaseShift: (2 * Math.PI) / 3, glowColor: "amber", label: "Purchasing" },
  { id: "inventory", orbitRadius: 145, size: 40, speed: -0.4, iconType: "inventory", phaseShift: Math.PI, glowColor: "amber", label: "Inventory" },
  { id: "leadership", orbitRadius: 145, size: 40, speed: -0.4, iconType: "leadership", phaseShift: (4 * Math.PI) / 3, glowColor: "amber", label: "Leadership" },
  { id: "people", orbitRadius: 145, size: 40, speed: -0.4, iconType: "people", phaseShift: (5 * Math.PI) / 3, glowColor: "amber", label: "People Management" },
];

// --- Orbit ring (pure CSS, no JS animation needed) ---
function GlowingOrbitPath({ radius, glowColor = "blue", animationDelay = 0 }: { radius: number; glowColor?: GlowColor; animationDelay?: number }) {
  const colors = glowColor === "blue"
    ? { primary: "rgba(6,133,142,0.3)", secondary: "rgba(6,133,142,0.12)", border: "rgba(6,133,142,0.2)" }
    : { primary: "rgba(245,158,11,0.25)", secondary: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.18)" };

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
    >
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: `radial-gradient(circle, transparent 40%, ${colors.secondary} 75%, ${colors.primary} 100%)`,
          boxShadow: `0 0 40px ${colors.primary}, inset 0 0 40px ${colors.secondary}`,
          animationDelay: `${animationDelay}s`,
          animationDuration: "4s",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid ${colors.border}`, boxShadow: `inset 0 0 15px ${colors.secondary}` }}
      />
    </div>
  );
}

// --- Main component using ref-based animation (no React re-renders per frame) ---
export default function OrbitingSkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  const pausedRef = useRef(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
    pausedRef.current = id !== null;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!pausedRef.current) {
        timeRef.current += deltaTime;
      }

      const nodes = container.querySelectorAll<HTMLElement>("[data-skill-id]");
      nodes.forEach((node) => {
        const idx = Number(node.dataset.skillIdx);
        const config = skillsConfig[idx];
        if (!config) return;

        const angle = timeRef.current * config.speed + config.phaseShift;
        const x = Math.cos(angle) * config.orbitRadius;
        const y = Math.sin(angle) * config.orbitRadius;
        node.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full flex items-center justify-center overflow-hidden py-4">
      <div
        ref={containerRef}
        className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] flex items-center justify-center"
      >
        {/* Central icon */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center z-10 relative shadow-2xl" style={{ background: "linear-gradient(135deg, #0a4a55, #06858e)" }}>
          <div className="absolute inset-0 rounded-full blur-xl animate-pulse" style={{ backgroundColor: "rgba(6,133,142,0.3)" }} />
          <div className="absolute inset-0 rounded-full blur-2xl animate-pulse" style={{ backgroundColor: "rgba(245,158,11,0.15)", animationDelay: "1s" }} />
          <div className="relative z-10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#orbitGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06858e" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Orbit paths */}
        <GlowingOrbitPath radius={80} glowColor="blue" animationDelay={0} />
        <GlowingOrbitPath radius={145} glowColor="amber" animationDelay={1.5} />

        {/* Skill nodes — positioned via ref-based animation, no React re-renders */}
        {skillsConfig.map((config, idx) => {
          const isHovered = hoveredId === config.id;
          const IconComponent = iconComponents[config.iconType]?.component;
          const color = iconComponents[config.iconType]?.color;

          return (
            <div
              key={config.id}
              data-skill-id={config.id}
              data-skill-idx={idx}
              className="absolute top-1/2 left-1/2"
              style={{
                width: `${config.size}px`,
                height: `${config.size}px`,
                willChange: "transform",
                zIndex: isHovered ? 20 : 10,
              }}
              onMouseEnter={() => handleHover(config.id)}
              onMouseLeave={() => handleHover(null)}
            >
              <div
                className="relative w-full h-full p-2 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  backgroundColor: "rgba(10, 74, 85, 0.9)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  transform: isHovered ? "scale(1.25)" : "scale(1)",
                  boxShadow: isHovered
                    ? `0 0 25px ${color}40, 0 0 50px ${color}20`
                    : "0 4px 6px rgba(0,0,0,0.3)",
                }}
              >
                {IconComponent && <IconComponent />}
                {isHovered && (
                  <div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs text-foreground whitespace-nowrap pointer-events-none"
                    style={{ backgroundColor: "rgba(10, 74, 85, 0.95)", color: "#ffffff" }}
                  >
                    {config.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
