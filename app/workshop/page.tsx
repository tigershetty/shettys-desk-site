import ProjectCard from "@/components/ProjectCard";
import projects from "@/data/projects.json";

export default function WorkshopPage() {
  const finished = projects.filter((p) => p.status === "Finished").length;
  const inProgress = projects.filter((p) => p.status === "In Progress").length;

  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          Things I&apos;m building on the side
        </h1>
      </section>

      {/* Stats bar */}
      <div className="mb-8 flex gap-6 text-sm">
        <div className="rounded-lg border border-border bg-card px-4 py-2">
          <span className="font-semibold text-foreground">{finished}</span>{" "}
          <span className="text-muted-foreground">Finished</span>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2">
          <span className="font-semibold text-amber-600">{inProgress}</span>{" "}
          <span className="text-muted-foreground">In Progress</span>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-2">
          <span className="font-semibold text-foreground">
            {projects.length}
          </span>{" "}
          <span className="text-muted-foreground">Total</span>
        </div>
      </div>

      {/* Project grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </>
  );
}
