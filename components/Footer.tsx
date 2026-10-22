// One quiet row, the same height as the old marquee. What the site is made
// of sits on a hairline route; a single indigo dot travels it and each stop
// warms as the dot passes. Pure CSS, still for reduced motion.

const stops = ["Curiosity", "Claude Code", "Next.js", "Tailwind", "Vercel", "Coffee", "Trial & error"];
const LOOP = 14; // seconds for one run of the route

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="flex flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:gap-8 lg:pl-[calc(16rem+2rem)] lg:pr-12">
        <p className="shrink-0">© {new Date().getFullYear()} Shetty&apos;s Desk · Lund, Sweden</p>

        <div className="relative min-w-0 flex-1" aria-label={`Made with ${stops.join(", ")}`}>
          <ol className="flex flex-wrap gap-x-4 gap-y-1 lg:flex-nowrap lg:justify-between lg:gap-0">
            {stops.map((s, i) => (
              <li
                key={s}
                className="footer-stop whitespace-nowrap"
                style={{ animationDelay: `${(i / stops.length) * LOOP + LOOP / stops.length / 2}s`, animationDuration: `${LOOP}s` }}
              >
                {s}
              </li>
            ))}
          </ol>
          <div aria-hidden className="relative mt-2 hidden h-px bg-foreground/15 lg:block">
            <span className="footer-dot absolute -top-[2.5px] left-0 h-1.5 w-1.5 rounded-full bg-primary" style={{ animationDuration: `${LOOP}s` }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
