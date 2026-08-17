import { NextResponse } from "next/server";
import { listVideoCategories } from "@/lib/youtube-manage";
import { requireAdmin } from "@/app/api/admin/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const categories = await listVideoCategories();
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
