import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { contentBlocks } from "@/db/schema";
import { resolveTable, CONTENT_KEY_PATTERN, revalidateForCollection } from "@/lib/collections";
import { toSafeString } from "@/lib/to-string";
import { notifyMembersOfUpdate } from "@/lib/notify-members";
import { requireAdmin } from "../guard";

const NOTIFIABLE_CONTENT_KEYS = new Set(["research", "publications"]);

export const dynamic = "force-dynamic";

function normalizeContentInput(body: Record<string, unknown>) {
  const { key, section, title, enabled, payload } = body;
  const keyStr = toSafeString(key);
  if (!keyStr || !CONTENT_KEY_PATTERN.test(keyStr)) {
    return {
      error: "key must be lowercase alphanumeric with dashes (e.g. hero)" as string | null,
      data: null,
    };
  }
  return {
    error: null,
    data: {
      key: keyStr.trim().toLowerCase(),
      section: toSafeString(section, "general").trim() || "general",
      title: toSafeString(title),
      enabled: enabled !== false,
      payload:
        payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {},
    },
  };
}

function duplicateKeyError() {
  return NextResponse.json({ error: "Content key already exists" }, { status: 400 });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { collection } = await params;
  const table = resolveTable(collection);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const rows = await db.select().from(table).orderBy(asc(table.id));
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { collection } = await params;
  const table = resolveTable(collection);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    if (collection === "content") {
      const { error, data } = normalizeContentInput(body);
      if (error) return NextResponse.json({ error }, { status: 400 });
      const [saved] = await db.insert(contentBlocks).values(data as never).returning();
      revalidateForCollection(collection);
      if (NOTIFIABLE_CONTENT_KEYS.has(saved.key)) {
        await notifyMembersOfUpdate(saved.key as "research" | "publications", saved.title || "", `/${saved.key}`);
      }
      return NextResponse.json(saved, { status: 201 });
    }
    const [saved] = await db.insert(table).values(body as never).returning();
    revalidateForCollection(collection);
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    if (collection === "content" && (err as { code?: string })?.code === "23505") {
      return duplicateKeyError();
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
