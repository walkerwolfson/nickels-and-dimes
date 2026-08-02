import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nickels & Dimes",
    short_name: "N&D",
    description: "Calisthenics rep tracking — log, clubs, PRs, history.",
    start_url: "/",
    display: "standalone",
    background_color: "#EEF0FB",
    theme_color: "#8C6FF0",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
