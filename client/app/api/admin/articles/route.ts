import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { uploadStream } from "@/lib/cloudinary";
import { requireAdmin } from "../guard";

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
    const data = parseForm(form);

    const file = form.get("image");
    if (file && typeof file !== "string" && "arrayBuffer" in file) {
      const { error, data: img } = await uploadImage(file as File);
      if (error) return NextResponse.json({ error }, { status: 400 });
      Object.assign(data, img);
    }

    const [saved] = await db.insert(articles).values(data as never).returning();
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add article", details: (err as Error).message },
      { status: 400 }
    );
  }
}
