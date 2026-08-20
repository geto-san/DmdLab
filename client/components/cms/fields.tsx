"use client";

import type { ReactNode } from "react";

export type FieldType = "text" | "textarea" | "json" | "tags" | "checkbox";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
  required?: boolean;
};

export const COLLECTION_FIELDS: Record<string, FieldDef[]> = {
  announcements: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "body", label: "Body", type: "textarea" },
  ],
  posts: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "author", label: "Author", type: "text" },
    { name: "content", label: "Content", type: "textarea" },
    { name: "tags", label: "Tags", type: "tags" },
  ],
  about: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "content", label: "Content", type: "textarea", required: true },
  ],
};

export function FieldInput({
  def,
  value,
  onChange,
}: Readonly<{
  def: FieldDef;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
}>) {
  if (def.type === "textarea" || def.type === "json") {
    return (
      <textarea
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        required={def.required}
        spellCheck={def.type !== "json"}
        className={`min-h-28 w-full resize-y rounded-xl border border-line bg-bg px-4 py-3 font-mono-x text-xs outline-none transition-colors focus:border-accent2 ${
          def.type === "json" ? "min-h-56 whitespace-pre" : ""
        }`}
      />
    );
  }
  if (def.type === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={value === true}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[var(--accent)]"
      />
    );
  }
  return (
    <input
      type="text"
      value={String(value)}
      onChange={(e) => onChange(e.target.value)}
      required={def.required}
      className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2"
    />
  );
}

export function FieldLabel({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="mb-2 block font-mono-x text-xs text-muted">{children}</span>;
}
