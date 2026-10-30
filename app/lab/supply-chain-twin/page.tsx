import type { Metadata } from "next";
import Link from "next/link";

// Hidden until the Twin Lab ships. The simulation lives in components/command
// and in git history; restore the previous version of this page to bring it back.
export const metadata: Metadata = {
  title: "Supply Chain Twin Lab | Shetty's Desk",
  description: "A planned 3D supply chain game. Not available yet.",
  robots: { index: false, follow: false },
};

export default function SupplyChainTwinPage() {
  return (
    <article className="mx-auto w-full max-w-3xl">
      <p className="text-sm font-semibold text-primary">Lab · planned</p>
      <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground sm:text-3xl">Supply Chain Twin Lab</h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        A 3D supply chain game is planned for this page: run a network for one shift and watch the KPIs move. It isn&apos;t
        available yet, and there is nothing to play today.
      </p>
      <Link href="/shettys-desk#radar" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        See what&apos;s on the radar <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
