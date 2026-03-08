export default function Footer() {
  const items = ["Made with curiosity", "Made with Claude Code", "And a lot of trial and error"];

  return (
    <footer className="border-t border-border bg-background py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="text-xs text-muted-foreground/50"
          >
            {items.map((item, j) => (
              <span key={j}>
                <span className="mx-6">{item}</span>
                <span className="mx-6">●</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </footer>
  );
}
