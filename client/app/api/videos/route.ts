import { NextResponse } from "next/server";
import { fetchChannelVideos } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("maxResults");
    const parsed = raw ? parseInt(raw, 10) : NaN;
    const videos = await fetchChannelVideos(Number.isFinite(parsed) ? parsed : undefined);
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Failed to fetch YouTube videos:", (error as Error).message);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
