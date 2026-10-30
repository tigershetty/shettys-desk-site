"use client";

import GlassFolder, { type FolderFile } from "@/components/ui/glass-folder-cards";
import experience from "@/data/experience";
import { yearsAtTetraPak } from "@/data/profile";
import { passes } from "@/data/passes";
import { brandArt } from "@/lib/brand-art";

// A row of glass folders on the desk: open one and its files fan out, each
// one a link into the site.

type Props = { articles: { slug: string; title: string; date: string }[] };

const month = (d: string) => {
  const t = Date.parse(d);
  return Number.isFinite(t) ? new Date(t).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "";
};

export default function DeskFolders({ articles }: Props) {
  const articleFiles: FolderFile[] = articles.slice(0, 4).map((a) => ({ name: a.title, meta: month(a.date), href: `/articles/${a.slug}` }));
  const roles = experience.primary[0].roles;
  const roleFiles: FolderFile[] = [...roles].reverse().map((r) => ({
    name: r.title.split(",")[0].split(" / ")[0],
    meta: r.period.replace(" - ", "–"),
    href: "/experience",
  }));
  const aboutFiles: FolderFile[] = [
    { name: "Personal note", meta: "Bangalore → Malmö", href: "/about" },
    { name: "The journey so far", meta: `${passes.length} boarding passes`, href: "/about#journey-heading" },
    { name: "Where I've travelled", meta: "globe", href: "/about#travel-heading", art: brandArt.teal },
    { name: "On rotation", meta: "music & books", href: "/about", art: brandArt.amber },
  ];

  const folders = [
    { label: "Articles", files: articleFiles, art: brandArt.indigo, seed: 3, meta: `${articles.length} published` },
    { label: "Experience", files: roleFiles, art: brandArt.ink, seed: 11, meta: `${yearsAtTetraPak()}+ years · Tetra Pak`, tone: "dark" as const },
    { label: "About me", files: aboutFiles, art: brandArt.amber, seed: 7, meta: "the person behind it" },
  ];

  return (
    <section aria-label="Open a folder" className="relative">
      <div className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 pt-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:justify-items-center lg:overflow-visible lg:px-0">
        {folders.map((f, i) => (
          <div key={f.label} className="shrink-0 snap-center">
            <GlassFolder
              label={f.label}
              meta={f.meta}
              art={f.art}
              seed={f.seed}
              tone={f.tone ?? "light"}
              files={f.files}
              action="none"
              width={290}
              appearDelay={i * 140}
            />
          </div>
        ))}
      </div>
      <p className="mt-1 text-center text-xs text-muted-foreground">Open a folder to see what’s inside.</p>
    </section>
  );
}
