import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectYouTubeWithCode } from "@/lib/youtube-oauth";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const { data: session } = await auth.getSession();
  const isAdmin = session?.user?.role === "admin";
  const backTo = isAdmin ? "/videos" : "/manage/login";

  const redirect = (params: Record<string, string>) =>
    NextResponse.redirect(`${new URL(req.url).origin}${backTo}?${new URLSearchParams(params)}`);

  if (error) return redirect({ youtuberror: "Google authorization was cancelled." });

  const cookieStore = await cookies();
  const expected = cookieStore.get("yt_oauth_state")?.value;
  if (!expected || expected !== state || !code) {
    return redirect({ youtuberror: "Invalid OAuth state." });
  }
  cookieStore.delete("yt_oauth_state");

  try {
    await connectYouTubeWithCode(code);
  } catch (err) {
    console.error("YouTube OAuth connect failed:", (err as Error).message);
    return redirect({ youtuberror: "Could not connect the YouTube account." });
  }

  return NextResponse.redirect(`${new URL(req.url).origin}/videos`);
}
