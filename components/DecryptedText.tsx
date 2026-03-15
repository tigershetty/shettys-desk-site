"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  characters?: string;
  className?: string;
  delay?: number;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export default function DecryptedText({
  text,
  speed = 40,
  characters = DEFAULT_CHARS,
  className = "",
  delay = 0,
}: DecryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(text);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    let revealIndex = 0;
    let scrambleInterval: ReturnType<typeof setInterval>;
    let revealInterval: ReturnType<typeof setInterval>;

    const startAnimation = () => {
      // Scramble all characters initially
      scrambleInterval = setInterval(() => {
        setDisplayed((prev) => {
          const chars = text.split("").map((char, i) => {
            if (i < revealIndex) return text[i];
            if (char === " ") return " ";
            return characters[Math.floor(Math.random() * characters.length)];
          });
          return chars.join("");
        });
      }, 50);

      // Reveal one character at a time
      revealInterval = setInterval(() => {
        revealIndex++;
        if (revealIndex >= text.length) {
          clearInterval(scrambleInterval);
          clearInterval(revealInterval);
          setDisplayed(text);
          setDone(true);
        }
      }, speed);
    };

    const delayTimeout = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(scrambleInterval);
      clearInterval(revealInterval);
    };
  }, [isInView, text, speed, characters, delay, prefersReducedMotion]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {done ? text : displayed}
    </span>
  );
}
