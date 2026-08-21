import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { videoComments } from "@/db/schema";
import { toSafeString } from "@/lib/to-string";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const rows = await db
      .select()
      .from(videoComments)
      .where(eq(videoComments.videoId, id))
      .orderBy(asc(videoComments.createdAt))
      .limit(200);
    return NextResponse.json({ comments: rows });
  } catch (err) {
    console.error("Failed to list comments:", (err as Error).message);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    if (isRateLimited(`vc:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many comments — try again later." }, { status: 429 });
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const name = toSafeString(body.name).trim().slice(0, 60);
    const text = toSafeString(body.body).trim().slice(0, 2000);

    if (!id || !/^[\w-]{6,30}$/.test(id)) {
      return NextResponse.json({ error: "Invalid video id." }, { status: 400 });
    }
    if (name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
    }
    if (text.length < 2) {
      return NextResponse.json({ error: "Comment must be at least 2 characters." }, { status: 400 });
    }

    const [created] = await db.insert(videoComments).values({ videoId: id, name, body: text }).returning();
    return NextResponse.json({ comment: created }, { status: 201 });
  } catch (err) {
    console.error("Failed to create comment:", (err as Error).message);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
