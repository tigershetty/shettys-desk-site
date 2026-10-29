// The site's public address, in one place. Set NEXT_PUBLIC_SITE_URL in Vercel
// to override it (for example on a preview).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.shettysdesk.com").replace(/\/$/, "");
