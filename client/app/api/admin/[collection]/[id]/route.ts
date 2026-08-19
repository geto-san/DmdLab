import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { resolveTable, CONTENT_KEY_PATTERN, revalidateForCollection } from "@/lib/collections";
import { toSafeString } from "@/lib/to-string";
import { requireAdmin } from "../../guard";

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
    const data: Record<string, unknown> = { ...body };
    delete data.id;
    if (collection === "content") {
      if (data.key !== undefined && !CONTENT_KEY_PATTERN.test(toSafeString(data.key))) {
        return NextResponse.json(
          { error: "key must be lowercase alphanumeric with dashes (e.g. hero)" },
          { status: 400 }
        );
      }
      if (
        data.payload !== undefined &&
        (typeof data.payload !== "object" || Array.isArray(data.payload))
      ) {
        data.payload = {};
      }
    }
    const [updated] = await db
      .update(table)
      .set(data as never)
      .where(eq(table.id, recordId))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateForCollection(collection);
    return NextResponse.json(updated);
  } catch (err) {
    if (collection === "content" && (err as { code?: string })?.code === "23505") {
      return NextResponse.json({ error: "Content key already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
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
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
