import type { MetadataRoute } from "next";
import { getAllGuides } from "@/lib/guides";

const BASE = "https://nickelsanddimes.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getAllGuides().map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: new Date(g.updated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...guides,
    {
      url: `${BASE}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
