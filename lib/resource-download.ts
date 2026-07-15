import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_LIFETIME_SECONDS = 15 * 60;

function getSecret() {
  const configured = process.env.RESOURCE_DOWNLOAD_SECRET;
  if (configured) return configured;

  if (process.env.NODE_ENV !== "production") {
    return "local-preview-only-resource-secret";
  }

  throw new Error("RESOURCE_DOWNLOAD_SECRET is not configured.");
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createDownloadToken(resource: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS;
  const payload = `${resource}.${expiresAt}`;
  return `${expiresAt}.${sign(payload)}`;
}

export function verifyDownloadToken(token: string, resource: string) {
  const [expiresAtText, providedSignature] = token.split(".");
  const expiresAt = Number(expiresAtText);

  if (!expiresAt || !providedSignature || expiresAt < Date.now() / 1000) {
    return false;
  }

  const expectedSignature = sign(`${resource}.${expiresAt}`);
  const expected = Buffer.from(expectedSignature, "hex");
  const provided = Buffer.from(providedSignature, "hex");

  return expected.length === provided.length && timingSafeEqual(expected, provided);
}
