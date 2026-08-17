import { NextResponse } from "next/server";
import { listPlaylistsWithItems, createPlaylist } from "@/lib/youtube-manage";
import { requireAdmin } from "@/app/api/admin/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const playlists = await listPlaylistsWithItems();
    return NextResponse.json(playlists);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await req.json().catch(() => ({}))) as {
      title?: string;
      description?: string;
      privacyStatus?: string;
    };
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const created = await createPlaylist({
      title: body.title.trim(),
      description: body.description,
      privacyStatus: body.privacyStatus || "private",
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
