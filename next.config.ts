import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/workshop",
        destination: "/approach",
        permanent: true,
      },
    ];
  },
  images: {
    // Article images can be pasted into Notion as external https URLs or kept as
    // local /public paths. Allow remote https sources for the former.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  outputFileTracingIncludes: {
    "/api/resources/demand-sensing-router/download": [
      "./private/resources/demand-sensing-router-v1.2.0.zip",
    ],
  },
};

export default nextConfig;
