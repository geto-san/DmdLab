import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { contentBlocks } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params;
    const [block] = await db
      .select({
        key: contentBlocks.key,
        section: contentBlocks.section,
        payload: contentBlocks.payload,
      })
      .from(contentBlocks)
      .where(and(eq(contentBlocks.key, key), eq(contentBlocks.enabled, true)))
      .limit(1);
    if (!block) {
      return NextResponse.json({ error: "Content block not found" }, { status: 404 });
    }
    return NextResponse.json(block);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
