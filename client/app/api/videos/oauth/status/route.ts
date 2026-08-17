import { NextResponse } from "next/server";
import { getStoredToken, youtubeOauthConfigured } from "@/lib/youtube-oauth";
import { requireAdmin } from "@/app/api/admin/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const token = await getStoredToken();
  return NextResponse.json({
    configured: youtubeOauthConfigured(),
    connected: Boolean(token),
    channelId: token?.channelId ?? null,
    channelTitle: token?.channelTitle ?? null,
  });
}
