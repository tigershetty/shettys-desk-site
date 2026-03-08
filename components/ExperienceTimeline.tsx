"use client";

import { AnimatedTimeline } from "./AnimatedTimeline";

interface Role {
  title: string;
  period: string;
  location: string;
  lesson: string;
}

export default function ExperienceTimeline({ roles }: { roles: Role[] }) {
  const data = roles.map((role) => ({
    title: role.period.split(" - ")[0].split(" ").slice(-1)[0],
    content: (
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="text-lg font-semibold text-foreground">{role.title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          {role.period} &middot; {role.location}
        </p>
        <p className="mt-3 text-sm text-primary/80 italic">{role.lesson}</p>
      </div>
    ),
  }));

  return <AnimatedTimeline data={data} />;
}
