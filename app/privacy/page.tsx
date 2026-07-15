import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy | Shetty's Desk",
  description: "How Shetty's Desk handles contact and resource-signup information.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl pb-10">
      <p className="text-sm font-semibold text-primary">Last updated July 14, 2026</p>
      <h1 className="mt-3 text-4xl font-bold text-foreground">Privacy note</h1>
      <div className="mt-7 space-y-7 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">What is collected</h2>
          <p className="mt-2">When you request a workflow pack, Shetty&apos;s Desk collects the email address you submit. Standard hosting and email services may also process basic technical data needed to deliver the page and protect the form.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">How it is used</h2>
          <p className="mt-2">The information is used to provide the requested resource and send occasional Shetty&apos;s Desk field notes about supply-chain tools and operating ideas. It is not sold. Every marketing email will include an unsubscribe option.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Service providers</h2>
          <p className="mt-2">The website is hosted by Vercel. Newsletter subscriptions are managed through beehiiv when the resource signup is enabled. Those services process information according to their own privacy terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Your choices</h2>
          <p className="mt-2">You can unsubscribe using the link in any email or request access, correction, or deletion by contacting poornajithshetty@gmail.com.</p>
        </section>
      </div>
    </article>
  );
}
