import Link from "next/link";
import siteData from "@/data/site.json";

const nav = [
  { label: "Articles", href: "/articles" },
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "The Workshop", href: "/workshop" },
  { label: "Shetty's Desk", href: "/shettys-desk" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <p className="text-lg font-semibold tracking-tight text-foreground">
              Shetty&apos;s Desk
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Breaking down how supply chains actually work — one real topic at a
              time.
            </p>
          </div>

          {/* Nav */}
          <nav className="grid grid-cols-2 gap-x-12 gap-y-2.5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Connect */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              Connect
            </p>
            <a
              href={siteData.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${siteData.social.email}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Email
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {year} Poornajith Shetty
          </p>
          <p className="text-xs text-muted-foreground/60">
            Made with curiosity, Claude Code, Next.js &amp; a lot of trial and
            error.
          </p>
        </div>
      </div>
    </footer>
  );
}
