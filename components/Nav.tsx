"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Compass,
  User,
  Briefcase,
  Wrench,
  BookOpen,
  Mail,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  "/": Home,
  "/articles": FileText,
  "/approach": Compass,
  "/about": User,
  "/experience": Briefcase,
  "/workshop": Wrench,
  "/shettys-desk": BookOpen,
  "/contact": Mail,
};

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        {primary.map((item) => {
          const Icon = iconMap[item.href];
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
                active
                  ? "bg-white/25 text-primary font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/20"
              }`}
            >
              {Icon && <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />}
              {item.label}
            </Link>
          );
        })}
      </div>
      <div>
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
          Other
        </p>
        <div className="flex flex-col gap-1">
          {secondary.map((item) => {
            const Icon = iconMap[item.href];
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
                  active
                    ? "bg-white/25 text-primary font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/20"
                }`}
              >
                {Icon && <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
