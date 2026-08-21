"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft, ArrowRight, Lock, Loader2, Moon, Sun } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { ErrorBanner } from "@/components/cms/editor-ui";

export function Login() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      if (signInError) {
        setError(signInError.message || "Sign-in failed.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="noise-overlay relative flex min-h-dvh flex-col bg-bg px-5 py-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full font-mono-x text-muted transition-colors hover:text-accent2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <ArrowLeft className="size-3.5" /> Back to site
        </Link>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          aria-label="Toggle theme"
        >
          {mounted && isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="font-display text-3xl tracking-tight">
              DM·Lab
            </Link>
            <p className="mt-2 font-mono-x text-muted">
              Deepminds Research Lab · MUST
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-blob border border-line bg-surface p-8 sm:p-10"
          >
            <span className="mb-6 flex size-12 items-center justify-center rounded-full bg-accent text-accent-ink">
              <Lock className="size-5" />
            </span>
            <h1 className="font-display text-3xl tracking-tight">Manage</h1>
            <p className="mt-2 text-sm text-muted">
              Sign in to edit articles, videos, team, and content blocks directly on the site.
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
                  className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2 focus-visible:ring-2 focus-visible:ring-accent2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
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
                  className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2 focus-visible:ring-2 focus-visible:ring-accent2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                />
              </label>
            </div>

            {error && (
              <div className="mt-4">
                <ErrorBanner message={error} />
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-mono-x text-accent-ink transition-all duration-300 hover:bg-accent2 hover:text-accent2-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {busy ? "Signing in…" : "Sign in"}
              {!busy && (
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
