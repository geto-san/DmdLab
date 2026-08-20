"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.6c-2 1.5-4.6 2.5-7.6 2.5-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.6 5.6C41.6 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

export function JoinTeamForm({
  verifiedEmail,
  verifiedName,
  googleError,
}: Readonly<{
  verifiedEmail: string | null;
  verifiedName: string;
  googleError: boolean;
}>) {
  const [name, setName] = useState(verifiedName);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    googleError ? "Google verification didn't complete. Please try again." : null
  );
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-bg px-5 py-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent2 text-accent2-ink">
          <Check className="size-4" />
        </span>
        <div>
          <p className="font-display text-lg">Application received</p>
          <p className="mt-1 text-sm text-muted">
            Thanks for reaching out — we&apos;ll be in touch soon.
          </p>
        </div>
      </div>
    );
  }

  if (!verifiedEmail) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-muted">
          We ask you to verify your email with Google first, so we know it&apos;s really
          yours before it lands in our inbox.
        </p>
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
            {error}
          </p>
        )}
        <a
          href="/api/apply/google/start"
          className="inline-flex items-center gap-3 rounded-full border border-line bg-bg px-6 py-3 font-mono-x text-ink transition-colors hover:border-accent2 hover:text-accent2"
        >
          <GoogleIcon />
          Continue with Google
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl border border-line bg-bg px-4 py-3">
        <ShieldCheck className="size-4 shrink-0 text-accent2" />
        <div className="min-w-0">
          <p className="truncate text-sm">{verifiedEmail}</p>
          <p className="font-mono-x text-[0.6875rem] text-muted">Verified via Google</p>
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block font-mono-x text-xs text-muted">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2"
        />
      </label>
      <label className="block">
        <span className="mb-2 block font-mono-x text-xs text-muted">
          Why do you want to join the lab?
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="min-h-28 w-full resize-y rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2"
        />
      </label>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="group inline-flex items-center gap-2 rounded-full bg-accent2 px-6 py-3 font-mono-x text-accent2-ink transition-all duration-300 hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send application"}
        {!busy && (
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        )}
      </button>
    </form>
  );
}
