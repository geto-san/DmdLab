import { describe, expect, it, vi } from "vitest";

vi.mock("@/db", () => ({ db: {} }));

import { mergeBlock } from "@/lib/content";

describe("mergeBlock", () => {
  it("returns fallback values when no payload is given", () => {
    const fallback = { title: "Hi", count: 2 };
    expect(mergeBlock(fallback)).toEqual({ title: "Hi", count: 2 });
  });

  it("overrides scalar top-level keys with payload values", () => {
    const merged = mergeBlock({ title: "Hi", n: 1 }, { title: "Bye" });
    expect(merged.title).toBe("Bye");
    expect(merged.n).toBe(1);
  });

  it("merges nested objects recursively", () => {
    const merged = mergeBlock(
      { cta: { label: "Go", to: "/a" }, other: true },
      { cta: { to: "/b" } }
    );
    expect(merged).toEqual({ cta: { label: "Go", to: "/b" }, other: true });
  });

  it("replaces arrays wholesale instead of merging", () => {
    const merged = mergeBlock({ items: [1, 2, 3] }, { items: ["x"] });
    expect(merged.items).toEqual(["x"]);
  });

  it("lets payload arrays overwrite object fallbacks and vice versa", () => {
    expect(mergeBlock({ v: { a: 1 } }, { v: [1] }).v).toEqual([1]);
    expect(mergeBlock({ v: [1] }, { v: { a: 1 } }).v).toEqual({ a: 1 });
  });

  it("does not mutate the fallback object", () => {
    const fallback = { nested: { keep: true } };
    mergeBlock(fallback, { nested: { keep: false } });
    expect(fallback.nested.keep).toBe(true);
  });

  it("treats null/undefined payload entries as overrides", () => {
    const merged = mergeBlock({ title: "Hi" }, { title: null });
    expect(merged.title).toBeNull();
  });

  it("handles empty payloads", () => {
    expect(mergeBlock({ a: 1 }, {})).toEqual({ a: 1 });
  });
});
