// Simple in-memory sliding-window rate limiter for lightweight public
// write endpoints (per-IP). Best-effort by design: it protects against
// casual abuse on a single serverless instance but is not a durable quota.
const BUCKETS = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (BUCKETS.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    BUCKETS.set(key, hits);
    return true;
  }
  hits.push(now);
  BUCKETS.set(key, hits);
  // Opportunistic cleanup so abandoned buckets don't accumulate forever.
  if (BUCKETS.size > 5000) {
    for (const [k, times] of BUCKETS) {
      if (times.every((t) => now - t >= windowMs)) BUCKETS.delete(k);
    }
  }
  return false;
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
