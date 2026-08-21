"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { VideoSearchProvider } from "./search-context";
import { SearchBar } from "./search-bar";
import { PlayerProvider } from "./player-provider";
import { PlayerStage } from "./player-stage";
import { ControlsRow } from "./controls-row";
import { InfoBar } from "./info-bar";
import { ChannelRow } from "./channel-row";
import { UtilityRow } from "./utility-row";
import { CommentsSection } from "./comments";
import { PlaylistPanel } from "./playlist-panel";
import type { PlaylistEntry } from "./types";

type WatchViewProps = {
  video: PlaylistEntry;
  entries: PlaylistEntry[];
  channelUrl?: string | null;
  fromId?: string | null;
  editableInfo?: boolean;
  header?: ReactNode;
  adminBar?: ReactNode;
};

export function WatchView({
  video,
  entries,
  channelUrl,
  fromId,
  editableInfo = false,
  header,
  adminBar,
}: Readonly<WatchViewProps>) {
  const router = useRouter();
  const index = entries.findIndex((e) => e._id === video._id);
  const previous = index > 0 ? entries[index - 1] : null;
  const next = index >= 0 && index < entries.length - 1 ? entries[index + 1] : null;

  return (
    <VideoSearchProvider>
      <PlayerProvider
        videoId={video._id}
        fallbackDuration={video.durationSeconds ?? 0}
        onEnded={next ? () => router.push(`/videos/${next._id}`) : undefined}
      >
        {header}
        <div className="mb-8">
          <SearchBar />
        </div>
        {adminBar && <div className="mb-8">{adminBar}</div>}

      <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:grid-rows-[auto_auto_1fr] xl:grid-cols-[minmax(0,1fr)_400px] lg:[grid-template-areas:'stage_playlist'_'channel_playlist'_'comments_playlist']">
        <section className="min-w-0 lg:[grid-area:stage]" aria-label="Video player">
          <div className="overflow-hidden rounded-blob border border-line bg-surface shadow-soft">
            <PlayerStage videoId={video._id} title={video.title} thumbnail={video.thumbnail} />
            <InfoBar video={video} editable={editableInfo} />
          </div>
          <ControlsRow
            onPrevious={previous ? () => router.push(`/videos/${previous._id}`) : undefined}
            onNext={next ? () => router.push(`/videos/${next._id}`) : undefined}
          />
        </section>

        <div className="min-w-0 lg:[grid-area:channel]">
          <ChannelRow video={video} videoCount={entries.length} channelUrl={channelUrl} />
        </div>

        <div className="flex min-w-0 flex-col gap-8 lg:[grid-area:comments]">
          <CommentsSection videoId={video._id} />
          <div className="hairline-t pt-6">
            <UtilityRow videoId={video._id} />
          </div>
        </div>

        <div className="min-w-0 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1 lg:[grid-area:playlist]">
          <PlaylistPanel
            entries={entries}
            activeId={video._id}
            fromId={fromId ?? (editableInfo ? video._id : null)}
            channelUrl={channelUrl}
          />
        </div>
      </div>
      </PlayerProvider>
    </VideoSearchProvider>
  );
}
