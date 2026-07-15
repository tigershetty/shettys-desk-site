import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE_NAME = "shettys-desk-demand-sensing-router-v1.1.0.zip";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "private",
      "resources",
      "demand-sensing-router-v1.1.0.zip"
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
  } catch (error) {
    console.error("Resource download failed", error);
    return new Response("The pack could not be prepared right now.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
