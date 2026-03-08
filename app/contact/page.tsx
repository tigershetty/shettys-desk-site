import ContactForm from "@/components/ContactForm";
import siteData from "@/data/site.json";

export default function ContactPage() {
  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-brand-white">
          Let&apos;s talk
        </h1>
      </section>

      {/* Badges */}
      <div className="mb-8 flex flex-wrap gap-3">
        <span className="rounded-full border border-brand-border bg-brand-card px-3 py-1 text-xs text-brand-muted">
          &lt;24h Response
        </span>
        <span className="rounded-full border border-brand-border bg-brand-card px-3 py-1 text-xs text-brand-muted">
          Open to Speaking
        </span>
        <span className="rounded-full border border-brand-border bg-brand-card px-3 py-1 text-xs text-brand-muted">
          Yes, Coffee Chats
        </span>
      </div>

      {/* Form */}
      <div className="mb-12 max-w-lg">
        <ContactForm />
      </div>

      {/* Direct contact */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-brand-white">
          Or reach out directly
        </h2>
        <div className="flex flex-col gap-3 text-sm">
          <a
            href={`mailto:${siteData.social.email}`}
            className="text-brand-accent hover:underline"
          >
            {siteData.social.email}
          </a>
          <a
            href={siteData.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-accent hover:underline"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
