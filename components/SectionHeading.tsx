type SectionHeadingProps = {
  /** Small uppercase kicker above the title — the editorial "eyebrow". */
  eyebrow?: string;
  title: string;
  /** Optional lead paragraph under the title. */
  description?: string;
  /** Override the heading level for semantics (defaults to h2). */
  as?: "h2" | "h3";
  className?: string;
};

/**
 * Editorial section header: a small primary-tinted eyebrow, a confident
 * tracking-tight title, and an optional lead. One consistent rhythm across the
 * site so sections read as composed rather than ad-hoc.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {eyebrow && (
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </p>
      )}
      <Heading className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">
        {title}
      </Heading>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
