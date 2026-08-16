import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contentBlocks } from "@/db/schema";

// Deep-ish merge: top-level keys from payload win, objects merge recursively,
// arrays replace wholesale. Fallback stays intact for anything not provided.
export function mergeBlock(
  fallback: Record<string, unknown>,
  payload?: Record<string, unknown>
): Record<string, unknown> {
  const out = { ...(fallback || {}) };
  for (const [key, value] of Object.entries(payload || {})) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      out[key] &&
      typeof out[key] === "object" &&
      !Array.isArray(out[key])
    ) {
      out[key] = mergeBlock(out[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export type ContentMap = Record<string, Record<string, unknown>>;

// Reads all enabled content blocks from the DB once per request and returns
// a key -> payload map. Empty map when nothing found.
export async function getContentMap(): Promise<ContentMap> {
  try {
    const blocks = await db
      .select({ key: contentBlocks.key, payload: contentBlocks.payload })
      .from(contentBlocks)
      .where(eq(contentBlocks.enabled, true));
    const map: ContentMap = {};
    for (const b of blocks) {
      if (b.key) map[b.key] = (b.payload as Record<string, unknown> | null) || {};
    }
    return map;
  } catch (err) {
    console.warn("Content fetch failed, using fallbacks:", (err as Error).message);
    return {};
  }
}
