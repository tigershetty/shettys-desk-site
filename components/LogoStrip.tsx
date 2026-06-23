const items = [
  "Tetra Pak",
  "Lund University",
  "DE&I Europe Panelist",
  "S&OP",
  "Replenishment",
  "Operational Purchasing",
  "Culture Champion",
  "Logistics & Supply Chain",
];

export default function LogoStrip() {
  return (
    <section className="rounded-2xl border border-border bg-card py-6 shadow-sm">
      <p className="mb-5 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/60">
        Built over 7+ years in the field
      </p>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {items.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center">
                  <span className="whitespace-nowrap px-6 text-sm font-medium text-muted-foreground/80">
                    {item}
                  </span>
                  <span className="text-primary/30">&bull;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
