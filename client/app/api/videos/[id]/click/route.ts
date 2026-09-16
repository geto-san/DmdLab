import { NextResponse } from "next/server";
import { db } from "@/db";
import { videoClicks } from "@/db/schema";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { toSafeString } from "@/lib/to-string";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (isRateLimited(`click:${clientIp(req)}`, 20, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { toVideoId } = body as { toVideoId?: unknown };
    if (!toVideoId) {
      return NextResponse.json({ error: "Missing toVideoId" }, { status: 400 });
    }
    await db.insert(videoClicks).values({
      fromVideoId: id,
      toVideoId: toSafeString(toVideoId),
      userAgent: req.headers.get("user-agent") || "",
      ip: clientIp(req),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to log click:", (err as Error).message);
    return NextResponse.json({ error: "Failed to log click" }, { status: 500 });
  }
}
