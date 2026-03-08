import ContactForm from "@/components/ContactForm";
import siteData from "@/data/site.json";

export default function ContactPage() {
  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">
          Let&apos;s talk
        </h1>
      </section>

      {/* Badges */}
      <div className="mb-8 flex flex-wrap gap-3">
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          &lt;24h Response
        </span>
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          Open to Speaking
        </span>
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          Yes, Coffee Chats
        </span>
      </div>

      {/* Form */}
      <div className="mb-12 max-w-lg">
        <ContactForm />
      </div>

      {/* Direct contact */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Or reach out directly
        </h2>
        <div className="flex flex-col gap-3 text-sm">
          <a
            href={`mailto:${siteData.social.email}`}
            className="text-primary hover:underline"
          >
            {siteData.social.email}
          </a>
          <a
            href={siteData.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
