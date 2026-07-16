import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy | Shetty's Desk",
  description: "How Shetty's Desk handles contact and website information.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl pb-10">
      <p className="text-sm font-semibold text-primary">Last updated July 15, 2026</p>
      <h1 className="mt-3 text-4xl font-bold text-foreground">Privacy note</h1>
      <div className="mt-7 space-y-7 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">What is collected</h2>
          <p className="mt-2">Workflow-pack downloads do not ask for an email address or newsletter signup. The website host may process basic technical data needed to deliver pages, downloads, and security controls. Information sent through the contact form is provided voluntarily.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">How it is used</h2>
          <p className="mt-2">Technical information is used to operate and protect the website. Contact-form information is used only to respond to the request. Shetty&apos;s Desk does not sell personal information.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Service providers</h2>
          <p className="mt-2">The website and resource downloads are hosted by Vercel, which processes technical information according to its own privacy terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground">Your choices</h2>
          <p className="mt-2">You can request access, correction, or deletion of information submitted through the contact form by contacting poornajithshetty@gmail.com.</p>
        </section>
      </div>
    </article>
  );
}
