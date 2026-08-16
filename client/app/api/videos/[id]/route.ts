import { NextResponse } from "next/server";
import { fetchVideoById } from "@/lib/youtube";

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
