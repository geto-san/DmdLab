"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Heart, Loader2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";
import { Skeleton } from "@/components/skeleton";
import type { CommentRow } from "./types";

const LIKED_KEY = "dm:comment-likes";
const NAME_KEY = "dm:commenter-name";

function readLiked(): Record<string, true> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LIKED_KEY) ?? "{}") as Record<string, true>;
  } catch {
    return {};
  }
}

function writeLiked(liked: Record<string, true>) {
  try {
    window.localStorage.setItem(LIKED_KEY, JSON.stringify(liked));
  } catch {
    // Storage may be unavailable; likes are cosmetic.
  }
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
    </div>
  );
}

export function CommentsSection({ videoId }: Readonly<{ videoId: string }>) {
  const [comments, setComments] = useState<CommentRow[] | null>(null);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState<Record<string, true>>({});

  useEffect(() => {
    setName(window.localStorage.getItem(NAME_KEY) ?? "");
    setLiked(readLiked());
    let cancelled = false;
    fetch(`/api/videos/${videoId}/comments`)
      .then((res) => res.json())
      .then((data: { comments?: CommentRow[] }) => {
        if (!cancelled) setComments(data.comments ?? []);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, body }),
      });
      const data = (await res.json()) as { comment?: CommentRow; error?: string };
      if (!res.ok || !data.comment) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      window.localStorage.setItem(NAME_KEY, name.trim());
      setComments((prev) => [...(prev ?? []), data.comment as CommentRow]);
      setBody("");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleLike(key: string) {
    setLiked((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      writeLiked(next);
      return next;
    });
  }

  const canSubmit = name.trim().length >= 2 && body.trim().length >= 2 && !submitting;

  return (
    <section aria-label="Comments">
      <div className="mb-6 flex items-baseline gap-3">
        <h2 className="font-display text-2xl tracking-tight">Comments</h2>
        {comments && (
          <span className="font-mono-x text-muted">{String(comments.length).padStart(2, "0")}</span>
        )}
      </div>

      <form onSubmit={submit} className="mb-10 rounded-blob border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            aria-label="Your name"
            maxLength={60}
            className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent2 sm:w-48"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Join the discussion…"
            aria-label="Your comment"
            rows={2}
            maxLength={2000}
            className="w-full flex-1 resize-y rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent2"
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-red-500">{error}</p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-full border border-accent2/60 px-5 py-2 font-mono-x text-xs text-accent2 transition-colors hover:bg-accent2/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting && <Loader2 className="size-3 animate-spin" />}
            Comment
          </button>
        </div>
      </form>

      {comments === null ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted">No comments yet — start the discussion above.</p>
      ) : (
        <ul className="space-y-7">
          {comments.map((c) => {
            const key = String(c.id);
            return (
              <li key={c.id} className="flex items-start gap-3.5">
                <div
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-display text-sm text-accent2"
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-sm font-semibold text-ink">{c.name}</span>
                    <span className="font-mono-x text-[0.625rem] text-muted">
                      {formatRelativeTime(c.createdAt)}
                    </span>
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">{c.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleLike(key)}
                  aria-label={liked[key] ? "Unlike comment" : "Like comment"}
                  aria-pressed={Boolean(liked[key])}
                  className={`mt-1 shrink-0 transition-colors ${
                    liked[key] ? "text-accent2" : "text-muted hover:text-ink"
                  }`}
                >
                  <Heart className={`size-4 ${liked[key] ? "fill-current" : ""}`} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
