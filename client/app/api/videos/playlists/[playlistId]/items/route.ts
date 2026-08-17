import { NextResponse } from "next/server";
import { addVideoToPlaylist } from "@/lib/youtube-manage";
import { requireAdmin } from "@/app/api/admin/guard";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { playlistId } = await params;
    const body = (await req.json().catch(() => ({}))) as { videoId?: string };
    if (!body.videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }
    const item = await addVideoToPlaylist(playlistId, body.videoId);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
