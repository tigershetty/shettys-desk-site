"use client";
import React, { useState, useEffect, useRef } from "react";

const SpotlightBackground = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const moveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      if (moveTimeout.current) clearTimeout(moveTimeout.current);
      moveTimeout.current = setTimeout(() => {
        setIsMoving(false);
      }, 150);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[1]">
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mouse.x,
          top: mouse.y,
          width: isMoving ? "55px" : "70px",
          height: isMoving ? "55px" : "70px",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(56,189,248,0.7) 0%, transparent 70%)",
        }}
      />
    </div>
  );
};

export default SpotlightBackground;
