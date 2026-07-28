import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOPICS = new Set([
  "Suggest a topic for Shetty's Desk",
  "Invite me to speak",
  "Work with me",
  "Just say hello",
]);
const MAX_REQUEST_LENGTH = 8_192;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 4_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_MAX_BUCKETS = 5_000;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function json(body: object, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function clientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstIp = forwardedFor?.split(",")[0]?.trim();
  return (firstIp || request.headers.get("x-real-ip") || "unknown").slice(0, 64);
}

function rateLimit(request: NextRequest): number | null {
  const now = Date.now();

  if (rateLimitBuckets.size >= RATE_LIMIT_MAX_BUCKETS) {
    for (const [key, bucket] of rateLimitBuckets) {
      if (bucket.resetAt <= now) rateLimitBuckets.delete(key);
    }
    if (rateLimitBuckets.size >= RATE_LIMIT_MAX_BUCKETS) {
      rateLimitBuckets.clear();
    }
  }

  const key = clientKey(request);
  const existing = rateLimitBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return Math.max(1, Math.ceil((existing.resetAt - now) / 1_000));
  }

  existing.count += 1;
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) {
      return json({ error: "Request origin is not allowed" }, 403);
    }

    const retryAfter = rateLimit(request);
    if (retryAfter !== null) {
      return json(
        { error: "Too many requests. Please try again later." },
        429,
        { "Retry-After": String(retryAfter) },
      );
    }

    const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.startsWith("application/json")) {
      return json({ error: "Content type must be application/json" }, 415);
    }

    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_LENGTH) {
      return json({ error: "Request is too large" }, 413);
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_LENGTH) {
      return json({ error: "Request is too large" }, 413);
    }

    const body: unknown = JSON.parse(rawBody);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return json({ error: "Invalid request" }, 400);
    }

    const payload = body as Record<string, unknown>;
    if (
      typeof payload.topic !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.message !== "string" ||
      (payload.company !== undefined && typeof payload.company !== "string")
    ) {
      return json({ error: "Invalid request" }, 400);
    }

    // Legitimate visitors never fill this hidden field; bots often do.
    if (payload.company) {
      return json({ success: true }, 200);
    }

    const topic = payload.topic.trim();
    const email = payload.email.trim().toLowerCase();
    const message = payload.message.trim();

    if (!TOPICS.has(topic) || !email || !message) {
      return json({ error: "All fields are required" }, 400);
    }

    if (
      email.length > MAX_EMAIL_LENGTH ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return json({ error: "Invalid email address" }, 400);
    }

    if (message.length < 10 || message.length > MAX_MESSAGE_LENGTH) {
      return json(
        { error: `Message must be between 10 and ${MAX_MESSAGE_LENGTH} characters` },
        400,
      );
    }

    // TODO: integrate a transactional email service. Do not log contact details.
    return json({ success: true }, 200);
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
}
