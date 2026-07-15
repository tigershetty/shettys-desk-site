import { NextResponse } from "next/server";
import { createDownloadToken } from "@/lib/resource-download";
import { subscribeToResourceList } from "@/lib/subscriber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESOURCE = "demand-sensing-router";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = String(body.email || "").trim().toLowerCase();
    const consent = body.consent === "yes";
    const honeypot = String(body.companyWebsite || "").trim();

    if (honeypot) {
      return NextResponse.json({ error: "The request could not be completed." }, { status: 400 });
    }

    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Confirm the email consent to receive the pack." },
        { status: 400 }
      );
    }

    await subscribeToResourceList({ email });

    const token = createDownloadToken(RESOURCE);
    return NextResponse.json(
      {
        downloadUrl: `/api/resources/${RESOURCE}/download?token=${encodeURIComponent(token)}`,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Resource signup failed", error);
    return NextResponse.json(
      { error: "The pack could not be prepared right now. Please try again." },
      { status: 503 }
    );
  }
}
