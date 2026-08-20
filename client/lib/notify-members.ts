import "server-only";

import { isNotNull, and, eq } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "@/db";
import { members } from "@/db/schema";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function siteUrl(path: string) {
  const base = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path}`;
}

// Fires on every article/research/publications create-or-update. Best-effort:
// a notification failure must never block the admin action that triggered it.
export async function notifyMembersOfUpdate(
  kind: "article" | "research" | "publications",
  title: string,
  path: string
) {
  if (!resend) return;

  try {
    const recipients = await db
      .select({ email: members.email })
      .from(members)
      .where(and(isNotNull(members.email), eq(members.alumni, false)));

    const emails = [...new Set(recipients.map((r) => r.email).filter((e): e is string => !!e))];
    if (emails.length === 0) return;

    const { subject, heading } = describeUpdate(kind, title);
    const url = siteUrl(path);

    await resend.emails.send({
      from: process.env.CONTACT_FROM || "onboarding@resend.dev",
      to: process.env.CONTACT_FROM || "onboarding@resend.dev",
      bcc: emails,
      subject,
      html: `
        <p>${heading}</p>
        <p><a href="${url}">${url}</a></p>
        <p style="color:#6b6a64;font-size:12px;margin-top:24px">
          You're receiving this because you're listed as an active DM·Lab member.
        </p>
      `,
    });
  } catch (err) {
    console.error("notifyMembersOfUpdate failed:", err);
  }
}

function describeUpdate(kind: "article" | "research" | "publications", title: string) {
  if (kind === "article") {
    return { subject: `New article: ${title}`, heading: `A new article was published: <strong>${title}</strong>` };
  }
  if (kind === "research") {
    return { subject: "Research page updated", heading: "The Research page has been updated." };
  }
  return { subject: "Publications updated", heading: "The Publications page has been updated." };
}
