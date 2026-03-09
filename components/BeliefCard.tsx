"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BeliefCard({
  title,
  body,
  index = 0,
}: {
  title: string;
  body: string;
  index?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={() => setOpen(!open)}
      className={`w-full rounded-xl border bg-card p-5 text-left transition-all duration-300 ${
        open
          ? "border-primary/40 shadow-md shadow-primary/5"
          : "border-border hover:border-primary/30 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">
          &ldquo;{title}&rdquo;
        </h3>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm text-primary"
        >
          +
        </motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
            className="overflow-hidden text-sm text-muted-foreground leading-relaxed"
          >
            <span className="block pt-3">{body}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
