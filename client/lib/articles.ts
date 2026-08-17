import "server-only";

import { count, desc, ilike } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";

export async function getArticlesPage({
  category,
  page,
  limit,
}: {
  category?: string | null;
  page: number;
  limit: number;
}) {
  const where = category && category !== "all" ? ilike(articles.category, category) : undefined;
  const skip = (page - 1) * limit;

  const [rows, [{ value: total }]] = await Promise.all([
    db.select().from(articles).where(where).orderBy(desc(articles.date)).limit(limit).offset(skip),
    db.select({ value: count() }).from(articles).where(where),
  ]);

  return { rows, total, page, limit };
}
