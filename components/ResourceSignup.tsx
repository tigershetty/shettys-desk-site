"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Download, LoaderCircle, Mail } from "lucide-react";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "success"; downloadUrl: string };

export default function ResourceSignup() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch(
        "/api/resources/demand-sensing-router/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const result = (await response.json()) as {
        error?: string;
        downloadUrl?: string;
      };

      if (!response.ok || !result.downloadUrl) {
        throw new Error(result.error || "The signup could not be completed.");
      }

      setState({ status: "success", downloadUrl: result.downloadUrl });
      form.reset();
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "The signup could not be completed.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div
        className="border-l-4 border-secondary bg-white p-5"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
          <div>
            <h3 className="font-semibold text-foreground">Your pack is ready.</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              You&apos;re on the Shetty&apos;s Desk field-notes list. The download link expires in 15 minutes.
            </p>
            <a
              href={state.downloadUrl}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto sm:text-sm"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download the complete pack
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="grid gap-1.5 text-sm font-medium text-foreground">
        Work email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className="h-11 rounded-lg border border-border bg-white px-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/30"
          placeholder="you@company.com"
        />
      </label>

      <div className="hidden" aria-hidden>
        <label>
          Company website
          <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
        <input
          name="consent"
          type="checkbox"
          value="yes"
          required
          className="mt-0.5 h-4 w-4 accent-[#4f46e5]"
        />
        <span>
          Send me this workflow pack and occasional Shetty&apos;s Desk field notes. I can unsubscribe at any time. See the{" "}
          <a href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
            privacy note
          </a>
          .
        </span>
      </label>

      {state.status === "error" && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={state.status === "submitting"}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {state.status === "submitting" ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Mail className="h-4 w-4" aria-hidden />
        )}
        {state.status === "submitting" ? "Preparing your pack" : "Email me the free pack"}
      </button>
    </form>
  );
}
