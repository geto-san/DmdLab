"use client";

import { Loader2, Pause, Play, Settings, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { formatTime, usePlayer } from "./player-provider";
import { PopoverMenu } from "./popover-menu";
import { Slider } from "./slider";

function ControlButton({
  onClick,
  label,
  disabled,
  children,
}: Readonly<{
  onClick: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:text-accent2 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-ink"
    >
      {children}
    </button>
  );
}

export function ControlsRow({
  onPrevious,
  onNext,
}: Readonly<{
  onPrevious?: () => void;
  onNext?: () => void;
}>) {
  const {
    phase,
    playing,
    scrubValue,
    scrubMax,
    volume,
    muted,
    rate,
    speeds,
    toggle,
    seekFraction,
    changeVolume,
    toggleMute,
    setRate,
  } = usePlayer();

  return (
    <div className="mt-5">
      <Slider
        value={scrubValue}
        max={scrubMax}
        onChange={(v) => seekFraction(scrubMax > 0 ? v / scrubMax : 0)}
        ariaLabel="Seek"
      />
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="font-mono-x tabular-nums text-muted">
          {formatTime(scrubValue)} / {formatTime(scrubMax)}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="mr-2 flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-muted transition-colors hover:text-ink"
            >
              {muted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <Slider
              value={muted ? 0 : volume}
              max={100}
              onChange={changeVolume}
              ariaLabel="Volume"
              className="w-20"
            />
          </span>

          <ControlButton onClick={onPrevious ?? (() => {})} label="Previous video" disabled={!onPrevious}>
            <SkipBack className="size-4.5 fill-current" />
          </ControlButton>

          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            title={playing ? "Pause" : "Play"}
            className="flex size-11 items-center justify-center rounded-full bg-ink text-bg transition-colors hover:bg-accent2 hover:text-accent2-ink"
          >
            {phase === "loading" ? (
              <Loader2 className="size-4.5 animate-spin" />
            ) : playing ? (
              <Pause className="size-4.5 fill-current" />
            ) : (
              <Play className="ml-0.5 size-4.5 fill-current" />
            )}
          </button>

          <ControlButton onClick={onNext ?? (() => {})} label="Next video" disabled={!onNext}>
            <SkipForward className="size-4.5 fill-current" />
          </ControlButton>

          <PopoverMenu
            trigger={<Settings className="size-4.5" />}
            triggerLabel="Playback settings"
            side="top"
            buttonClass="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:text-accent2"
            items={[
              ...speeds.map((s) => ({
                label: s === 1 ? "Normal speed" : `${s}×`,
                active: rate === s,
                onSelect: () => setRate(s),
              })),
            ]}
          />
        </div>
      </div>
    </div>
  );
}
