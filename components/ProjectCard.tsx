"use client";

import { motion } from "framer-motion";

interface Project {
  name: string;
  description: string;
  status: string;
  tag: string;
}

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0, 1],
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-xl border border-border bg-card p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {project.tag}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            project.status === "Finished"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-amber-500/10 text-amber-600"
          }`}
        >
          {project.status}
        </span>
      </div>
      <h3 className="font-semibold text-foreground">{project.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {project.description}
      </p>
    </motion.div>
  );
}
