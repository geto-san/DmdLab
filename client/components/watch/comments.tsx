"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";
import { Skeleton } from "@/components/skeleton";
import { authClient } from "@/lib/auth/client";
import type { CommentRow } from "./types";

const LIKED_KEY = "dm:comment-likes";
const NAME_KEY = "dm:commenter-name";
const PAGE_SIZE = 20;

type CommentsResponse = {
  comments?: CommentRow[];
  hasMore?: boolean;
  nextCursor?: number | null;
  error?: string;
};

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
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState<Record<string, true>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as { role?: string | null } | undefined)?.role === "admin";

  const loadPage = useCallback(
    async (before?: number) => {
      const beforeParam = before ? `&before=${before}` : "";
      const url = `/api/videos/${videoId}/comments?limit=${PAGE_SIZE}${beforeParam}`;
      const res = await fetch(url);
      const data = (await res.json()) as CommentsResponse;
      if (!res.ok) throw new Error(data.error || "Failed to load comments");
      return data;
    },
    [videoId]
  );

  useEffect(() => {
    setName(window.localStorage.getItem(NAME_KEY) ?? "");
    setLiked(readLiked());
    let cancelled = false;
    loadPage()
      .then((data) => {
        if (cancelled) return;
        setComments(data.comments ?? []);
        setHasMore(data.hasMore ?? false);
        setNextCursor(data.nextCursor ?? null);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });
    return () => {
      cancelled = true;
    };
  }, [loadPage]);

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
      setComments((prev) => [data.comment as CommentRow, ...(prev ?? [])]);
      setBody("");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function loadOlder() {
    if (!nextCursor) return;
    setLoadingMore(true);
    setError(null);
    try {
      const data = await loadPage(nextCursor);
      setComments((prev) => [...(prev ?? []), ...(data.comments ?? [])]);
      setHasMore(data.hasMore ?? false);
      setNextCursor(data.nextCursor ?? null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function removeComment(id: number) {
    if (!isAdmin) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/video-comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => (prev ?? []).filter((c) => c.id !== id));
      }
    } finally {
      setDeletingId(null);
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

  let commentsSection: ReactNode;
  if (comments === null) {
    commentsSection = (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  } else if (comments.length === 0) {
    commentsSection = <p className="text-sm text-muted">No comments yet — start the discussion above.</p>;
  } else {
    commentsSection = (
      <>
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
                <div className="flex shrink-0 items-center gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => removeComment(c.id)}
                      aria-label={`Delete comment by ${c.name}`}
                      title="Delete comment"
                      disabled={deletingId === c.id}
                      className="mt-1 text-muted transition-colors hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-40"
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleLike(key)}
                    aria-label={liked[key] ? "Unlike comment" : "Like comment"}
                    aria-pressed={Boolean(liked[key])}
                    className={`mt-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2 ${
                      liked[key] ? "text-accent2" : "text-muted hover:text-ink"
                    }`}
                  >
                    <Heart className={`size-4 ${liked[key] ? "fill-current" : ""}`} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {hasMore && (
          <button
            type="button"
            onClick={loadOlder}
            disabled={loadingMore}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2 font-mono-x text-xs text-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2 disabled:opacity-50"
          >
            {loadingMore && <Loader2 className="size-3 animate-spin" />}
            Load older comments
          </button>
        )}
      </>
    );
  }

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
            className="inline-flex items-center gap-2 rounded-full border border-accent2/60 px-5 py-2 font-mono-x text-xs text-accent2 transition-colors hover:bg-accent2/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting && <Loader2 className="size-3 animate-spin" />}
            Comment
          </button>
        </div>
      </form>

      {commentsSection}
    </section>
  );
}