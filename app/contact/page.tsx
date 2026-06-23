"use client";

import ContactForm from "@/components/ContactForm";
import ProfileCard from "@/components/ProfileCard";
import siteData from "@/data/site.json";

export default function ContactPage() {
  return (
    <>
      {/* Two-column layout: form left, card right */}
      <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:gap-12">
        {/* Left column: heading, badges, form, direct contact */}
        <div className="flex-1 min-w-0">
          <section className="mb-8 py-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Contact
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Let&apos;s talk.
            </h1>
          </section>

          {/* Badges */}
          <div className="mb-8 flex flex-wrap gap-2.5">
            {["< 24h response", "Open to speaking", "Yes, coffee chats"].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {badge}
                </span>
              ),
            )}
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
        </div>

        {/* Right column: Profile Card (no avatar image) */}
        <div className="mb-8 lg:mb-0 lg:sticky lg:top-10 shrink-0">
          <ProfileCard
            avatarUrl="/images/profile.png"
            name="Poornajith Shetty"
            title="Supply Chain Leader"
            handle="Shetty's Desk"
            status="Open to collaborations"
            contactText="Contact"
            showUserInfo={false}
          />
        </div>
      </div>
    </>
  );
}
