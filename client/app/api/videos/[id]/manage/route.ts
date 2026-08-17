import { NextResponse } from "next/server";
import { fetchManagedVideo } from "@/lib/youtube-manage";
import { requireAdmin } from "@/app/api/admin/guard";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const video = await fetchManagedVideo(id);
    if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });
    return NextResponse.json(video);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
