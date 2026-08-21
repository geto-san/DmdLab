export function formatDate(value: string | Date | undefined | null, opts?: Intl.DateTimeFormatOptions) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...opts,
  });
}

export function formatViews(value: string | number | undefined | null) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// Compact relative time ("3d ago", "2y ago") in the spirit of YouTube's
// upload-date labels, used where a full calendar date would be too heavy.
export function formatRelativeTime(value: string | Date | undefined | null) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  const units: [string, number][] = [
    ["y", 31536000],
    ["mo", 2592000],
    ["w", 604800],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of units) {
    const amount = Math.floor(seconds / secs);
    if (amount >= 1) return `${amount}${label} ago`;
  }
  return "just now";
}
