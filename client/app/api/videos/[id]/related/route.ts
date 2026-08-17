import { NextResponse } from "next/server";
import { fetchRelatedVideos } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("maxResults");
    const parsed = raw ? parseInt(raw, 10) : NaN;
    const related = await fetchRelatedVideos(id, Number.isFinite(parsed) ? parsed : undefined);
    return NextResponse.json(related);
  } catch (err) {
    console.error("Error in related endpoint:", (err as Error).message);
    return NextResponse.json({ error: "Failed to compute related videos" }, { status: 500 });
  }
}
