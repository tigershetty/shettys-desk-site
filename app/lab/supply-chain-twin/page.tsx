import type { Metadata } from "next";
import TwinLab from "@/components/twin/TwinLab";

export const metadata: Metadata = {
  title: "Supply Chain Twin Lab | Shetty's Desk",
  description:
    "A playable supply chain digital twin: simulate supplier outages, demand spikes and port closures, compare replenishment policies with Monte Carlo, and watch fill rate, cost and CO2 react in real time.",
};

export default function SupplyChainTwinPage() {
  return (
    <article className="mx-auto w-full max-w-6xl">
      <header className="max-w-3xl pb-6">
        <p className="text-sm font-semibold text-primary">Lab · V1</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-5xl">Supply Chain Twin</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          A live digital twin of a two-echelon network: suppliers, plants, distribution centres and markets. Break it with a
          disruption, change the policy or the parameters while it runs, and see what it does to service, cost and carbon.
        </p>
      </header>

      <TwinLab />

      <section className="mt-10 grid gap-6 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground md:grid-cols-3" aria-labelledby="method-heading">
        <div>
          <h2 id="method-heading" className="font-semibold text-foreground">How it works</h2>
          <p className="mt-2">
            A discrete-event simulation with a daily clock. Shipments are scheduled events; markets draw demand from a normal
            distribution; plants are capacity- and component-constrained; every run is seeded and reproducible.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Policies</h2>
          <p className="mt-2">
            (s, Q) reorders a batch at a reorder point, (R, S) reviews weekly and orders up to a target, and expedite adds air
            spot-buys when component cover is about to run out. Monte Carlo compares them on identical seeds.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Limits</h2>
          <p className="mt-2">
            Synthetic, illustrative network with one product and a 1:1 bill of materials. It teaches the dynamics of buffers,
            lead time and recovery; it is not a planning tool. Optimisation and multi-SKU come in later versions.
          </p>
        </div>
      </section>
    </article>
  );
}
