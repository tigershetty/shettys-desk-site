import ExperienceTimeline from "@/components/ExperienceTimeline";
import experienceData from "@/data/experience.json";

export default function ExperiencePage() {
  const primary = experienceData.primary[0];

  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          Where I&apos;ve been and what it taught me
        </h1>
        <a
          href="#"
          className="mt-3 inline-block text-sm text-primary hover:underline"
        >
          Download resume (PDF)
        </a>
      </section>

      {/* Summary */}
      <p className="mb-10 max-w-2xl text-muted-foreground leading-relaxed">
        {experienceData.summary}
      </p>

      {/* Primary: Tetra Pak */}
      <section className="mb-12">
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            {primary.company}
          </h2>
          <span className="text-sm text-muted-foreground">
            {primary.totalYears}
          </span>
        </div>
        <ExperienceTimeline roles={primary.roles} />
      </section>

      {/* Earlier roles */}
      <section className="mb-12">
        <details className="group">
          <summary className="mb-4 cursor-pointer text-lg font-semibold text-foreground list-none">
            <span className="group-open:hidden">+ Earlier roles</span>
            <span className="hidden group-open:inline">- Earlier roles</span>
          </summary>
          <div className="space-y-4 pl-1">
            {experienceData.earlier.map((role) => (
              <div key={`${role.company}-${role.title}`}>
                <p className="font-medium text-foreground">{role.title}</p>
                <p className="text-sm text-muted-foreground">
                  {role.company} &middot; {role.period} &middot; {role.location}
                </p>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* Education */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Education
        </h2>
        <div className="space-y-4">
          {experienceData.education.map((edu) => (
            <div key={edu.institution}>
              <p className="font-medium text-foreground">{edu.degree}</p>
              <p className="text-sm text-muted-foreground">
                {edu.institution} &middot; {edu.period}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Languages
        </h2>
        <div className="flex flex-wrap gap-2">
          {experienceData.languages.map((lang) => (
            <span
              key={lang}
              className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground hover:shadow-sm"
            >
              {lang}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
