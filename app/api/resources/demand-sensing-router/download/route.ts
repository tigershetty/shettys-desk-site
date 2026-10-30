import { readFile } from "node:fs/promises";
import path from "node:path";
import { getResource } from "@/data/resources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE_NAME = "shettys-desk-demand-sensing-router-v1.2.0.zip";

export async function GET() {
  // Hidden resources are not served. Flip `hidden` in data/resources.ts to re-open.
  if (!getResource("demand-sensing-router")) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "private",
      "resources",
      "demand-sensing-router-v1.2.0.zip"
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
