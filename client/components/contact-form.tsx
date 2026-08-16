"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus({ ok: false, text: data.error || "Could not send your message." });
        return;
      }
      setStatus({ ok: true, text: "Thanks — your message has been sent." });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus({ ok: false, text: "Could not send your message. Try again later." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono-x text-xs text-muted">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent2"
            placeholder="Ada Lovelace"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono-x text-xs text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent2"
            placeholder="you@university.edu"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block font-mono-x text-xs text-muted">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="w-full resize-y rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent2"
          placeholder="Tell us about your collaboration idea…"
        />
      </label>
      <div>
        {status && (
          <p
            className={`rounded-xl border px-4 py-2.5 text-sm ${
              status.ok
                ? "border-accent/30 bg-accent/10 text-accent2"
                : "border-red-500/30 bg-red-500/10 text-red-500"
            }`}
          >
            {status.text}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={busy}
        className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono-x text-accent-ink transition-all duration-300 hover:bg-accent2 hover:text-accent2-ink disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send message"}
        {!busy && (
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </button>
    </form>
  );
}
