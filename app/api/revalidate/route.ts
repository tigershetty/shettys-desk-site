import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * On-demand revalidation for the article pages. Trigger it (e.g. from a Notion
 * automation) to refresh immediately instead of waiting for the 10-minute ISR
 * window. Send the secret in an Authorization header so it never appears in URLs:
 *
 *   Authorization: Bearer YOUR_SECRET
 *
 * Set REVALIDATE_SECRET in the environment. Without it, the endpoint is disabled.
 */
function hasValidSecret(req: NextRequest): boolean {
  const configuredSecret = process.env.REVALIDATE_SECRET;
  const authorization = req.headers.get("authorization");
  if (!configuredSecret || !authorization?.startsWith("Bearer ")) return false;

  const suppliedSecret = authorization.slice("Bearer ".length);
  const expected = Buffer.from(configuredSecret);
  const supplied = Buffer.from(suppliedSecret);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export async function POST(req: NextRequest) {
  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, message: "Not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!hasValidSecret(req)) {
    return NextResponse.json(
      { ok: false, message: "Invalid or missing authorization" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/articles/[slug]", "page");

  return NextResponse.json(
    { ok: true, revalidated: true, now: Date.now() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
