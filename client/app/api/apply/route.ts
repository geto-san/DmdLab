import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { toSafeString } from "@/lib/to-string";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const name = toSafeString(body.name).trim().slice(0, 200);
  const message = toSafeString(body.message).trim().slice(0, 4000);

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  // The email is never taken from the request body — it can only come from
  // the httpOnly cookie set after a successful Google verification
  // (see app/api/apply/google/callback/route.ts), so there is no path for
  // an applicant to submit an email they don't actually control.
  const cookieStore = await cookies();
  const email = cookieStore.get("apply_verified_email")?.value;
  if (!email) {
    return NextResponse.json(
      { error: "Please verify your email with Google before applying." },
      { status: 400 }
    );
  }

  await db.insert(applications).values({ name, email, message: message || null });

  const res = NextResponse.json({ success: true }, { status: 201 });
  res.cookies.delete("apply_verified_email");
  res.cookies.delete("apply_verified_name");
  return res;
}
