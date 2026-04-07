import type { MetadataRoute } from "next";
import { listSpecies } from "@/lib/db-public";
import { getMetadataBase } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getMetadataBase().origin;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/funghi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/eventi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/annunci`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/news`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  const species = await listSpecies();
  const speciesRoutes: MetadataRoute.Sitemap =
    species?.map((s) => ({
      url: `${base}/funghi/${s.id}`,
      lastModified: s.updatedAt ?? s.createdAt ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) ?? [];

  return [...staticRoutes, ...speciesRoutes];
}
