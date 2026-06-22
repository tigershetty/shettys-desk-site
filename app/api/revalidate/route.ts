import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand revalidation for the article pages. Trigger it (e.g. from a Notion
 * automation/button or a curl) to refresh immediately instead of waiting for the
 * 10-minute ISR window:
 *
 *   POST /api/revalidate?secret=YOUR_SECRET
 *
 * Set REVALIDATE_SECRET in the environment. Without it, the endpoint is disabled.
 */
function handle(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, message: "Invalid or missing secret" },
      { status: 401 },
    );
  }

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/articles/[slug]", "page");

  return NextResponse.json({ ok: true, revalidated: true, now: Date.now() });
}

export async function POST(req: NextRequest) {
  return handle(req);
}

export async function GET(req: NextRequest) {
  return handle(req);
}
