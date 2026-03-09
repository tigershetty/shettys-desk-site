"use client";

import { motion } from "framer-motion";

interface Role {
  title: string;
  period: string;
  location: string;
  lesson: string;
}

export default function RoleTimeline({ roles }: { roles: Role[] }) {
  return (
    <div className="relative space-y-6 pl-6 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
      {roles.map((role, i) => (
        <motion.div
          key={role.title}
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{
            duration: 0.4,
            delay: i * 0.1,
            ease: [0.25, 0.4, 0, 1],
          }}
          className="relative"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: i * 0.1,
            }}
            className="absolute -left-6 top-2 h-3 w-3 rounded-full border-2 border-primary bg-background"
          />
          <h3 className="font-medium text-foreground">{role.title}</h3>
          <p className="text-sm text-muted-foreground">
            {role.period} &middot; {role.location}
          </p>
          <p className="mt-1 text-sm text-primary/80 italic">
            {role.lesson}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
