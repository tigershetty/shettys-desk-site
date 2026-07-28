import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shetty's Desk",
    short_name: "Shetty's Desk",
    description: "Supply chain, one breakdown at a time.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf0",
    theme_color: "#fffaf0",
    icons: [
      {
        src: "/images/favicon-mark.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
