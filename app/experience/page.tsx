import FlowingMenu from "@/components/FlowingMenu";
import DecryptedText from "@/components/DecryptedText";
import { InteractiveRobotSpline } from "@/components/InteractiveRobotSpline";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";
import experienceData from "@/data/experience.json";

// Public Spline "interactive robot" scene (follows the cursor). Swap this for a
// custom scene URL any time; single source of truth.
const ROBOT_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function ExperiencePage() {
  const primary = experienceData.primary[0];

  return (
    <>
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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

      {/* Summary + interactive robot (free-standing, no card chrome) */}
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          {experienceData.summary}
        </p>
        <div className="relative h-72 w-full shrink-0 sm:h-80 lg:h-96 lg:w-96">
          <InteractiveRobotSpline scene={ROBOT_SCENE} className="h-full w-full" />
        </div>
      </div>

      {/* Core competencies */}
      <section className="mb-12">
        <SectionHeading eyebrow="What I'm good at" title="Core competencies" />
        <Reveal stagger={0.08} className="grid gap-3 sm:grid-cols-2">
          {experienceData.competencies.map((c) => (
            <SpotlightCard
              key={c.area}
              className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <p className="text-sm font-semibold text-foreground">{c.area}</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {c.detail}
              </p>
            </SpotlightCard>
          ))}
        </Reveal>
      </section>

      {/* Primary: Tetra Pak */}
      <section className="mb-12">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Where I am now
        </p>
        <div className="mb-2 flex items-baseline gap-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">
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
        <SectionHeading eyebrow="Background" title="Education" />
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
        <SectionHeading eyebrow="Also" title="Languages" />
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
