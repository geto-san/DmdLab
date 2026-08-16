import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { uploadStream, destroyImage } from "@/lib/cloudinary";
import { requireAdmin } from "../../guard";

export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

function parseForm(form: FormData): Record<string, unknown> {
  return {
    title: String(form.get("title") || ""),
    description: String(form.get("description") || "") || null,
    content: String(form.get("content") || "") || null,
    author: String(form.get("author") || "Unknown") || "Unknown",
    category: String(form.get("category") || "General") || "General",
    tags: form.getAll("tags").map(String).filter(Boolean),
  };
}

async function uploadImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Only JPEG, PNG, WEBP, or GIF images are allowed" as string | null, data: null };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.byteLength > MAX_IMAGE_SIZE) {
    return { error: "Image must be under 10 MB" as string | null, data: null };
  }
  const result = await uploadStream(buffer, { folder: "deepminds/articles" });
  return { error: null, data: { image: result.secure_url, imagePublicId: result.public_id } };
}

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
    const data = parseForm(form);

    const file = form.get("image");
    if (file && typeof file !== "string" && "arrayBuffer" in file) {
      const { error, data: img } = await uploadImage(file as File);
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
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete article", details: (err as Error).message },
      { status: 400 }
    );
  }
}
