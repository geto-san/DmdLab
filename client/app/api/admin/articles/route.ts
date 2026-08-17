import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { parseArticleForm, uploadArticleImage, revalidateArticlePaths } from "@/lib/articles-form";
import { requireAdmin } from "../guard";

export const dynamic = "force-dynamic";

export async function GET(_req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const rows = await db.select().from(articles).orderBy(desc(articles.date));
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const form = await req.formData();
    const data = parseArticleForm(form);

    const file = form.get("image");
    if (file && typeof file !== "string" && "arrayBuffer" in file) {
      const { error, data: img } = await uploadArticleImage(file as File);
      if (error) return NextResponse.json({ error }, { status: 400 });
      Object.assign(data, img);
    }

    const [saved] = await db.insert(articles).values(data as never).returning();
    revalidateArticlePaths();
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add article", details: (err as Error).message },
      { status: 400 }
    );
  }
}
