import RoleTimeline from "@/components/RoleTimeline";
import experienceData from "@/data/experience.json";

export default function ExperiencePage() {
  const primary = experienceData.primary[0];

  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-brand-white">
          Where I&apos;ve been and what it taught me
        </h1>
        <a
          href="#"
          className="mt-3 inline-block text-sm text-brand-accent hover:underline"
        >
          Download resume (PDF)
        </a>
      </section>

      {/* Summary */}
      <p className="mb-10 max-w-2xl text-brand-muted leading-relaxed">
        {experienceData.summary}
      </p>

      {/* Primary: Tetra Pak */}
      <section className="mb-12">
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="text-xl font-semibold text-brand-white">
            {primary.company}
          </h2>
          <span className="text-sm text-brand-muted">
            {primary.totalYears}
          </span>
        </div>
        <RoleTimeline roles={primary.roles} />
      </section>

      {/* Earlier roles */}
      <section className="mb-12">
        <details className="group">
          <summary className="mb-4 cursor-pointer text-lg font-semibold text-brand-white list-none">
            <span className="group-open:hidden">+ Earlier roles</span>
            <span className="hidden group-open:inline">- Earlier roles</span>
          </summary>
          <div className="space-y-4 pl-1">
            {experienceData.earlier.map((role) => (
              <div key={`${role.company}-${role.title}`}>
                <p className="font-medium text-brand-white">{role.title}</p>
                <p className="text-sm text-brand-muted">
                  {role.company} &middot; {role.period} &middot; {role.location}
                </p>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* Education */}
      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-brand-white">
          Education
        </h2>
        <div className="space-y-4">
          {experienceData.education.map((edu) => (
            <div key={edu.institution}>
              <p className="font-medium text-brand-white">{edu.degree}</p>
              <p className="text-sm text-brand-muted">
                {edu.institution} &middot; {edu.period}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-brand-white">
          Languages
        </h2>
        <div className="flex flex-wrap gap-2">
          {experienceData.languages.map((lang) => (
            <span
              key={lang}
              className="rounded-full border border-brand-border bg-brand-card px-3 py-1 text-sm text-brand-muted"
            >
              {lang}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
