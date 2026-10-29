import type { NextConfig } from "next";

const securityHeaders = [
  // Express the site's content-use preference to AI-aware delivery systems.
  { key: "Content-Signal", value: "search=yes, ai-input=no, ai-train=no" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-XSS-Protection", value: "0" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), geolocation=(), magnetometer=(), microphone=(), payment=(), usb=(), browsing-topics=()",
  },
];

// The site is moving from tigershetty.com to shettysdesk.com. The old address
// keeps serving the site until shettysdesk.com is attached to the Vercel
// project and its DNS resolves; set REDIRECT_LEGACY_DOMAIN=1 in Vercel then,
// and the old hosts redirect to the new one. See docs/domain-switch-shettysdesk.md.
const NEW_SITE = "https://www.shettysdesk.com";
const moved = process.env.REDIRECT_LEGACY_DOMAIN === "1";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        // Keep a single public origin so links, cookies, and search indexing
        // consistently use the secure www domain.
        source: "/:path*",
        has: [{ type: "host", value: "shettysdesk.com" }],
        destination: `${NEW_SITE}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "tigershetty.com" }],
        destination: moved ? `${NEW_SITE}/:path*` : "https://www.tigershetty.com/:path*",
        permanent: true,
      },
      // The old www host follows once the move is switched on.
      ...(moved
        ? [
            {
              source: "/:path*",
              has: [{ type: "host" as const, value: "www.tigershetty.com" }],
              destination: `${NEW_SITE}/:path*`,
              permanent: true,
            },
          ]
        : []),
      {
        // My Approach lives on as the method strip on the Shetty's Desk page.
        source: "/approach",
        destination: "/shettys-desk#method",
        permanent: true,
      },
      {
        source: "/workshop",
        destination: "/shettys-desk#method",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  outputFileTracingIncludes: {
    "/api/resources/demand-sensing-router/download": [
      "./private/resources/demand-sensing-router-v1.2.0.zip",
    ],
  },
};

export default nextConfig;
