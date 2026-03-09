"use client";

import { motion } from "framer-motion";

const readers = [
  { label: "Supply chain professionals", icon: "📦", color: "border-blue-500/20 bg-blue-500/10" },
  { label: "Operations managers", icon: "⚙️", color: "border-emerald-500/20 bg-emerald-500/10" },
  { label: "Students & early-career folks", icon: "🎓", color: "border-amber-500/20 bg-amber-500/10" },
  { label: "Anyone curious about how things move", icon: "🌍", color: "border-rose-500/20 bg-rose-500/10" },
];

export default function ShettysAnimation() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {readers.map((reader, i) => (
        <motion.div
          key={reader.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{
            duration: 0.4,
            delay: i * 0.1,
            ease: [0.25, 0.4, 0, 1],
          }}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          className={`flex items-center gap-3 rounded-xl border ${reader.color} p-4 transition-shadow hover:shadow-sm`}
        >
          <span className="text-xl">{reader.icon}</span>
          <span className="text-sm font-medium text-foreground">
            {reader.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
