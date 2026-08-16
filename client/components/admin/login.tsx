"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/admin",
      });
      if (signInError) {
        setError(signInError.message || "Sign-in failed.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-blob border border-line bg-surface p-8 sm:p-10"
      >
        <span className="mb-6 flex size-12 items-center justify-center rounded-full bg-accent text-accent-ink">
          <Lock className="size-5" />
        </span>
        <h1 className="font-display text-3xl tracking-tight">Admin access</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to manage articles, announcements, members, and content blocks.
        </p>

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block font-mono-x text-xs text-muted">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono-x text-xs text-muted">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2"
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-mono-x text-accent-ink transition-all duration-300 hover:bg-accent2 hover:text-accent2-ink disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
          {!busy && (
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </button>
      </form>
    </section>
  );
}
