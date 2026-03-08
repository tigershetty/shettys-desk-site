interface Project {
  name: string;
  description: string;
  status: string;
  tag: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
          {project.tag}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs ${
            project.status === "Finished"
              ? "bg-green-500/10 text-green-400"
              : "bg-yellow-500/10 text-yellow-400"
          }`}
        >
          {project.status}
        </span>
      </div>
      <h3 className="font-semibold text-foreground">{project.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {project.description}
      </p>
    </div>
  );
}
