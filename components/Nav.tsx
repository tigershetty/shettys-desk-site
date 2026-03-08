"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

export default function Nav({
  primary,
  secondary,
  onNavigate,
}: {
  primary: NavItem[];
  secondary: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        {primary.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              pathname === item.href
                ? "bg-brand-accent/10 text-brand-accent font-medium"
                : "text-brand-muted hover:text-brand-white hover:bg-brand-card"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div>
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-brand-muted/60">
          Other
        </p>
        <div className="flex flex-col gap-1">
          {secondary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-brand-accent/10 text-brand-accent font-medium"
                  : "text-brand-muted hover:text-brand-white hover:bg-brand-card"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
