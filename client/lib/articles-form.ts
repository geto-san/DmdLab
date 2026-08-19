import { revalidatePath } from "next/cache";
import { uploadStream } from "@/lib/cloudinary";

// Home shows the 3 latest articles; the list/detail pages show the rest.
export function revalidateArticlePaths(id?: number) {
  revalidatePath("/");
  revalidatePath("/articles");
  if (id != null) revalidatePath(`/articles/${id}`);
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

// form.get() returns string | File | null — never stringify it blindly
// (a File would become the useless "[object File]").
function formString(form: FormData, key: string, fallback = ""): string {
  const value = form.get(key);
  return typeof value === "string" && value ? value : fallback;
}

export function parseArticleForm(form: FormData): Record<string, unknown> {
  return {
    title: formString(form, "title"),
    description: formString(form, "description") || null,
    content: formString(form, "content") || null,
    author: formString(form, "author", "Unknown"),
    category: formString(form, "category", "General"),
    tags: form.getAll("tags").map(String).filter(Boolean),
  };
}

export async function uploadArticleImage(file: File) {
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
