import { revalidatePath } from "next/cache";
import { uploadStream } from "@/lib/cloudinary";

export function revalidateMemberPaths() {
  revalidatePath("/team");
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

// form.get() returns string | File | null never stringify it blindly
// (a File would become the useless "[object File]").
function formString(form: FormData, key: string, fallback = ""): string {
  const value = form.get(key);
  return typeof value === "string" && value ? value : fallback;
}

export function parseMemberForm(form: FormData): Record<string, unknown> {
  return {
    name: formString(form, "name"),
    role: formString(form, "role") || null,
    // If a file is also being uploaded, form.get("photo") holds that File
    // (not a string) at this point — formString() falls back to "" → null,
    // and the route below overwrites it with the uploaded image's URL.
    photo: formString(form, "photo") || null,
    email: formString(form, "email") || null,
    linkedin: formString(form, "linkedin") || null,
    github: formString(form, "github") || null,
    otherUrl: formString(form, "otherUrl") || null,
    alumni: form.get("alumni") === "true",
  };
}

export async function uploadMemberPhoto(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Only JPEG, PNG, WEBP, or GIF images are allowed" as string | null, data: null };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.byteLength > MAX_IMAGE_SIZE) {
    return { error: "Image must be under 10 MB" as string | null, data: null };
  }
  const result = await uploadStream(buffer, { folder: "deepminds/members" });
  return { error: null, data: { photo: result.secure_url, photoPublicId: result.public_id } };
}
