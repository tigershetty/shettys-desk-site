import { readFile } from "node:fs/promises";
import path from "node:path";
import { verifyDownloadToken } from "@/lib/resource-download";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESOURCE = "demand-sensing-router";
const FILE_NAME = "shettys-desk-demand-sensing-router-v1.0.0.zip";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";

  if (!verifyDownloadToken(token, RESOURCE)) {
    return new Response("This download link is invalid or has expired.", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const filePath = path.join(
    process.cwd(),
    "private",
    "resources",
    "demand-sensing-router-v1.0.0.zip"
  );
  const archive = await readFile(filePath);

  return new Response(archive, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${FILE_NAME}"`,
      "Content-Length": String(archive.byteLength),
      "Content-Type": "application/zip",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
