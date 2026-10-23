"use client";

import { ArtCanvas } from "@/components/ui/glass-folder-cards";
import { brandArt } from "@/lib/brand-art";
import { cn } from "@/lib/utils";

type FolderColor = "indigo" | "amber" | "teal" | "dark";

type FolderCardProps = {
  label: string;
  color?: FolderColor;
  children: React.ReactNode;
  className?: string;
};

const art: Record<FolderColor, keyof typeof brandArt> = { indigo: "indigo", amber: "amber", teal: "teal", dark: "ink" };
const seeds: Record<FolderColor, number> = { indigo: 3, amber: 7, teal: 5, dark: 11 };

/**
 * Bento panel in the glass-folder style: a back panel holding generated
 * artwork in the brand palette shows above the content as the tab strip, and
 * a frosted-glass front panel holds the content. On hover the glass leans
 * toward you on its bottom hinge and the art drifts a little.
 */
export default function FolderCard({ label, color = "indigo", children, className }: FolderCardProps) {
  return (
    <div className={cn("group relative flex flex-col [perspective:1400px]", className)}>
      {/* back panel and its artwork */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] bg-neutral-100">
        <div className="absolute -inset-4 transition-transform duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-1 group-hover:scale-[1.03] motion-reduce:transition-none">
          <ArtCanvas
            art={brandArt[art[color]]}
            seed={seeds[color]}
            w={720}
            h={560}
            density={0.6}
            priority={0}
            className="!h-full !w-full object-cover opacity-0 transition-opacity duration-1000 data-[ready]:opacity-100"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.22)_0%,rgba(255,255,255,0)_30%)]" />
      </div>

      {/* tab, sitting on the artwork */}
      <div className="relative z-10 px-5 pb-2.5 pt-3">
        <span className={cn("inline-flex items-center gap-2 text-sm font-medium", color === "dark" ? "text-white" : "text-foreground/80")}>
          <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
          {label}
        </span>
      </div>

      {/* frosted front panel, hinged on its bottom edge */}
      <div
        className={cn(
          "relative z-10 mx-1.5 mb-1.5 flex-1 origin-bottom rounded-[24px] border border-white/70 bg-white/[0.9] p-5 backdrop-blur-xl backdrop-saturate-150",
          "shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_12px_32px_-20px_rgba(30,27,75,.35)]",
          "transition-transform duration-700 ease-[cubic-bezier(.34,1.36,.5,1)] group-hover:[transform:rotateX(3deg)_translateY(-2px)] motion-reduce:transition-none"
        )}
      >
        {children}
      </div>
    </div>
  );
}
