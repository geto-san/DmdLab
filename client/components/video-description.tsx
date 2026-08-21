"use client";

import { useState } from "react";

export function VideoDescription({ text }: Readonly<{ text: string }>) {
  const [expanded, setExpanded] = useState(false);
  const trimmed = text.trim();

  if (!trimmed) return null;

  const paragraphs = trimmed.split(/\n\s*\n/).filter(Boolean);
  const isLong = trimmed.length > 240;

  return (
    <div className="prose-lab mt-6">
      {expanded ? (
        paragraphs.map((para, i) => <p key={i}>{para}</p>)
      ) : (
        <p className="line-clamp-3 whitespace-pre-line">{trimmed}</p>
      )}
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="font-mono-x text-xs text-accent2 transition-colors hover:text-ink"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
