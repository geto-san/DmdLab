"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, User } from "lucide-react";
import { formatViews, formatRelativeTime } from "@/lib/format";
import { EditItem } from "@/components/cms/edit-item";
import { useVideoSearch } from "./search-context";
import { PROGRESS_EVENT, readProgress } from "./watch-progress";
import type { PlaylistEntry } from "./types";

const tracked = new Set<string>();

function trackClick(fromId: string, toId: string) {
  if (tracked.has(toId)) return;
  tracked.add(toId);
  fetch(`/api/videos/${fromId}/click`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toVideoId: toId }),
  }).catch(() => {});
}

function PlaylistRow({
  entry,
  active,
  fromId,
}: Readonly<{ entry: PlaylistEntry; active: boolean; fromId?: string | null }>) {
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setProgress(readProgress(entry._id));
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [entry._id]);

  function handleClick() {
    if (fromId && !active) trackClick(fromId, entry._id);
  }

  return (
    <EditItem collection="video" item={{ _id: entry._id, title: entry.title }}>
      <Link
        href={`/videos/${entry._id}`}
        onClick={handleClick}
        aria-current={active ? "true" : undefined}
        className="group flex items-start gap-4 py-4"
      >
        <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-surface shadow-soft transition-shadow duration-300 group-hover:shadow-soft-lg sm:w-40">
          {entry.thumbnail ? (
            <Image
              src={entry.thumbnail}
              alt=""
              fill
              sizes="160px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="flex size-full items-center justify-center">
              <Play className="size-5 text-muted" />
            </span>
          )}
          {entry.durationLabel && (
            <span className="absolute right-1.5 top-1.5 rounded-md bg-ink/80 px-1.5 py-0.5 font-mono-x text-[0.625rem] text-bg">
              {entry.durationLabel}
            </span>
          )}
          {progress !== null && (
            <span className="absolute inset-x-1 bottom-1 h-[3px] overflow-hidden rounded-full bg-bg/50">
              <span
                className="block h-full rounded-full bg-accent"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`line-clamp-2 font-display text-base leading-snug tracking-tight transition-colors sm:text-lg ${
              active ? "text-accent2" : "group-hover:text-accent2"
            }`}
          >
            {entry.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-muted">
            {entry.category} · {formatRelativeTime(entry.uploadDate)}
          </p>
          <p className="mt-1.5 font-mono-x text-[0.625rem] leading-relaxed text-muted">
            {formatViews(entry.views)} views
            <br />
            {formatViews(entry.likes)} likes
          </p>
        </div>

        <span
          className={`mt-6 hidden size-8 shrink-0 items-center justify-center rounded-full border transition-colors sm:flex ${
            active
              ? "border-transparent bg-accent2 text-accent2-ink"
              : "border-line text-muted group-hover:border-accent2 group-hover:text-accent2"
          }`}
          aria-hidden
        >
          <Play className={`size-3 ${active ? "fill-current" : ""}`} />
        </span>
      </Link>
    </EditItem>
  );
}

export function PlaylistPanel({
  entries,
  activeId,
  fromId,
  channelUrl,
}: Readonly<{
  entries: PlaylistEntry[];
  activeId?: string;
  fromId?: string | null;
  channelUrl?: string | null;
}>) {
  const { query } = useVideoSearch();
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return entries;
    return entries.filter((e) =>
      `${e.title} ${e.description} ${e.category}`.toLowerCase().includes(q)
    );
  }, [entries, q]);

  return (
    <aside className="min-w-0 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:pr-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-xl tracking-tight">
          Playlist<span className="text-muted">:</span>{" "}
          <span className="font-mono-x text-xs text-muted">{filtered.length}</span>
        </h2>
        <a
          href={channelUrl || "https://www.youtube.com"}
          target="_blank"
          rel="noreferrer"
          aria-label="Channel profile"
          title="Channel profile"
          className="flex size-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2"
        >
          <User className="size-4" />
        </a>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">
          No videos match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <ul className="divide-y divide-line/60">
          {filtered.map((entry) => (
            <li key={entry._id}>
              <PlaylistRow entry={entry} active={entry._id === activeId} fromId={fromId} />
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
