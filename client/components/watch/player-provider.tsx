"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PROGRESS_EVENT, readProgress, saveProgress } from "./watch-progress";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setPlaybackRate: (rate: number) => void;
  loadModule: (name: string) => void;
  unloadModule: (name: string) => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    el: HTMLElement,
    options: {
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

function loadIframeApi(): Promise<YTNamespace> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= new Promise<YTNamespace>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT as YTNamespace);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

type PlayerContextValue = {
  phase: "idle" | "loading" | "ready";
  playing: boolean;
  currentTime: number;
  duration: number;
  scrubValue: number;
  scrubMax: number;
  volume: number;
  muted: boolean;
  rate: number;
  ccOn: boolean;
  speeds: typeof SPEEDS;
  containerRef: (node: HTMLDivElement | null) => void;
  start: (seekSeconds?: number) => void;
  toggle: () => void;
  seekFraction: (fraction: number) => void;
  changeVolume: (v: number) => void;
  toggleMute: () => void;
  setRate: (r: number) => void;
  toggleCc: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({
  videoId,
  fallbackDuration = 0,
  onEnded,
  children,
}: Readonly<{
  videoId: string;
  fallbackDuration?: number;
  onEnded?: () => void;
  children: ReactNode;
}>) {
  const [phase, setPhase] = useState<"idle" | "loading" | "ready">("idle");
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(fallbackDuration);
  const [restoredFrac, setRestoredFrac] = useState<number | null>(null);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [rate, setRateState] = useState(1);
  const [ccOn, setCcOn] = useState(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const ytRef = useRef<YTNamespace | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const lastSaveRef = useRef(0);
  const onEndedRef = useRef(onEnded);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => setContainer(node), []);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    setVolume(Number(window.localStorage.getItem("dm:vol") ?? 100));
    setMuted(window.localStorage.getItem("dm:muted") === "1");
    setCcOn(window.localStorage.getItem("dm:cc") === "1");
    setRestoredFrac(readProgress(videoId));
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
      hostRef.current?.remove();
      hostRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    if (!playerRef.current || phase !== "ready") return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const t = p.getCurrentTime();
      const d = p.getDuration();
      setCurrentTime(t);
      if (d > 0) setDuration(d);
      const now = Date.now();
      if (now - lastSaveRef.current > 5000 && d > 0) {
        lastSaveRef.current = now;
        saveProgress(videoId, t / d);
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [phase, videoId]);

  const start = useCallback(
    (seekSeconds?: number) => {
      if (playerRef.current || !container || phase === "loading") return;
      setPhase("loading");
      const mutedPref = window.localStorage.getItem("dm:muted") === "1";
      const volPref = Number(window.localStorage.getItem("dm:vol") ?? 100);
      const ccPref = window.localStorage.getItem("dm:cc") === "1";
      const restored =
        seekSeconds ?? (restoredFrac !== null && fallbackDuration > 5 ? restoredFrac * fallbackDuration : undefined);
      const startAt = restored && restored > 5 ? Math.floor(restored) : undefined;

      loadIframeApi()
        .then((YT) => {
          ytRef.current = YT;
          if (!container || playerRef.current) return;
          const host = document.createElement("div");
          container.appendChild(host);
          hostRef.current = host;
          host.className = "size-full [&_iframe]:size-full";
          playerRef.current = new YT.Player(host, {
            videoId,
            playerVars: {
              autoplay: 1,
              controls: 0,
              rel: 0,
              playsinline: 1,
              modestbranding: 1,
              iv_load_policy: 3,
              mute: mutedPref ? 1 : 0,
              cc_load_policy: ccPref ? 1 : 0,
              cc_lang_pref: "en",
              ...(startAt && startAt > 5 ? { start: Math.floor(startAt) } : {}),
            },
            events: {
              onReady: () => {
                setPhase("ready");
                const p = playerRef.current;
                if (!p) return;
                p.setVolume(mutedPref ? 0 : Math.min(100, Math.max(0, volPref)));
                p.playVideo();
                if (startAt && startAt > 5) setCurrentTime(startAt);
              },
              onStateChange: (e) => {
                const S = ytRef.current?.PlayerState;
                if (!S) return;
                if (e.data === S.PLAYING || e.data === S.BUFFERING) setPlaying(true);
                else if (e.data === S.PAUSED) setPlaying(false);
                else if (e.data === S.ENDED) {
                  setPlaying(false);
                  saveProgress(videoId, 1);
                  onEndedRef.current?.();
                }
              },
            },
          });
        })
        .catch(() => setPhase("idle"));
    },
    [container, fallbackDuration, phase, restoredFrac, videoId]
  );

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) {
      start();
      return;
    }
    if (playing) p.pauseVideo();
    else p.playVideo();
  }, [playing, start]);

  const seekFraction = useCallback(
    (fraction: number) => {
      const p = playerRef.current;
      const dur = duration || fallbackDuration;
      const target = fraction * dur;
      if (!p) {
        start(target);
        return;
      }
      p.seekTo(Math.min(Math.max(0, target), Math.max(0, dur - 1)), true);
      setCurrentTime(target);
    },
    [duration, fallbackDuration, start]
  );

  const changeVolume = useCallback(
    (v: number) => {
      const clamped = Math.min(100, Math.max(0, v));
      setVolume(clamped);
      const isMute = clamped === 0;
      setMuted(isMute);
      window.localStorage.setItem("dm:vol", String(clamped));
      window.localStorage.setItem("dm:muted", isMute ? "1" : "0");
      const p = playerRef.current;
      if (!p) return;
      p.setVolume(clamped);
      if (isMute) p.mute();
      else p.unMute();
    },
    []
  );

  const toggleMute = useCallback(() => changeVolume(volume === 0 ? 100 : 0), [changeVolume, volume]);

  const setRate = useCallback((r: number) => {
    setRateState(r);
    playerRef.current?.setPlaybackRate(r);
  }, []);

  const toggleCc = useCallback(() => {
    setCcOn((prev) => {
      const next = !prev;
      window.localStorage.setItem("dm:cc", next ? "1" : "0");
      const p = playerRef.current;
      if (p) {
        try {
          if (next) {
            p.loadModule("captions");
          } else {
            p.unloadModule("captions");
          }
        } catch {
          // Module control can fail pre-cue; preference still applies to next load.
        }
      }
      return next;
    });
  }, []);

  const scrubMax = duration || fallbackDuration || 0;
  const scrubValue = phase === "idle" ? (restoredFrac ?? 0) * scrubMax : currentTime;

  const value = useMemo<PlayerContextValue>(
    () => ({
      phase,
      playing,
      currentTime,
      duration: scrubMax,
      scrubValue,
      scrubMax,
      volume,
      muted,
      rate,
      ccOn,
      speeds: SPEEDS,
      containerRef,
      start,
      toggle,
      seekFraction,
      changeVolume,
      toggleMute,
      setRate,
      toggleCc,
    }),
    [
      phase,
      playing,
      currentTime,
      scrubMax,
      scrubValue,
      volume,
      muted,
      rate,
      ccOn,
      containerRef,
      start,
      toggle,
      seekFraction,
      changeVolume,
      toggleMute,
      setRate,
      toggleCc,
    ]
  );

  useEffect(() => {
    if (phase !== "idle") return;
    const handler = () => setRestoredFrac(readProgress(videoId));
    window.addEventListener(PROGRESS_EVENT, handler);
    return () => window.removeEventListener(PROGRESS_EVENT, handler);
  }, [phase, videoId]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
