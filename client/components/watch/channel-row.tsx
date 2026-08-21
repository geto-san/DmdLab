"use client";

import type { PlaylistEntry } from "./types";

type ChannelRowProps = {
  video: PlaylistEntry;
  videoCount: number;
  channelUrl?: string | null;
};

export function ChannelRow({ video, videoCount, channelUrl }: Readonly<ChannelRowProps>) {
  const name = video.author?.trim() || "DM·Lab";
  const initial = name.charAt(0).toUpperCase();
  const href = channelUrl || "https://www.youtube.com";

  return (
    <div className="flex items-center gap-4">
      <div
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-display text-lg text-accent2"
      >
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{name}</p>
        <p className="mt-1 truncate font-mono-x text-muted">
          {video.category} · {videoCount} video{videoCount !== 1 ? "s" : ""}
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 rounded-full bg-ink px-5 py-2.5 font-mono-x text-[0.6875rem] text-bg transition-colors hover:bg-accent2 hover:text-accent2-ink sm:px-7"
      >
        <span className="sm:hidden">Sub</span>
        <span className="hidden sm:inline">Subscribe</span>
      </a>
    </div>
  );
}
