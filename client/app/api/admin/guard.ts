import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

// Returns a Response to short-circuit with, or null when an admin session is valid.
export async function requireAdmin(): Promise<Response | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
