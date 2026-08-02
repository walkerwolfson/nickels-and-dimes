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
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
