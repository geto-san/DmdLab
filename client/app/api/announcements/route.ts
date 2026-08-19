import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { announcements } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Number.parseInt(searchParams.get("limit") || "10", 10) || 10);
    const rows = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.date))
      .limit(limit);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}
