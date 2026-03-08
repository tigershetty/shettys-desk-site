"use client";

import { useState } from "react";

const topics = [
  "Suggest a topic for Shetty's Desk",
  "Invite me to speak",
  "Work with me",
  "Just say hello",
];

export default function ContactForm() {
  const [topic, setTopic] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, email, message }),
      });

      if (res.ok) {
        setStatus("success");
        setTopic("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
        <p className="text-lg font-medium text-green-400">Message sent.</p>
        <p className="mt-1 text-sm text-brand-muted">
          I&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-brand-accent hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="topic" className="mb-1 block text-sm text-brand-muted">
          Topic
        </label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-sm text-brand-white focus:border-brand-accent focus:outline-none"
        >
          <option value="">Select a topic</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-brand-muted">
          Your email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted/50 focus:border-brand-accent focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm text-brand-muted"
        >
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="What's on your mind?"
          className="w-full rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-muted/50 focus:border-brand-accent focus:outline-none resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-brand-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent/80 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
