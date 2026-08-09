import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

let apiPromise = null;
function loadYouTubeApi() {
  if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error('Failed to load the player library'));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

function parseIsoDuration(iso) {
  if (!iso) return 0;
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  return (+(m[1] || 0) * 3600) + (+(m[2] || 0) * 60) + +(m[3] || 0);
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const pad = n => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

const clamp = (min, max, v) => Math.min(max, Math.max(min, v));

const VideoPlayer = ({ videoId, title = '', thumbnail = '', durationIso = null }) => {
  const shellRef = useRef(null);
  const frameIdRef = useRef(`yt-frame-${Math.random().toString(36).slice(2)}`);
  const playerRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const bufferedRef = useRef(null);
  const timeRef = useRef(null);
  const playingRef = useRef(false);
  const seekingRef = useRef(false);
  const hideTimerRef = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    try { return localStorage.getItem('dl_muted') === '1'; } catch { return false; }
  });
  const [volume, setVolume] = useState(() => {
    try {
      const v = parseInt(localStorage.getItem('dl_volume') || '80', 10);
      return Number.isFinite(v) ? clamp(0, 100, v) : 80;
    } catch { return 80; }
  });
  const [rate, setRate] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const durationFallbackRef = useRef(parseIsoDuration(durationIso));

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playingRef.current) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 2500);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      showControls();
    } else {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      setControlsVisible(true);
    }
  }, [isPlaying, showControls]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p || typeof p.getPlayerState !== 'function') return;
    const state = p.getPlayerState();
    if (state === 1) p.pauseVideo();
    else p.playVideo();
  }, []);

  const seekToFraction = useCallback((frac) => {
    const p = playerRef.current;
    if (!p || typeof p.getDuration !== 'function') return;
    const dur = p.getDuration() || durationFallbackRef.current;
    if (dur > 0) p.seekTo(clamp(0, 1, frac) * dur, true);
  }, []);

  const seekBy = useCallback((delta) => {
    const p = playerRef.current;
    if (!p || typeof p.getCurrentTime !== 'function') return;
    const dur = p.getDuration() || durationFallbackRef.current;
    const target = clamp(0, dur, p.getCurrentTime() + delta);
    p.seekTo(target, true);
  }, []);

  const applyVolume = useCallback((v) => {
    const p = playerRef.current;
    if (p && typeof p.setVolume === 'function') p.setVolume(v);
  }, []);

  const setVolumePct = useCallback((v) => {
    const next = clamp(0, 100, Math.round(v));
    setVolume(next);
    applyVolume(next);
    try { localStorage.setItem('dl_volume', String(next)); } catch { /* ignore */ }
    if (next > 0 && isMuted) {
      const p = playerRef.current;
      if (p && typeof p.unMute === 'function') p.unMute();
      setIsMuted(false);
      try { localStorage.setItem('dl_muted', '0'); } catch { /* ignore */ }
    }
  }, [applyVolume, isMuted]);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (typeof p.isMuted === 'function' && p.isMuted()) {
      p.unMute();
      p.setVolume(volume || 80);
      setIsMuted(false);
      try { localStorage.setItem('dl_muted', '0'); } catch { /* ignore */ }
    } else {
      p.mute();
      setIsMuted(true);
      try { localStorage.setItem('dl_muted', '1'); } catch { /* ignore */ }
    }
  }, [volume]);

  const setRatePct = useCallback((r) => {
    setRate(r);
    setSpeedOpen(false);
    const p = playerRef.current;
    if (p && typeof p.setPlaybackRate === 'function') p.setPlaybackRate(r);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = shellRef.current;
    if (!el) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    } else if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (!playerRef.current) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekBy(10);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekBy(-10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolumePct(volume + 5);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolumePct(volume - 5);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, seekBy, setVolumePct, toggleMute, toggleFullscreen, volume]);

  // Create / tear down the underlying YouTube IFrame player.
  useEffect(() => {
    let disposed = false;
    setError(null);
    setHasStarted(false);
    setIsPlaying(false);
    setIsBuffering(false);
    setIsEnded(false);
    setControlsVisible(true);

    (async () => {
      try {
        const YT = await loadYouTubeApi();
        if (disposed) return;
        const player = new YT.Player(frameIdRef.current, {
          videoId,
          playerVars: {
            controls: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            disablekb: 1,
            playsinline: 1,
            fs: 0,
            origin: window.location.origin,
            enablejsapi: 1,
          },
          events: {
            onReady: () => {
              playerRef.current = player;
              player.setVolume(volume);
              if (isMuted) player.mute();
              const dur = player.getDuration() || durationFallbackRef.current;
              durationFallbackRef.current = dur;
              if (timeRef.current) timeRef.current.textContent = `0:00 / ${formatTime(dur)}`;
            },
            onStateChange: (e) => {
              switch (e.data) {
                case -1: // unstarted
                  setIsBuffering(false);
                  break;
                case 0: // ended
                  playingRef.current = false;
                  setIsPlaying(false);
                  setIsBuffering(false);
                  setIsEnded(true);
                  setControlsVisible(true);
                  break;
                case 1: // playing
                  playingRef.current = true;
                  setHasStarted(true);
                  setIsPlaying(true);
                  setIsBuffering(false);
                  break;
                case 2: // paused
                  playingRef.current = false;
                  setIsPlaying(false);
                  setIsBuffering(false);
                  break;
                case 3: // buffering
                  setIsBuffering(true);
                  break;
                case 5: // cued
                  setIsBuffering(false);
                  break;
                default:
                  break;
              }
            },
            onError: (e) => {
              if (!disposed) setError(`Playback unavailable (${e.data})`);
            },
          },
        });
      } catch (err) {
        if (!disposed) setError(err.message || 'Failed to initialize player');
      }
    })();

    const poll = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const dur = p.getDuration() || durationFallbackRef.current;
        if (dur) durationFallbackRef.current = dur;
        const loaded = typeof p.getVideoLoadedFraction === 'function' ? p.getVideoLoadedFraction() : 0;
        if (bufferedRef.current) bufferedRef.current.style.transform = `scaleX(${clamp(0, 1, loaded)})`;
        if (!seekingRef.current) {
          const t = p.getCurrentTime();
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${dur ? clamp(0, 1, t / dur) : 0})`;
          if (timeRef.current) timeRef.current.textContent = `${formatTime(t)} / ${formatTime(dur)}`;
        }
      } catch { /* player may be mid-teardown */ }
    }, 250);

    return () => {
      disposed = true;
      clearInterval(poll);
      playingRef.current = false;
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch { /* ignore */ }
      }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recreation is keyed by videoId/attempt
  }, [videoId, attempt]);

  // drag-to-seek on the progress track
  const handleTrackPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    seekingRef.current = true;
    const frac = fracFromEvent(e);
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${frac})`;
  };
  const handleTrackPointerMove = (e) => {
    if (!seekingRef.current) return;
    const frac = fracFromEvent(e);
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${frac})`;
    const p = playerRef.current;
    if (p && timeRef.current) {
      const dur = p.getDuration() || durationFallbackRef.current;
      timeRef.current.textContent = `${formatTime(frac * dur)} / ${formatTime(dur)}`;
    }
  };
  const handleTrackPointerUp = (e) => {
    if (!seekingRef.current) return;
    seekingRef.current = false;
    seekToFraction(fracFromEvent(e));
  };
  const fracFromEvent = (e) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return clamp(0, 1, (e.clientX - rect.left) / rect.width);
  };

  const replay = () => {
    const p = playerRef.current;
    if (!p) return;
    setHasStarted(true);
    setIsEnded(false);
    if (typeof p.seekTo === 'function') p.seekTo(0, true);
    p.playVideo();
  };

  const retry = () => {
    setAttempt(a => a + 1);
  };

  const showPoster = !hasStarted && !error;
  const showPauseOverlay = hasStarted && !isPlaying && !isBuffering && !isEnded && !error;

  return (
    <div
      ref={shellRef}
      onMouseMove={showControls}
      onTouchStart={showControls}
      onClick={() => { if (playingRef.current) setControlsVisible(v => !v); }}
      className="video-shell relative aspect-video w-full overflow-hidden bg-ink select-none"
    >
      <div id={frameIdRef.current} className="absolute inset-0" />

      {/* Pre-play poster — hides YouTube's paused frame & "Watch on YouTube" watermark */}
      {showPoster && (
        <div className="absolute inset-0 z-10">
          {thumbnail && (
            <img
              src={thumbnail}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-ink shadow-elevated backdrop-blur-sm transition-transform duration-300 hover:scale-105">
              <Play className="ml-1 h-8 w-8 fill-current" />
            </span>
          </button>
          {title && (
            <span className="absolute left-4 top-4 max-w-[70%] truncate rounded-lg bg-black/50 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
              {title}
            </span>
          )}
        </div>
      )}

      {/* Buffering spinner */}
      {isBuffering && !error && (
        <div className="absolute inset-0 z-[15] flex items-center justify-center bg-black/40">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}

      {/* Paused overlay */}
      {showPauseOverlay && (
        <div className="absolute inset-0 z-[15] flex items-center justify-center bg-black/30 pointer-events-none">
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Resume"
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-ink shadow-elevated transition-transform hover:scale-105"
          >
            <Play className="ml-0.5 h-7 w-7 fill-current" />
          </button>
        </div>
      )}

      {/* End screen */}
      {isEnded && !error && (
        <div className="absolute inset-0 z-[15] flex flex-col items-center justify-center gap-5 bg-black/75 text-white">
          <p className="text-lg font-bold">Playback finished</p>
          <button
            type="button"
            onClick={replay}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink transition-transform hover:scale-105"
          >
            <RotateCcw size={16} />
            Replay
          </button>
          <Link to="/videos" className="text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white">
            Browse all recordings
          </Link>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-bg-main p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-brand-amber" />
          <p className="text-sm font-bold text-text-main">This recording can't be played right now.</p>
          <p className="text-xs text-text-secondary">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="btn-primary mt-2 !px-5 !py-2.5"
          >
            Try again
          </button>
        </div>
      )}

      {/* Custom control bar */}
      <div
        onClick={e => e.stopPropagation()}
        className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-3.5 pt-16 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerUp}
          onPointerCancel={() => { seekingRef.current = false; }}
          className="group/track relative h-1.5 w-full cursor-pointer rounded-full bg-white/25 transition-colors hover:bg-white/30"
        >
          <div
            ref={bufferedRef}
            className="absolute inset-0 origin-left rounded-full bg-white/20"
            style={{ transform: 'scaleX(0)' }}
          />
          <div
            ref={progressRef}
            className="absolute inset-0 origin-left rounded-full bg-brand-primary"
            style={{ transform: 'scaleX(0)' }}
          />
          <div className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-soft transition-opacity group-hover/track:opacity-100" />
        </div>

        <div className="mt-2.5 flex items-center gap-3 text-white">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="rounded-full p-1.5 transition-colors hover:bg-white/15"
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="rounded-full p-1.5 transition-colors hover:bg-white/15"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={e => setVolumePct(e.target.value)}
            aria-label="Volume"
            className="w-24 cursor-pointer accent-brand-primary"
          />

          <span ref={timeRef} className="ml-1 font-mono text-[11px] font-semibold tabular-nums text-white/90">
            0:00 / 0:00
          </span>

          <div className="flex-1" />

          <div className="relative">
            <button
              type="button"
              onClick={() => setSpeedOpen(o => !o)}
              aria-label="Playback speed"
              className="rounded-full px-2 py-1 text-xs font-bold transition-colors hover:bg-white/15"
            >
              {rate}×
            </button>
            {speedOpen && (
              <div className="absolute bottom-full right-0 mb-2 overflow-hidden rounded-xl border border-white/10 bg-ink/95 shadow-elevated backdrop-blur-sm">
                {RATES.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRatePct(r)}
                    className={`block w-full px-4 py-1.5 text-left text-xs font-bold transition-colors ${
                      r === rate ? 'text-brand-primary' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {r}×
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="rounded-full p-1.5 transition-colors hover:bg-white/15"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
