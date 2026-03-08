import siteData from "@/data/site.json";

export default function Footer() {
  const text = siteData.marquee;

  return (
    <footer className="border-t border-brand-border bg-brand-dark py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="mx-4 text-xs text-brand-muted/50"
          >
            {text}
          </span>
        ))}
      </div>
    </footer>
  );
}
