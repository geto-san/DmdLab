"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { ALLOWED_EMAIL_DOMAINS, isAllowedApplicantEmail } from "@/lib/allowed-email-domains";

const DOMAIN_HINT = `Use a ${ALLOWED_EMAIL_DOMAINS.map((d) => `@${d}`).join(", ")} email address.`;

export function JoinTeamForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAllowedApplicantEmail(email)) {
      setError(DOMAIN_HINT);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
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
            Thanks for reaching out. We&apos;ll be in touch soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <span className="mb-2 block font-mono-x text-xs text-muted">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2"
        />
        <span className="mt-1.5 block text-xs text-muted">{DOMAIN_HINT}</span>
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
