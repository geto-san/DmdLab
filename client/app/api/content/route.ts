import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contentBlocks } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select({
        key: contentBlocks.key,
        section: contentBlocks.section,
        payload: contentBlocks.payload,
      })
      .from(contentBlocks)
      .where(eq(contentBlocks.enabled, true));
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
