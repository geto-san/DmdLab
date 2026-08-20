import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { toSafeString } from "@/lib/to-string";
import { ALLOWED_EMAIL_DOMAINS, isAllowedApplicantEmail } from "@/lib/allowed-email-domains";

export const dynamic = "force-dynamic";

const DOMAIN_HINT = `Please use a ${ALLOWED_EMAIL_DOMAINS.map((d) => `@${d}`).join(", ")} email address.`;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const name = toSafeString(body.name).trim().slice(0, 200);
  const email = toSafeString(body.email).trim().toLowerCase().slice(0, 320);
  const message = toSafeString(body.message).trim().slice(0, 4000);

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!isAllowedApplicantEmail(email)) {
    return NextResponse.json({ error: DOMAIN_HINT }, { status: 400 });
  }

  await db.insert(applications).values({ name, email, message: message || null });

  return NextResponse.json({ success: true }, { status: 201 });
}
