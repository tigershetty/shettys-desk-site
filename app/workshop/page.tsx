import ProjectCard from "@/components/ProjectCard";
import projects from "@/data/projects.json";

export default function WorkshopPage() {
  const finished = projects.filter((p) => p.status === "Finished").length;
  const inProgress = projects.filter((p) => p.status === "In Progress").length;

  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-brand-white">
          Things I&apos;m building on the side
        </h1>
      </section>

      {/* Stats bar */}
      <div className="mb-8 flex gap-6 text-sm">
        <div>
          <span className="font-semibold text-brand-white">{finished}</span>{" "}
          <span className="text-brand-muted">Finished</span>
        </div>
        <div>
          <span className="font-semibold text-brand-white">{inProgress}</span>{" "}
          <span className="text-brand-muted">In Progress</span>
        </div>
        <div>
          <span className="font-semibold text-brand-white">
            {projects.length}
          </span>{" "}
          <span className="text-brand-muted">Total</span>
        </div>
      </div>

      {/* Project grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </>
  );
}
