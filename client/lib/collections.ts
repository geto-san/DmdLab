import { revalidatePath } from "next/cache";
import {
  announcements,
  posts,
  about,
  videos,
  contentBlocks,
  applications,
} from "@/db/schema";
import { toSafeString } from "@/lib/to-string";

// "members" (like "article") has its own dedicated /api/admin/members
// routes it needs multipart form + Cloudinary upload handling that this
// generic JSON table map can't provide, so it's intentionally excluded here.
export const TABLES = {
  announcements,
  posts,
  about,
  videos,
  content: contentBlocks,
  applications,
} as const;

export type CollectionKey = keyof typeof TABLES;

export function resolveTable(collection: string) {
  return (TABLES as Record<string, unknown>)[collection] as
    | (typeof TABLES)[CollectionKey]
    | undefined;
}

export const CONTENT_KEY_PATTERN = /^[a-z0-9-]+$/;

// Whitelist of columns the generic /api/admin/[collection] routes may read
// or write. Anything outside these lists (ids, createdAt, updatedAt, and any
// future internal column) is silently dropped, which both prevents mass
// assignment and keeps the CMS panels from accidentally clobbering metadata.
const EDITABLE_FIELDS: Record<CollectionKey, string[]> = {
  announcements: ["title", "body"],
  posts: ["title", "content", "author", "date", "tags"],
  about: ["title", "content"],
  videos: ["title", "youtubeUrl", "description", "publishedAt"],
  content: ["key", "section", "title", "enabled", "payload"],
  applications: ["name", "email", "message", "reviewed"],
};

// Returns a shallow copy of `body` holding only the editable columns for a
// collection. Absent fields stay absent (partial-update friendly); fields not
// in the whitelist — including ids and timestamps — are dropped.
export function pickEditable(
  collection: string,
  body: Record<string, unknown>
): Record<string, unknown> {
  const allowed = EDITABLE_FIELDS[collection as CollectionKey];
  if (!allowed) return {};
  const picked: Record<string, unknown> = {};
  for (const field of allowed) {
    if (body[field] !== undefined) picked[field] = body[field];
  }
  return picked;
}

// Validates and normalizes a content-block patch in place. Only touches fields
// that are present, so the same helper serves both create (POST) and partial
// update (PUT) semantics. Returns an error message on an invalid `key`, else null.
export function normalizeContentPatch(
  data: Record<string, unknown>
): string | null {
  if (data.key !== undefined) {
    const key = toSafeString(data.key).trim().toLowerCase();
    if (!key || !CONTENT_KEY_PATTERN.test(key)) {
      return "key must be lowercase alphanumeric with dashes (e.g. hero)";
    }
    data.key = key;
  }
  if (data.section !== undefined) {
    const section = toSafeString(data.section).trim();
    data.section = section || "general";
  }
  if (data.title !== undefined) data.title = toSafeString(data.title);
  if (data.enabled !== undefined) data.enabled = data.enabled !== false;
  if (data.payload !== undefined) {
    data.payload =
      data.payload &&
      typeof data.payload === "object" &&
      !Array.isArray(data.payload)
        ? data.payload
        : {};
  }
  return null;
}

// Public pages each collection feeds. "about"/"posts"/the DB "videos" table
// are CMS-editable but not read by any public page nothing to revalidate.
export function revalidateForCollection(collection: string) {
  if (collection === "announcements") {
    revalidatePath("/");
  } else if (collection === "content") {
    // A content block's key isn't known here reliably (id-keyed PUT/DELETE),
    // so revalidate every page that reads content blocks.
    revalidatePath("/");
    revalidatePath("/research");
    revalidatePath("/research/[slug]", "page");
    revalidatePath("/publications");
  } else if (collection === "applications") {
    revalidatePath("/manage/applications");
  }
}
