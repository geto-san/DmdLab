import { NextResponse } from "next/server";
import { verifyApplicantWithCode } from "@/lib/apply-google-oauth";

export const dynamic = "force-dynamic";

function siteUrl(path: string) {
  const base = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("apply_oauth_state="))
    ?.split("=")[1];

  const fail = () => {
    const res = NextResponse.redirect(siteUrl("/team?applied=error#join-team"));
    res.cookies.delete("apply_oauth_state");
    return res;
  };

  if (!code || !state || !expectedState || state !== expectedState) {
    return fail();
  }

  try {
    const { email, name } = await verifyApplicantWithCode(code);
    const res = NextResponse.redirect(siteUrl("/team?applied=verified#join-team"));
    res.cookies.delete("apply_oauth_state");
    res.cookies.set("apply_verified_email", email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15,
      path: "/",
    });
    res.cookies.set("apply_verified_name", name, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15,
      path: "/",
    });
    return res;
  } catch {
    return fail();
  }
}
