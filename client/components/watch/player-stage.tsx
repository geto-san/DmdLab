"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Play, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "./player-provider";
import { Slider } from "./slider";

type StageProps = {
  videoId: string;
  title: string;
  thumbnail?: string | null;
};

function PosterImage({ videoId, thumbnail }: StageProps) {
  const [srcIdx, setSrcIdx] = useState(0);
  const sources = thumbnail
    ? [thumbnail, `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`]
    : [`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`];
  const src = sources[Math.min(srcIdx, sources.length - 1)];

  return (
    <Image
      src={src}
      alt=""
      fill
      priority
      sizes="(min-width: 1280px) 820px, (min-width: 1024px) 60vw, 100vw"
      onError={() => setSrcIdx((i) => Math.min(i + 1, sources.length - 1))}
      className="object-cover opacity-90 transition-opacity duration-500"
    />
  );
}

export function PlayerStage(props: StageProps) {
  const {
    phase,
    playing,
    volume,
    muted,
    containerRef,
    start,
    toggle,
    changeVolume,
    toggleMute,
  } = usePlayer();
  const idle = phase === "idle";

  return (
    <div className="group/stage relative aspect-video w-full overflow-hidden bg-ink/[0.06]">
      <div ref={containerRef} className={`absolute inset-0 ${idle ? "invisible" : "visible"}`} />

      {idle && (
        <>
          <PosterImage {...props} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/40" aria-hidden />
          <button
            type="button"
            onClick={() => start()}
            aria-label={`Play ${props.title}`}
            className="absolute inset-0 flex cursor-pointer items-center justify-center"
          >
            <span className="flex size-16 items-center justify-center rounded-full border-2 border-bg/80 bg-bg/10 text-bg backdrop-blur-sm transition-all duration-300 group-hover/stage:scale-105 group-hover/stage:border-accent group-hover/stage:bg-accent group-hover/stage:text-accent-ink sm:size-20">
              <Play className="ml-1 size-7 fill-current sm:size-9" />
            </span>
          </button>
        </>
      )}

      {!idle && phase === "loading" && (
        <span className="absolute inset-0 flex items-center justify-center text-bg" aria-hidden>
          <Loader2 className="size-10 animate-spin" />
        </span>
      )}

      <div
        className={`absolute left-3 top-3 z-10 hidden items-center gap-2.5 rounded-full bg-ink/55 py-2 pl-3 pr-4 text-bg backdrop-blur-sm transition-opacity duration-300 lg:flex ${
          idle ? "opacity-100" : "opacity-0 focus-within:opacity-100 group-hover/stage:opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="transition-colors hover:text-accent"
        >
          {muted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
        <Slider
          value={muted ? 0 : volume}
          max={100}
          onChange={changeVolume}
          ariaLabel="Volume"
          fill="color-mix(in srgb, var(--bg) 92%, transparent)"
          track="color-mix(in srgb, var(--bg) 30%, transparent)"
          thumb="var(--bg)"
          className="w-16 sm:w-24"
        />
      </div>

      {!idle && !playing && phase === "ready" && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Play"
          className="absolute inset-0 z-[5] flex cursor-pointer items-center justify-center bg-ink/25"
        >
          <span className="flex size-16 items-center justify-center rounded-full border-2 border-bg/90 bg-bg/15 text-bg backdrop-blur-sm transition-transform duration-300 hover:scale-105 sm:size-18">
            <Play className="ml-1 size-7 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
