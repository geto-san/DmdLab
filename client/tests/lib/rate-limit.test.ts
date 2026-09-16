import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

describe("isRateLimited", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows hits under the limit and blocks at the limit", () => {
    const key = "t1";
    for (let i = 0; i < 3; i++) {
      expect(isRateLimited(key, 3, 60_000)).toBe(false);
    }
    expect(isRateLimited(key, 3, 60_000)).toBe(true);
  });

  it("counts each call as a hit", () => {
    expect(isRateLimited("t2", 2, 60_000)).toBe(false);
    expect(isRateLimited("t2", 2, 60_000)).toBe(false);
    expect(isRateLimited("t2", 2, 60_000)).toBe(true);
  });

  it("separates buckets by key", () => {
    expect(isRateLimited("a", 1, 60_000)).toBe(false);
    expect(isRateLimited("a", 1, 60_000)).toBe(true);
    expect(isRateLimited("b", 1, 60_000)).toBe(false);
  });

  it("releases the bucket once the window has passed", () => {
    const key = "t4";
    expect(isRateLimited(key, 1, 10_000)).toBe(false);
    expect(isRateLimited(key, 1, 10_000)).toBe(true);

    vi.advanceTimersByTime(9_999);
    expect(isRateLimited(key, 1, 10_000)).toBe(true);

    vi.advanceTimersByTime(1);
    expect(isRateLimited(key, 1, 10_000)).toBe(false);
  });

  it("keeps only hits inside the sliding window", () => {
    const key = "t5";
    isRateLimited(key, 2, 10_000);
    vi.advanceTimersByTime(11_000);
    isRateLimited(key, 2, 10_000);
    expect(isRateLimited(key, 2, 10_000)).toBe(false);
  });
});

function reqWithHeaders(headers: Record<string, string>) {
  return new Request("https://example.com/api", { headers });
}

describe("clientIp", () => {
  it("prefers the first x-forwarded-for entry", () => {
    expect(
      clientIp(reqWithHeaders({ "x-forwarded-for": "203.0.113.7, 70.41.3.18" }))
    ).toBe("203.0.113.7");
  });

  it("trims whitespace around the forwarded entry", () => {
    expect(clientIp(reqWithHeaders({ "x-forwarded-for": " 198.51.100.9 , 10.0.0.1" }))).toBe(
      "198.51.100.9"
    );
  });

  it("falls back to x-real-ip", () => {
    expect(clientIp(reqWithHeaders({ "x-real-ip": "192.0.2.55" }))).toBe("192.0.2.55");
  });

  it("returns unknown when no proxy headers exist", () => {
    expect(clientIp(reqWithHeaders({}))).toBe("unknown");
  });
});
