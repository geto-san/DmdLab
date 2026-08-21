"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { VideoSearchProvider } from "./search-context";
import { SearchBar } from "./search-bar";
import { PlayerProvider, type PlayerApi } from "./player-provider";
import { PlayerStage } from "./player-stage";
import { ControlsRow } from "./controls-row";
import { InfoBar } from "./info-bar";
import { ChannelRow } from "./channel-row";
import { UtilityRow } from "./utility-row";
import { CommentsSection } from "./comments";
import { PlaylistPanel } from "./playlist-panel";
import type { PlaylistEntry } from "./types";

type WatchViewProps = {
  initialVideoId: string;
  entries: PlaylistEntry[];
  channelUrl?: string | null;
  editableInfo?: boolean;
  header?: ReactNode;
  adminBar?: ReactNode;
};

function WatchShell({
  initialVideoId,
  entries,
  channelUrl,
  editableInfo = false,
  header,
  adminBar,
}: Readonly<WatchViewProps>) {
  const apiRef = useRef<PlayerApi | null>(null);
  const [activeId, setActiveId] = useState(initialVideoId);

  const activeIndex = Math.max(
    0,
    entries.findIndex((e) => e._id === activeId)
  );
  const active = entries[activeIndex] ?? entries[0];
  const previous = activeIndex > 0 ? entries[activeIndex - 1] : null;
  const next = activeIndex < entries.length - 1 ? entries[activeIndex + 1] : null;

  // Client-side swap: hot-load the video into the live player and sync the
  // URL without an RSC round-trip. Back/forward still soft-navigate; the
  // effect below reconciles the shell when that happens.
  const selectVideo = useCallback((id: string) => {
    if (id === activeId) return;
    apiRef.current?.load(id);
    setActiveId(id);
    window.history.pushState(history.state, "", `/videos/${id}`);
  }, [activeId]);

  useEffect(() => {
    if (initialVideoId !== activeId) {
      apiRef.current?.load(initialVideoId);
      setActiveId(initialVideoId);
    }
  }, [initialVideoId, activeId]);

  const durations = useMemo(
    () => Object.fromEntries(entries.map((e) => [e._id, e.durationSeconds ?? 0])),
    [entries]
  );

  if (!active) return null;

  return (
    <>
      {header}
      <div className="mb-8">
        <SearchBar />
      </div>
      {adminBar && <div className="mb-8">{adminBar}</div>}

      <PlayerProvider
        initialVideoId={active._id}
        durations={durations}
        apiRef={apiRef}
        onEnded={next ? () => selectVideo(next._id) : undefined}
      >
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:grid-rows-[auto_auto_1fr] xl:grid-cols-[minmax(0,1fr)_400px] lg:[grid-template-areas:'stage_playlist'_'channel_playlist'_'comments_playlist']">
          <section className="min-w-0 lg:[grid-area:stage]" aria-label="Video player">
            <div className="overflow-hidden rounded-blob border border-line bg-surface shadow-soft">
              <PlayerStage videoId={active._id} title={active.title} thumbnail={active.thumbnail} />
              <InfoBar video={active} editable={editableInfo} />
            </div>
            <ControlsRow
              onPrevious={previous ? () => selectVideo(previous._id) : undefined}
              onNext={next ? () => selectVideo(next._id) : undefined}
            />
          </section>

          <div className="min-w-0 lg:[grid-area:channel]">
            <ChannelRow video={active} videoCount={entries.length} channelUrl={channelUrl} />
          </div>

          <div className="flex min-w-0 flex-col gap-8 lg:[grid-area:comments]">
            <CommentsSection key={active._id} videoId={active._id} />
            <div className="hairline-t pt-6">
              <UtilityRow videoId={active._id} />
            </div>
          </div>

          <div className="min-w-0 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1 lg:[grid-area:playlist]">
            <PlaylistPanel
              entries={entries}
              activeId={active._id}
              onSelect={selectVideo}
              channelUrl={channelUrl}
            />
          </div>
        </div>
      </PlayerProvider>
    </>
  );
}

export function WatchView(props: Readonly<WatchViewProps>) {
  return (
    <VideoSearchProvider>
      <WatchShell {...props} />
    </VideoSearchProvider>
  );
}
