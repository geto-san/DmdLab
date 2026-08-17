import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { contactRateLimits } from "@/db/schema";

export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL;
const CONTACT_FROM = process.env.CONTACT_FROM || "onboarding@resend.dev";

const MAX_NAME = 120;
const MAX_MESSAGE = 4000;

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;

// Atomic upsert: within the window, increments; once the window has
// elapsed, resets to 1. Single statement, so concurrent requests from the
// same IP can't race past the limit the way a read-then-write check could.
async function checkRateLimit(ip: string): Promise<boolean> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - RATE_WINDOW_MS);
  const [row] = await db
    .insert(contactRateLimits)
    .values({ ip, windowStart: now, count: 1 })
    .onConflictDoUpdate({
      target: contactRateLimits.ip,
      set: {
        count: sql`case when ${contactRateLimits.windowStart} > ${cutoff.toISOString()}::timestamptz then ${contactRateLimits.count} + 1 else 1 end`,
        windowStart: sql`case when ${contactRateLimits.windowStart} > ${cutoff.toISOString()}::timestamptz then ${contactRateLimits.windowStart} else ${now.toISOString()}::timestamptz end`,
      },
    })
    .returning({ count: contactRateLimits.count });
  return row.count <= RATE_MAX;
}

type ContactBody = { name?: unknown; email?: unknown; message?: unknown };

export async function POST(req: Request) {
  if (!RESEND_API_KEY || !CONTACT_EMAIL) {
    return NextResponse.json(
      { error: "Contact form is not configured." },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const withinLimit = await checkRateLimit(ip).catch(() => true);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Too many messages. Try again later." },
      { status: 429 }
    );
  }

  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, MAX_NAME) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE) : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: CONTACT_FROM,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `Lab inquiry from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact send failed:", err);
    return NextResponse.json(
      { error: "Could not send your message right now. Please try again later." },
      { status: 500 }
    );
  }
}
