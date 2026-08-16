"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Login } from "./login";
import { Dashboard } from "./dashboard";

export function AdminPanel() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono-x text-muted">Checking session…</p>
      </section>
    );
  }

  if (!session?.user) {
    return <Login />;
  }

  const role = (session.user as { role?: string | null }).role;
  if (role !== "admin") {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-5">
        <div className="max-w-md rounded-blob border border-line bg-surface p-8 text-center">
          <h1 className="font-display text-2xl tracking-tight">Access denied</h1>
          <p className="mt-2 text-sm text-muted">
            Your account doesn&apos;t have admin privileges.
          </p>
        </div>
      </section>
    );
  }

  return (
    <Dashboard
      username={session.user.name || session.user.email || "Admin"}
      onLogout={async () => {
        await authClient.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
    />
  );
}
