import { NextResponse } from "next/server";
import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "@/db";
import { videoComments } from "@/db/schema";
import { toSafeString } from "@/lib/to-string";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") || "20", 10) || 20));
    const beforeRaw = searchParams.get("before");
    const before = beforeRaw && Number.isInteger(Number(beforeRaw)) ? Number(beforeRaw) : null;

    const rows = await db
      .select()
      .from(videoComments)
      .where(
        before
          ? and(eq(videoComments.videoId, id), lt(videoComments.id, before))
          : eq(videoComments.videoId, id)
      )
      .orderBy(desc(videoComments.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    return NextResponse.json({ comments: page, hasMore, nextCursor: hasMore ? page[page.length - 1].id : null });
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
