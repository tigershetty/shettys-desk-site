"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BlurFadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  blur?: string;
  yOffset?: number;
  className?: string;
}

export default function BlurFade({
  children,
  delay = 0,
  duration = 0.4,
  blur = "6px",
  yOffset = 6,
  className,
}: BlurFadeProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: `blur(${blur})`, y: yOffset }}
      animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
