import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { parseMemberForm, uploadMemberPhoto, revalidateMemberPaths } from "@/lib/members-form";
import { requireAdmin } from "../guard";

export const dynamic = "force-dynamic";

export async function GET(_req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const rows = await db.select().from(members).orderBy(asc(members.id));
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const form = await req.formData();
    const data = parseMemberForm(form);

    const file = form.get("photo");
    if (file && typeof file !== "string" && "arrayBuffer" in file) {
      const { error, data: img } = await uploadMemberPhoto(file as File);
      if (error) return NextResponse.json({ error }, { status: 400 });
      Object.assign(data, img);
    }

    const [saved] = await db.insert(members).values(data as never).returning();
    revalidateMemberPaths();
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to add member", details: (err as Error).message },
      { status: 400 }
    );
  }
}
