import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { videoComments } from "@/db/schema";
import { requireAdmin } from "../../guard";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const commentId = Number((await params).id);
  if (!Number.isInteger(commentId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const [removed] = await db
      .delete(videoComments)
      .where(eq(videoComments.id, commentId))
      .returning({ id: videoComments.id });
    if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`Failed to delete comment ${commentId}:`, err);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}