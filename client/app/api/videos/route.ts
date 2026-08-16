import { NextResponse } from "next/server";
import { fetchChannelVideos } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = parseInt(searchParams.get("maxResults") || "10", 10);
    const maxResults = Math.min(Math.max(Number.isFinite(raw) ? raw : 10, 1), 50);
    const videos = await fetchChannelVideos(maxResults);
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Failed to fetch YouTube videos:", (error as Error).message);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
