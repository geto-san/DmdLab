import type { MetadataRoute } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { getContentMap } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dmd-lab-ochre.vercel.app";

type ResearchProject = { slug?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/articles`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/research`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/publications`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/team`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/videos`, changeFrequency: "weekly", priority: 0.6 },
  ];

  // Best-effort: a DB hiccup here should never take the sitemap route down.
  const [articleRoutes, researchRoutes] = await Promise.all([
    db
      .select({ id: articles.id, date: articles.date })
      .from(articles)
      .orderBy(desc(articles.date))
      .then((rows) =>
        rows.map(
          (a): MetadataRoute.Sitemap[number] => ({
            url: `${SITE_URL}/articles/${a.id}`,
            lastModified: a.date ? new Date(a.date) : undefined,
            changeFrequency: "monthly",
            priority: 0.6,
          })
        )
      )
      .catch(() => []),
    getContentMap()
      .then((content) => {
        const projects = (content.research as { projects?: ResearchProject[] } | undefined)?.projects ?? [];
        return projects
          .filter((p): p is Required<ResearchProject> => Boolean(p.slug))
          .map(
            (p): MetadataRoute.Sitemap[number] => ({
              url: `${SITE_URL}/research/${p.slug}`,
              changeFrequency: "monthly",
              priority: 0.6,
            })
          );
      })
      .catch(() => []),
  ]);

  return [...staticRoutes, ...articleRoutes, ...researchRoutes];
}
