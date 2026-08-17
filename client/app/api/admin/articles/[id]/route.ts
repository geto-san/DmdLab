import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { destroyImage } from "@/lib/cloudinary";
import { parseArticleForm, uploadArticleImage, revalidateArticlePaths } from "@/lib/articles-form";
import { requireAdmin } from "../../guard";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const articleId = Number(id);
    if (!Number.isInteger(articleId)) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const form = await req.formData();
    const data = parseArticleForm(form);

    const file = form.get("image");
    if (file && typeof file !== "string" && "arrayBuffer" in file) {
      const { error, data: img } = await uploadArticleImage(file as File);
      if (error) return NextResponse.json({ error }, { status: 400 });
      const [existing] = await db
        .select({ imagePublicId: articles.imagePublicId })
        .from(articles)
        .where(eq(articles.id, articleId))
        .limit(1);
      await destroyImage(existing?.imagePublicId);
      Object.assign(data, img);
    }

    const [updated] = await db
      .update(articles)
      .set(data as never)
      .where(eq(articles.id, articleId))
      .returning();
    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    revalidateArticlePaths(articleId);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update article", details: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const articleId = Number(id);
    if (!Number.isInteger(articleId)) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    const [removed] = await db
      .delete(articles)
      .where(eq(articles.id, articleId))
      .returning({ id: articles.id, imagePublicId: articles.imagePublicId });
    if (!removed) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    await destroyImage(removed.imagePublicId);
    revalidateArticlePaths(articleId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete article", details: (err as Error).message },
      { status: 400 }
    );
  }
}
