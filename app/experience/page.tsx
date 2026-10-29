import FlowingMenu from "@/components/FlowingMenu";
import DecryptedText from "@/components/DecryptedText";
import ScorExplorer from "@/components/scor/ScorExplorer";
import JourneyBoard from "@/components/JourneyBoard";
import experienceData from "@/data/experience.json";

export default function ExperiencePage() {
  const primary = experienceData.primary[0];

  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          <DecryptedText
            text="Where I've been and what it taught me"
            speed={30}
          />
        </h1>
        <a
          href={experienceData.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          View full profile on LinkedIn
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </section>

      <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">{experienceData.summary}</p>

      {/* The career as the SCOR model: islands joined by the red thread */}
      <section className="mb-14" aria-labelledby="scor-heading">
        <h2 id="scor-heading" className="mb-1 text-lg font-semibold text-foreground">
          My supply chain, process by process
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">Pick an island, or follow the red thread through the career in order.</p>
        <ScorExplorer />
      </section>

      {/* The same journey as a metro map */}
      <section className="mb-14">
        <JourneyBoard views={["metro"]} />
      </section>

      {/* Core competencies */}
      <section className="mb-12">
        <h2 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">
          Core competencies
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {experienceData.competencies.map((c) => (
            <div
              key={c.area}
              className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <p className="text-sm font-semibold text-foreground">{c.area}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {c.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Primary: Tetra Pak */}
      <section className="mb-12">
        <div className="mb-2 flex items-baseline gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            {primary.company}
          </h2>
          <span className="text-sm text-muted-foreground">
            {primary.totalYears}
          </span>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Hover or tap a role to see the detail.
        </p>
        <FlowingMenu items={primary.roles} />
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
