import type { Metadata } from "next";
import QuarterGame from "@/components/quarter/QuarterGame";

export const metadata: Metadata = {
  title: "One Quarter: a supply chain game | Shetty's Desk",
  description:
    "Run a supply chain for 13 weeks in about three minutes. Four crises (an 85% network, a demand spike, a supplier outage and a shortage), one decision each, graded on service, profit, cash and resilience, with a what-if replay of every branch.",
};

export default function OneQuarterPage() {
  return (
    <article className="mx-auto w-full max-w-[1600px]">
      <header className="flex flex-col gap-1 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Lab · playable</p>
          <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">One Quarter</h1>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Thirteen weeks, four crises, one decision each. There is no right answer, only trade-offs between service, profit,
          cash and resilience.
        </p>
      </header>

      <QuarterGame />

      <section className="mt-10 grid gap-6 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground md:grid-cols-3" aria-labelledby="how-heading">
        <div>
          <h2 id="how-heading" className="font-semibold text-foreground">What you are playing</h2>
          <p className="mt-2">
            You inherit a network running at about 85% availability. Over one quarter you face a demand spike, a supplier
            outage and an industry-wide shortage. Each act offers three moves; each move changes the policy or the network,
            and every choice carries into the next act.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-foreground">How it is scored</h2>
          <p className="mt-2">
            A weekly order-up-to model with lead time, forecast bias, supplier reliability, holding cost and spoilage turns your
            choices into fill rate, profit, cash and customer trust. You are graded against all 81 possible quarters, so an A
            means you beat at least 85% of them on that measure.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Limits</h2>
          <p className="mt-2">
            One product, one aggregated network and synthetic numbers. It teaches the shape of the trade-offs, not the exact
            size. Food, electronics and pharma change prices, shelf life, freight premiums and how much customers forgive.
          </p>
        </div>
      </section>
    </article>
  );
}
