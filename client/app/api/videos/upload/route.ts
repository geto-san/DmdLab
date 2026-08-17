import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import { revalidatePath } from "next/cache";
import { uploadVideo, addVideoToPlaylist } from "@/lib/youtube-manage";
import { invalidateVideoCaches } from "@/lib/youtube";
import { requireAdmin } from "@/app/api/admin/guard";

export const dynamic = "force-dynamic";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const url = new URL(req.url);
    const title = (url.searchParams.get("title") ?? "").trim();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const size = Number(req.headers.get("content-length"));
    if (!req.body || !Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: "A video file is required" }, { status: 400 });
    }

    const type = req.headers.get("content-type") ?? "video/mp4";
    const tags = (url.searchParams.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const playlistId = url.searchParams.get("playlistId") ?? "";

    const uploaded = await uploadVideo(
      Readable.fromWeb(req.body as unknown as import("node:stream/web").ReadableStream),
      {
        name: req.headers.get("x-file-name") ?? "video.mp4",
        type,
        size,
      },
      {
        title,
        description: url.searchParams.get("description") ?? "",
        tags,
        categoryId: url.searchParams.get("categoryId") ?? "22",
        privacyStatus: url.searchParams.get("privacyStatus") ?? "private",
      }
    );

    if (playlistId) {
      await addVideoToPlaylist(playlistId, uploaded.id).catch((err) =>
        console.error("Failed to add uploaded video to playlist:", (err as Error).message)
      );
    }

    invalidateVideoCaches();
    revalidatePath("/videos");
    return NextResponse.json({ id: uploaded.id });
  } catch (err) {
    console.error("Video upload failed:", (err as Error).message);
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
