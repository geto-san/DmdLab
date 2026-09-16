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
  loadVideoById: (args: string | { videoId: string; startSeconds?: number; endSeconds?: number }) => void;
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

export type PlayerApi = { load: (videoId: string) => void };

type PlayerContextValue = {
  videoId: string;
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
  isFullscreen: boolean;
  speeds: typeof SPEEDS;
  containerRef: (node: HTMLDivElement | null) => void;
  registerFullscreenTarget: (el: HTMLDivElement | null) => void;
  start: (seekSeconds?: number) => void;
  toggle: () => void;
  seekFraction: (fraction: number) => void;
  changeVolume: (v: number) => void;
  toggleMute: () => void;
  setRate: (r: number) => void;
  toggleCc: () => void;
  toggleFullscreen: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({
  initialVideoId,
  durations = {},
  onEnded,
  apiRef,
  children,
}: Readonly<{
  initialVideoId: string;
  durations?: Record<string, number>;
  onEnded?: () => void;
  apiRef?: { current: PlayerApi | null };
  children: ReactNode;
}>) {
  const [videoId, setVideoId] = useState(initialVideoId);
  const [phase, setPhase] = useState<"idle" | "loading" | "ready">("idle");
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [restoredFrac, setRestoredFrac] = useState<number | null>(null);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [rate, setRateState] = useState(1);
  const [ccOn, setCcOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const playerRef = useRef<YTPlayer | null>(null);
  const ytRef = useRef<YTNamespace | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const videoIdRef = useRef(videoId);
  const pendingLoadRef = useRef<string | null>(null);
  const lastSaveRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastDurationRef = useRef(0);
  const volumeRef = useRef(volume);
  const fullscreenTargetRef = useRef<HTMLDivElement | null>(null);
  const onEndedRef = useRef(onEnded);
  const containerRefNode = useRef<HTMLDivElement | null>(null);

  const announce = useCallback((msg: string) => setAnnouncement(msg), []);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    containerRefNode.current = node;
  }, []);

  const registerFullscreenTarget = useCallback((el: HTMLDivElement | null) => {
    fullscreenTargetRef.current = el;
  }, []);

  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    setVolume(Number(window.localStorage.getItem("dm:vol") ?? 100));
    setMuted(window.localStorage.getItem("dm:muted") === "1");
    setCcOn(window.localStorage.getItem("dm:cc") === "1");
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
      hostRef.current?.remove();
      hostRef.current = null;
    };
  }, []);

  useEffect(() => {
    videoIdRef.current = videoId;
    setRestoredFrac(readProgress(videoId));
    setCurrentTime(0);
  }, [videoId]);

  useEffect(() => {
    if (phase !== "ready") return;
    lastTimeRef.current = 0;
    lastDurationRef.current = 0;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const t = p.getCurrentTime();
      const d = p.getDuration();
      if (Math.abs(t - lastTimeRef.current) >= 0.2) {
        lastTimeRef.current = t;
        setCurrentTime(t);
      }
      if (d > 0 && d !== lastDurationRef.current) {
        lastDurationRef.current = d;
        setDuration(d);
      }
      const now = Date.now();
      if (now - lastSaveRef.current > 5000 && d > 0) {
        lastSaveRef.current = now;
        saveProgress(videoIdRef.current, t / d);
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      announce("Fullscreen off");
    } else {
      fullscreenTargetRef.current?.requestFullscreen().catch(() => {});
      announce("Fullscreen on");
    }
  }, [announce]);

  // Plays back the visual state to assistive tech. The ticker updates
  // currentTime up to 2x/sec while playing, so state changes here are
  // announced rather than bound to every tick.
  const prevPlayingRef = useRef(playing);
  useEffect(() => {
    if (playing === prevPlayingRef.current) return;
    prevPlayingRef.current = playing;
    announce(playing ? "Playing" : "Paused");
  }, [playing, announce]);

  const seekBy = useCallback(
    (deltaSeconds: number) => {
      const p = playerRef.current;
      if (!p) return;
      const d = p.getDuration();
      const target = Math.min(Math.max(0, p.getCurrentTime() + deltaSeconds), Math.max(0, d - 0.1));
      p.seekTo(target, true);
      setCurrentTime(target);
      announce(`Seeked to ${formatTime(target)}`);
    },
    [announce]
  );

  const start = useCallback(
    (seekSeconds?: number) => {
      const container = containerRefNode.current;
      if (playerRef.current || !container || phase === "loading") return;
      setPhase("loading");
      const mutedPref = window.localStorage.getItem("dm:muted") === "1";
      const volPref = Number(window.localStorage.getItem("dm:vol") ?? 100);
      const ccPref = window.localStorage.getItem("dm:cc") === "1";
      const fallbackDur = durations[videoIdRef.current] ?? 0;
      const frac = restoredFrac;
      const restored =
        seekSeconds ?? (frac !== null && fallbackDur > 5 ? frac * fallbackDur : undefined);
      const startAt = restored && restored > 5 ? Math.floor(restored) : undefined;

      loadIframeApi()
        .then((YT) => {
          ytRef.current = YT;
          const host = document.createElement("div");
          host.className = "size-full [&_iframe]:size-full";
          container.appendChild(host);
          hostRef.current = host;
          playerRef.current = new YT.Player(host, {
            videoId: videoIdRef.current,
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
              ...(startAt ? { start: startAt } : {}),
            },
            events: {
              onReady: () => {
                setPhase("ready");
                const p = playerRef.current;
                if (!p) return;
                p.setVolume(mutedPref ? 0 : Math.min(100, Math.max(0, volPref)));
                if (pendingLoadRef.current) {
                  const id = pendingLoadRef.current;
                  pendingLoadRef.current = null;
                  const frac = readProgress(id);
                  const dur = durations[id] ?? 0;
                  const startAt = frac && dur > 5 ? Math.floor(frac * dur) : 0;
                  if (startAt > 5) {
                    setCurrentTime(startAt);
                    p.loadVideoById({ videoId: id, startSeconds: startAt });
                  } else {
                    p.loadVideoById(id);
                  }
                  return;
                }
                p.playVideo();
                if (startAt) setCurrentTime(startAt);
              },
              onStateChange: (e) => {
                const S = ytRef.current?.PlayerState;
                if (!S) return;
                if (e.data === S.PLAYING || e.data === S.BUFFERING) setPlaying(true);
                else if (e.data === S.PAUSED) setPlaying(false);
                else if (e.data === S.ENDED) {
                  setPlaying(false);
                  saveProgress(videoIdRef.current, 1);
                  onEndedRef.current?.();
                }
              },
            },
          });
        })
        .catch(() => setPhase("idle"));
    },
    [durations, phase, restoredFrac]
  );

  const load = useCallback((nextId: string) => {
    if (nextId === videoIdRef.current) return;

    // Save current progress before switching
    const p = playerRef.current;
    if (p && phaseRef.current === "ready") {
      const t = p.getCurrentTime();
      const d = p.getDuration();
      if (d > 0) saveProgress(videoIdRef.current, t / d);
    }

    videoIdRef.current = nextId;
    lastSaveRef.current = Date.now();
    setVideoId(nextId);

    if (!p) {
      if (phaseRef.current === "loading") pendingLoadRef.current = nextId;
      return;
    }

    setPlaying(true);
    setCurrentTime(0);
    setDuration(0);

    const frac = readProgress(nextId);
    const dur = durations[nextId] ?? 0;
    const startAt = frac && dur > 5 ? Math.floor(frac * dur) : 0;

    if (startAt > 5) {
      setCurrentTime(startAt);
      p.loadVideoById({ videoId: nextId, startSeconds: startAt });
    } else {
      p.loadVideoById(nextId);
    }
  }, [durations]);

  useEffect(() => {
    if (apiRef) apiRef.current = { load };
    return () => {
      if (apiRef) apiRef.current = null;
    };
  }, [apiRef, load]);

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
      const dur = duration || durations[videoIdRef.current] || 0;
      const target = fraction * dur;
      if (!p) {
        start(target);
        return;
      }
      p.seekTo(Math.min(Math.max(0, target), Math.max(0, dur - 1)), true);
      setCurrentTime(target);
      announce(`Seeked to ${formatTime(target)}`);
    },
    [duration, durations, start, announce]
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
      announce(isMute ? "Muted" : `Volume ${clamped}%`);
    },
    [announce]
  );

  const toggleMute = useCallback(() => changeVolume(volume === 0 ? 100 : 0), [changeVolume, volume]);

  const setRate = useCallback(
    (r: number) => {
      setRateState(r);
      playerRef.current?.setPlaybackRate(r);
      announce(r === 1 ? "Normal speed" : `Playback speed ${r}×`);
    },
    [announce]
  );

  const toggleCc = useCallback(() => {
    setCcOn((prev) => {
      const next = !prev;
      window.localStorage.setItem("dm:cc", next ? "1" : "0");
      const p = playerRef.current;
      if (p) {
        try {
          if (next) p.loadModule("captions");
          else p.unloadModule("captions");
        } catch {
          // Module control can fail pre-cue; preference still applies to next load.
        }
      }
      announce(next ? "Captions on" : "Captions off");
      return next;
    });
  }, [announce]);

  // Keyboard shortcuts (YouTube-style): Space/K play-pause, J/L ±10s,
  // M mute, F fullscreen, ↑/↓ volume, Home/End seek. Ignored while the
  // focus is inside a form field or a button is already handling Space.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const inField =
        !!el && el.closest("input, textarea, select, [contenteditable='true']") !== null;
      const onButton = !!el && el.tagName === "BUTTON";
      switch (e.key) {
        case " ":
          if (inField || onButton) return;
          e.preventDefault();
          toggle();
          break;
        case "k":
        case "K":
          if (inField) return;
          toggle();
          break;
        case "j":
        case "J":
          if (inField) return;
          seekBy(-10);
          break;
        case "l":
        case "L":
          if (inField) return;
          seekBy(10);
          break;
        case "m":
        case "M":
          if (inField) return;
          toggleMute();
          break;
        case "f":
        case "F":
          if (inField) return;
          toggleFullscreen();
          break;
        case "ArrowUp":
        case "ArrowDown":
          if (inField) return;
          e.preventDefault();
          changeVolume(volumeRef.current + (e.key === "ArrowUp" ? 5 : -5));
          break;
        case "Home":
        case "End":
          if (inField) return;
          e.preventDefault();
          seekFraction(e.key === "Home" ? 0 : 1);
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle, toggleMute, toggleFullscreen, seekFraction, changeVolume, seekBy]);

  const fallbackForCurrent = durations[videoId] ?? 0;
  const scrubMax = duration || fallbackForCurrent;
  const scrubValue = phase === "idle" ? (restoredFrac ?? 0) * fallbackForCurrent : currentTime;

  const value = useMemo<PlayerContextValue>(
    () => ({
      videoId,
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
      isFullscreen,
      speeds: SPEEDS,
      containerRef,
      registerFullscreenTarget,
      start,
      toggle,
      seekFraction,
      changeVolume,
      toggleMute,
      setRate,
      toggleCc,
      toggleFullscreen,
    }),
    [
      videoId,
      phase,
      playing,
      currentTime,
      scrubMax,
      scrubValue,
      volume,
      muted,
      rate,
      ccOn,
      isFullscreen,
      containerRef,
      registerFullscreenTarget,
      start,
      toggle,
      seekFraction,
      changeVolume,
      toggleMute,
      setRate,
      toggleCc,
      toggleFullscreen,
    ]
  );

  useEffect(() => {
    if (phase !== "idle") return;
    const handler = () => setRestoredFrac(readProgress(videoIdRef.current));
    window.addEventListener(PROGRESS_EVENT, handler);
    return () => window.removeEventListener(PROGRESS_EVENT, handler);
  }, [phase]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* Live region from here announces play state, seeks, and volume without
          forcing every tick to re-render the whole watch tree. */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
