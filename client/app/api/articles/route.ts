import { NextResponse } from "next/server";
import { getArticlesPage } from "@/lib/articles";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") || "10", 10) || 10));

    const { rows, total } = await getArticlesPage({ category, page, limit });

    return NextResponse.json({ articles: rows, total, page, limit });
  } catch {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
