import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { setVideoThumbnail } from "@/lib/youtube-manage";
import { invalidateVideoCaches } from "@/lib/youtube";
import { requireAdmin } from "@/app/api/admin/guard";

export const dynamic = "force-dynamic";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const size = Number(req.headers.get("content-length"));
    if (!req.body || !Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: "An image file is required" }, { status: 400 });
    }
    const data = Buffer.from(await req.arrayBuffer());
    const result = await setVideoThumbnail(id, {
      type: req.headers.get("content-type") ?? "image/jpeg",
      data,
    });
    invalidateVideoCaches(id);
    revalidatePath("/videos");
    revalidatePath(`/videos/${id}`);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Thumbnail upload failed:", (err as Error).message);
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
