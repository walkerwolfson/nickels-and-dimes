import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/settings", "/admin"],
    },
    sitemap: "https://nickelsanddimes.app/sitemap.xml",
    host: "https://nickelsanddimes.app",
  };
}
