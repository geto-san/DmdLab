import { revalidatePath } from "next/cache";
import {
  announcements,
  posts,
  about,
  videos,
  contentBlocks,
  siteSettings,
  applications,
} from "@/db/schema";
import { resetSettingsCache } from "./settings";

// "members" (like "article") has its own dedicated /api/admin/members
// routes it needs multipart form + Cloudinary upload handling that this
// generic JSON table map can't provide, so it's intentionally excluded here.
export const TABLES = {
  announcements,
  posts,
  about,
  videos,
  content: contentBlocks,
  settings: siteSettings,
  applications,
} as const;

export type CollectionKey = keyof typeof TABLES;

export function resolveTable(collection: string) {
  return (TABLES as Record<string, unknown>)[collection] as
    | (typeof TABLES)[CollectionKey]
    | undefined;
}

export const CONTENT_KEY_PATTERN = /^[a-z0-9-]+$/;

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
  } else if (collection === "settings") {
    resetSettingsCache();
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath("/team");
  } else if (collection === "applications") {
    revalidatePath("/manage/applications");
  }
}
