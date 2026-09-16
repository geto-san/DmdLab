import { describe, expect, it } from "vitest";
import { toSafeString } from "@/lib/to-string";

describe("toSafeString", () => {
  it("passes strings through unchanged", () => {
    expect(toSafeString("hi")).toBe("hi");
    expect(toSafeString("")).toBe("");
  });

  it("returns the fallback for null/undefined", () => {
    expect(toSafeString(null)).toBe("");
    expect(toSafeString(undefined)).toBe("");
    expect(toSafeString(null, "n/a")).toBe("n/a");
  });

  it("stringifies numbers and booleans", () => {
    expect(toSafeString(42)).toBe("42");
    expect(toSafeString(false)).toBe("false");
  });

  it("JSON-stringifies objects instead of [object Object]", () => {
    expect(toSafeString({ a: 1 })).toBe('{"a":1}');
    expect(toSafeString([1, 2])).toBe("[1,2]");
  });

  it("falls back on circular structures", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(toSafeString(circular, "safe")).toBe("safe");
  });
});
