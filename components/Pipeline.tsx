"use client";

import { motion } from "framer-motion";

const steps = [
  "Curiosity",
  "Research",
  "Synthesize",
  "Visualize",
  "Publish",
  "Reflect",
];

export default function Pipeline() {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center sm:flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.35,
              delay: i * 0.08,
              ease: [0.25, 0.4, 0, 1],
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.15 },
            }}
            className="flex h-12 w-full cursor-default items-center justify-center rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
          >
            {step}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 + 0.15 }}
              className="hidden px-2 text-primary sm:block"
            >
              &rarr;
            </motion.span>
          )}
        </div>
      ))}
    </div>
  );
}
