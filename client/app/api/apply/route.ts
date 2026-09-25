import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { toSafeString } from "@/lib/to-string";
import { ALLOWED_EMAIL_DOMAINS, isAllowedApplicantEmail } from "@/lib/allowed-email-domains";

export const dynamic = "force-dynamic";

const DOMAIN_LIST = ALLOWED_EMAIL_DOMAINS.map((d) => `@${d}`).join(", ");
const DOMAIN_HINT = `Please use a ${DOMAIN_LIST} email address.`;

export async function POST(req: Request) {
  if (isRateLimited(`apply:${clientIp(req)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many applications — try again later." }, { status: 429 });
  }

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

  try {
    const existing = await db
      .select({ id: applications.id })
      .from(applications)
      .where(eq(applications.email, email))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Looks like you've already applied — we'll be in touch." },
        { status: 409 }
      );
    }

    await db.insert(applications).values({ name, email, message: message || null });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json(
        { error: "Looks like you've already applied — we'll be in touch." },
        { status: 409 }
      );
    }
    console.error("Failed to record application:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

function isUniqueViolation(err: unknown): boolean {
  const e = err as { code?: string; message?: string };
  return e?.code === "23505" || (typeof e?.message === "string" && e.message.includes("duplicate key"));
}
