import { NextResponse } from "next/server";
import { count, desc, ilike } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10);

    const where =
      category && category !== "all" ? ilike(articles.category, category) : undefined;
    const skip = (page - 1) * limit;

    const [rows, [{ value: total }]] = await Promise.all([
      db
        .select()
        .from(articles)
        .where(where)
        .orderBy(desc(articles.date))
        .limit(limit)
        .offset(skip),
      db.select({ value: count() }).from(articles).where(where),
    ]);

    return NextResponse.json({ articles: rows, total, page, limit });
  } catch {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
