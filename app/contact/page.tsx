"use client";

import ContactForm from "@/components/ContactForm";
import DecryptedText from "@/components/DecryptedText";
import ProfileCard from "@/components/ProfileCard";
import siteData from "@/data/site.json";
import { useCallback, useRef } from "react";

export default function ContactPage() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      {/* Profile Card */}
      <section className="mb-12 flex justify-center">
        <ProfileCard
          avatarUrl="/images/profile.png"
          name="Poornajith Shetty"
          title="Supply Chain Leader"
          handle="Shetty's Desk"
          status="Open to collaborations"
          contactText="Contact"
          onContactClick={scrollToForm}
        />
      </section>

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
      <div ref={formRef} className="mb-12 max-w-lg">
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
