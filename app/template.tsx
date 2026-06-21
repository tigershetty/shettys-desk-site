"use client";

import { motion } from "framer-motion";

/**
 * Per-route enter animation. A Next `template.tsx` remounts on navigation, so
 * each page fades/rises in for a smooth page-to-page transition.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
