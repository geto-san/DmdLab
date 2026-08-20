"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Inbox, Mail, Trash2 } from "lucide-react";
import { useEditMode } from "@/components/cms/edit-mode";
import { api } from "@/components/cms/api";

type Application = {
  id: number;
  name: string;
  email: string;
  message: string | null;
  reviewed: boolean;
  createdAt: string;
};

export default function ApplicationsPage() {
  const { isAdmin } = useEditMode();
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    api<Application[]>("/admin/applications")
      .then((rows) =>
        setApplications(
          [...rows].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      )
      .catch((err) => setError((err as Error).message));
  }, [isAdmin]);

  const setReviewed = async (id: number, value: boolean) => {
    setApplications((prev) =>
      prev ? prev.map((a) => (a.id === id ? { ...a, reviewed: value } : a)) : prev
    );
    try {
      await api(`/admin/applications/${id}`, {
        method: "PUT",
        body: JSON.stringify({ reviewed: value }),
      });
    } catch (err) {
      setError((err as Error).message);
      setApplications((prev) =>
        prev ? prev.map((a) => (a.id === id ? { ...a, reviewed: !value } : a)) : prev
      );
    }
  };

  const remove = async (id: number) => {
    const prevState = applications;
    setApplications((prev) => (prev ? prev.filter((a) => a.id !== id) : prev));
    try {
      await api(`/admin/applications/${id}`, { method: "DELETE" });
    } catch (err) {
      setError((err as Error).message);
      setApplications(prevState);
    }
  };

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-5 pt-32 text-center sm:pt-40">
        <p className="font-display text-2xl">Admins only</p>
        <p className="text-sm text-muted">Sign in to review team applications.</p>
        <Link
          href="/manage/login"
          className="font-mono-x text-accent2 transition-colors hover:opacity-80"
        >
          Sign in →
        </Link>
      </div>
    );
  }

  const pending = applications?.filter((a) => !a.reviewed) ?? [];
  const reviewed = applications?.filter((a) => a.reviewed) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
      <p className="mb-3 flex items-center gap-3 font-mono-x text-muted">
        <Inbox className="size-3.5 text-accent2" /> Applications
      </p>
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
        Join-the-team inbox
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        What applicants submit is shown as-is — mark an application reviewed once
        you&apos;ve followed up, or remove it.
      </p>

      {error && (
        <p className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
          {error}
        </p>
      )}

      {applications === null && !error && (
        <p className="mt-10 text-sm text-muted">Loading…</p>
      )}

      {applications !== null && applications.length === 0 && (
        <p className="mt-10 text-sm text-muted">No applications yet.</p>
      )}

      {pending.length > 0 && (
        <section className="mt-12">
          <p className="mb-4 font-mono-x text-xs text-muted">Pending · {pending.length}</p>
          <ApplicationList items={pending} onReview={setReviewed} onRemove={remove} />
        </section>
      )}

      {reviewed.length > 0 && (
        <section className="mt-12">
          <p className="mb-4 font-mono-x text-xs text-muted">Reviewed · {reviewed.length}</p>
          <ApplicationList items={reviewed} onReview={setReviewed} onRemove={remove} />
        </section>
      )}
    </div>
  );
}

function ApplicationList({
  items,
  onReview,
  onRemove,
}: Readonly<{
  items: Application[];
  onReview: (id: number, value: boolean) => void;
  onRemove: (id: number) => void;
}>) {
  return (
    <ul className="divide-y divide-line">
      {items.map((a) => (
        <li key={a.id} className="flex flex-wrap items-start justify-between gap-4 py-5">
          <div className="min-w-0">
            <p className="font-display text-lg">{a.name}</p>
            <a
              href={`mailto:${a.email}`}
              className="mt-0.5 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent2"
            >
              <Mail className="size-3.5" /> {a.email}
            </a>
            {a.message && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{a.message}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-mono-x text-[0.6875rem] text-muted">
              {new Date(a.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={() => onReview(a.id, !a.reviewed)}
              title={a.reviewed ? "Mark as pending" : "Mark as reviewed"}
              aria-label={a.reviewed ? "Mark as pending" : "Mark as reviewed"}
              className={`flex size-8 items-center justify-center rounded-full border transition-colors ${
                a.reviewed
                  ? "border-accent2 bg-accent2 text-accent2-ink"
                  : "border-line text-muted hover:border-accent2 hover:text-accent2"
              }`}
            >
              <Check className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(a.id)}
              title="Delete"
              aria-label="Delete application"
              className="flex size-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-red-500/50 hover:text-red-500"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
