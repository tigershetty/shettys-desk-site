"use client";

import ContactForm from "@/components/ContactForm";
import DecryptedText from "@/components/DecryptedText";
import ProfileCard from "@/components/ProfileCard";
import { identity } from "@/data/profile";

export default function ContactPage() {
  return (
    <>
      {/* Two-column layout: form left, card right */}
      <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:gap-12">
        {/* Left column: heading, badges, form, direct contact */}
        <div className="flex-1 min-w-0">
          <section className="mb-10">
            <h1 className="text-3xl font-bold text-foreground">
              <DecryptedText text="Let's talk" speed={50} />
            </h1>
          </section>

          {/* Badges */}
          <div className="mb-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
              &lt;24h Response
            </span>
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600">
              Open to Speaking
            </span>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600">
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
                href={`mailto:${identity.email}`}
                className="text-primary hover:underline"
              >
                {identity.email}
              </a>
              <a
                href={identity.linkedin}
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
            name={identity.name}
            title={identity.headline}
            handle="Shetty's Desk"
            status={identity.availability[1]}
            contactText="Contact"
            showUserInfo={false}
          />
        </div>
      </div>
    </>
  );
}
