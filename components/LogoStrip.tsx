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
    <section className="border-y border-border py-8">
      <p className="mb-5 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
        Built over 7+ years in the field
      </p>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {items.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center">
                  <span className="px-6 text-sm font-medium text-muted-foreground/70 whitespace-nowrap">
                    {item}
                  </span>
                  <span className="text-muted-foreground/25">&bull;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
