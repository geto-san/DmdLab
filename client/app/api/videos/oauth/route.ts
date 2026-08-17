import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { disconnectYouTube, oauthAuthUrl, youtubeOauthConfigured } from "@/lib/youtube-oauth";
import { requireAdmin } from "@/app/api/admin/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!youtubeOauthConfigured()) {
    return NextResponse.json(
      { error: "Google OAuth is not configured (missing GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET)." },
      { status: 400 }
    );
  }

  const state = randomBytes(24).toString("base64url");
  const res = NextResponse.redirect(oauthAuthUrl(state));
  res.cookies.set("yt_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });
  return res;
}

export async function POST() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await disconnectYouTube();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
