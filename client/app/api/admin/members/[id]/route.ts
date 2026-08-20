import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { destroyImage } from "@/lib/cloudinary";
import { parseMemberForm, uploadMemberPhoto, revalidateMemberPaths } from "@/lib/members-form";
import { requireAdmin } from "../../guard";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const memberId = Number(id);
    if (!Number.isInteger(memberId)) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const form = await req.formData();
    const data = parseMemberForm(form);

    const file = form.get("photo");
    if (file && typeof file !== "string" && "arrayBuffer" in file) {
      const { error, data: img } = await uploadMemberPhoto(file as File);
      if (error) return NextResponse.json({ error }, { status: 400 });
      const [existing] = await db
        .select({ photoPublicId: members.photoPublicId })
        .from(members)
        .where(eq(members.id, memberId))
        .limit(1);
      await destroyImage(existing?.photoPublicId);
      Object.assign(data, img);
    }

    const [updated] = await db
      .update(members)
      .set(data as never)
      .where(eq(members.id, memberId))
      .returning();
    if (!updated) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    revalidateMemberPaths();
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update member", details: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const memberId = Number(id);
    if (!Number.isInteger(memberId)) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    const [removed] = await db
      .delete(members)
      .where(eq(members.id, memberId))
      .returning({ id: members.id, photoPublicId: members.photoPublicId });
    if (!removed) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    await destroyImage(removed.photoPublicId);
    revalidateMemberPaths();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete member", details: (err as Error).message },
      { status: 400 }
    );
  }
}
