import { NextResponse } from "next/server";
import { db } from "@/db";
import { videoClicks } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { toVideoId } = body as { toVideoId?: unknown };
    if (!toVideoId) {
      return NextResponse.json({ error: "Missing toVideoId" }, { status: 400 });
    }
    await db.insert(videoClicks).values({
      fromVideoId: id,
      toVideoId: String(toVideoId),
      userAgent: req.headers.get("user-agent") || "",
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to log click:", (err as Error).message);
    return NextResponse.json({ error: "Failed to log click" }, { status: 500 });
  }
}
