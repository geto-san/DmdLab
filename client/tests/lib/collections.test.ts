import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { revalidatePath } from "next/cache";
import {
  normalizeContentPatch,
  pickEditable,
  revalidateForCollection,
} from "@/lib/collections";

beforeEach(() => {
  vi.mocked(revalidatePath).mockClear();
});

describe("pickEditable", () => {
  it("keeps whitelisted fields and drops everything else", () => {
    const picked = pickEditable("announcements", {
      title: "T",
      body: "B",
      id: 9,
      createdAt: "now",
      enabled: true,
    });
    expect(picked).toEqual({ title: "T", body: "B" });
  });

  it("maps the content alias to its own whitelist", () => {
    const picked = pickEditable("content", { key: "hero", payload: {}, section: "home" });
    expect(picked).toEqual({ key: "hero", payload: {}, section: "home" });
  });

  it("drops disallowed fields per collection (applications)", () => {
    const picked = pickEditable("applications", {
      name: "N",
      email: "e@d",
      reviewed: true,
      createdAt: "x",
    });
    expect(picked).toEqual({ name: "N", email: "e@d", reviewed: true });
  });

  it("returns an empty object for unknown collections", () => {
    expect(pickEditable("nope", { title: "T" })).toEqual({});
  });

  it("preserves explicitly undefined fields as absent", () => {
    expect(pickEditable("posts", { title: undefined, author: "A" })).toEqual({
      author: "A",
    });
  });
});

describe("normalizeContentPatch", () => {
  it("trims and lowercases a valid key", () => {
    const data: Record<string, unknown> = { key: "  HERO " };
    expect(normalizeContentPatch(data)).toBeNull();
    expect(data.key).toBe("hero");
  });

  it("rejects keys outside the allowed pattern", () => {
    expect(normalizeContentPatch({ key: "Bad Key!" })).toMatch(/lowercase alphanumeric/);
    expect(normalizeContentPatch({ key: "" })).toMatch(/lowercase alphanumeric/);
  });

  it("leaves absent fields untouched (partial update semantics)", () => {
    const data: Record<string, unknown> = { key: "hero" };
    expect(normalizeContentPatch(data)).toBeNull();
    expect(Object.keys(data)).toEqual(["key"]);
  });

  it("normalizes section, title and enabled when present", () => {
    const data: Record<string, unknown> = { section: "  ", title: 42, enabled: false };
    expect(normalizeContentPatch(data)).toBeNull();
    expect(data).toEqual({ section: "general", title: "42", enabled: false });
  });

  it("coerces any non-false enabled value to true", () => {
    const data: Record<string, unknown> = { enabled: 0 };
    normalizeContentPatch(data);
    expect(data.enabled).toBe(true);
  });

  it("replaces non-object payloads with an empty object", () => {
    const data: Record<string, unknown> = { payload: [1, 2] };
    expect(normalizeContentPatch(data)).toBeNull();
    expect(data.payload).toEqual({});

    const scalar: Record<string, unknown> = { payload: "nope" };
    normalizeContentPatch(scalar);
    expect(scalar.payload).toEqual({});
  });

  it("keeps valid object payloads by reference", () => {
    const payload = { a: 1 };
    const data: Record<string, unknown> = { payload };
    normalizeContentPatch(data);
    expect(data.payload).toBe(payload);
  });
});

describe("revalidateForCollection", () => {
  it("revalidates the home page for announcements", () => {
    revalidateForCollection("announcements");
    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/");
  });

  it("revalidates every content-driven page for content blocks", () => {
    revalidateForCollection("content");
    expect(vi.mocked(revalidatePath).mock.calls.map((c) => c[0])).toEqual([
      "/",
      "/research",
      "/research/[slug]",
      "/publications",
    ]);
  });

  it("revalidates the applications admin page", () => {
    revalidateForCollection("applications");
    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith("/manage/applications");
  });

  it("does nothing for collections without public readers", () => {
    revalidateForCollection("about");
    revalidateForCollection("posts");
    revalidateForCollection("videos");
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("ignores unknown collections", () => {
    revalidateForCollection("bogus");
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
