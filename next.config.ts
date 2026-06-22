import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Article images can be pasted into Notion as external https URLs or kept as
    // local /public paths. Allow remote https sources for the former.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
