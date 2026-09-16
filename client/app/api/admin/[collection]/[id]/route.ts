import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  resolveTable,
  revalidateForCollection,
  pickEditable,
  normalizeContentPatch,
} from "@/lib/collections";
import { notifyMembersOfUpdate } from "@/lib/notify-members";
import { requireAdmin } from "../../guard";

const NOTIFIABLE_CONTENT_KEYS = new Set(["research", "publications"]);

export const dynamic = "force-dynamic";

function parseId(id: string) {
  const num = Number(id);
  return Number.isInteger(num) ? num : null;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { collection, id } = await params;
  const table = resolveTable(collection);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const recordId = parseId(id);
  if (recordId === null) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    let data: Record<string, unknown>;
    if (collection === "content") {
      delete body.id;
      const error = normalizeContentPatch(body);
      if (error) return NextResponse.json({ error }, { status: 400 });
      data = body;
    } else {
      data = pickEditable(collection, body);
    }
    const [updated] = await db
      .update(table)
      .set(data as never)
      .where(eq(table.id, recordId))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateForCollection(collection);
    if (collection === "content" && NOTIFIABLE_CONTENT_KEYS.has((updated as { key: string }).key)) {
      const key = (updated as { key: string; title: string | null }).key as "research" | "publications";
      await notifyMembersOfUpdate(key, (updated as { title: string | null }).title || "", `/${key}`);
    }
    return NextResponse.json(updated);
  } catch (err) {
    if (collection === "content" && (err as { code?: string })?.code === "23505") {
      return NextResponse.json({ error: "Key already exists" }, { status: 400 });
    }
    console.error(`Failed to update "${collection}" record ${recordId}:`, err);
    return NextResponse.json({ error: "Failed to update record" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { collection, id } = await params;
  const table = resolveTable(collection);
  if (!table) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });

  const recordId = parseId(id);
  if (recordId === null) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const [removed] = await db
      .delete(table)
      .where(eq(table.id, recordId))
      .returning({ id: table.id });
    if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateForCollection(collection);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`Failed to delete "${collection}" record ${recordId}:`, err);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 400 });
  }
}
