import type { Metadata } from "next";
import CommandApp from "@/components/command/CommandApp";

export const metadata: Metadata = {
  title: "Supply Chain Command | Shetty's Desk",
  description:
    "A playable 3D supply chain game: run five European sites for one shift. Dock trucks, keep forklifts charged, accept or rush customer orders, and handle incidents while stock, bays and on-time delivery update live.",
};

export default function SupplyChainCommandPage() {
  return (
    <article className="mx-auto w-full max-w-[1600px]">
      <header className="flex flex-col gap-1 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Lab · playable</p>
          <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">Supply Chain Command</h1>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Industrial software that plays like a strategy game. Five sites, one shift, live trucks, forklifts and orders. Click
          anything to inspect it.
        </p>
      </header>

      <CommandApp />

      <section className="mt-10 grid gap-6 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground md:grid-cols-3" aria-labelledby="how-heading">
        <div>
          <h2 id="how-heading" className="font-semibold text-foreground">The network</h2>
          <p className="mt-2">
            A Lund plant feeds DCs in Hamburg and Milan. Rotterdam is the cold-chain port for the Asia sea lane, and Gdańsk
            cross-docks for the Baltic. Each site has its own bays, forklift fleet, chargers and stock. Every figure is
            synthetic.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-foreground">How it is built</h2>
          <p className="mt-2">
            A typed world model and a seeded simulation run in a Zustand store that ticks ten times a second. The React Three
            Fiber scene only reads from that store, and so does the interface around it, so the 3D layer stays display-only and
            the rules are unit-tested on their own. The canvas renders on the client; this text renders on the server.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Limits</h2>
          <p className="mt-2">
            It is a game, not a planning tool. Travel and handling times are compressed so that an eight-hour shift fits into
            about eight minutes, and there is one pallet type per SKU. Credit for the format goes to Dilum Sanjaya&apos;s
            WareTrack demo.
          </p>
        </div>
      </section>
    </article>
  );
}
