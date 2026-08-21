const KEY_PREFIX = "dm:vp:";
export const PROGRESS_EVENT = "dm:vp-progress";

export function readProgress(videoId: string): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY_PREFIX + videoId);
  if (!raw) return null;
  const frac = Number(raw);
  return Number.isFinite(frac) && frac > 0.01 && frac < 0.95 ? frac : null;
}

export function saveProgress(videoId: string, fraction: number): void {
  if (typeof window === "undefined" || fraction <= 0) return;
  try {
    if (fraction >= 0.95) {
      window.localStorage.removeItem(KEY_PREFIX + videoId);
    } else {
      window.localStorage.setItem(KEY_PREFIX + videoId, String(fraction));
    }
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { videoId, fraction } }));
  } catch {
    // Private-mode storage failures are fine to ignore.
  }
}
