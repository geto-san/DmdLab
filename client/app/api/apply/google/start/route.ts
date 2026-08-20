import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { applyOauthAuthUrl, applyOauthConfigured } from "@/lib/apply-google-oauth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!applyOauthConfigured()) {
    return NextResponse.json(
      { error: "Google verification is not configured." },
      { status: 400 }
    );
  }

  const state = randomBytes(24).toString("base64url");
  const res = NextResponse.redirect(applyOauthAuthUrl(state));
  res.cookies.set("apply_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });
  return res;
}
