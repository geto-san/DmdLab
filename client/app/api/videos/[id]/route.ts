import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchVideoById, invalidateVideoCaches } from "@/lib/youtube";
import { updateVideoMetadata, deleteVideo } from "@/lib/youtube-manage";
import { requireAdmin } from "@/app/api/admin/guard";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const video = await fetchVideoById(id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json(video);
  } catch (error) {
    console.error("Failed to fetch video by ID:", (error as Error).message);
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = (await req.json().catch(() => ({}))) as {
      title?: string;
      description?: string;
      tags?: string[];
      categoryId?: string;
      privacyStatus?: string;
    };
    const updated = await updateVideoMetadata(id, body);
    invalidateVideoCaches(id);
    revalidatePath("/videos");
    revalidatePath(`/videos/${id}`);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update video:", (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await deleteVideo(id);
    invalidateVideoCaches(id);
    revalidatePath("/videos");
    revalidatePath(`/videos/${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete video:", (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
