import type { NextConfig } from "next";

const securityHeaders = [
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

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/workshop",
        destination: "/approach",
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
