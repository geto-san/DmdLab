import { revalidatePath } from "next/cache";
import { announcements, members, posts, about, videos, contentBlocks } from "@/db/schema";

export const TABLES = {
  announcements,
  members,
  posts,
  about,
  videos,
  content: contentBlocks,
} as const;

export type CollectionKey = keyof typeof TABLES;

export function resolveTable(collection: string) {
  return (TABLES as Record<string, unknown>)[collection] as
    | (typeof TABLES)[CollectionKey]
    | undefined;
}

export const CONTENT_KEY_PATTERN = /^[a-z0-9-]+$/;

// Public pages each collection feeds. "about"/"posts"/the DB "videos" table
// are CMS-editable but not read by any public page — nothing to revalidate.
export function revalidateForCollection(collection: string) {
  if (collection === "announcements") {
    revalidatePath("/");
  } else if (collection === "members") {
    revalidatePath("/team");
  } else if (collection === "content") {
    revalidatePath("/");
  }
}
