"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, ChevronDown, FileDown } from "lucide-react";

export type Publication = {
  year: number;
  title: string;
  slug: string;
  authors: string;
  journal: string;
  doi: string;
  citations: number;
  featured: boolean;
  abstract?: string;
};

function toBibTeX(pubs: Publication[]): string {
  const entries = pubs.map((p) => {
    const lines = [
      `  author = {${p.authors}},`,
      `  title = {${p.title}},`,
      `  journal = {${p.journal}},`,
      `  year = {${p.year}},`,
      `  doi = {${p.doi}}`,
    ];
    return `@article{${p.slug},\n${lines.join("\n")}\n}`;
  });
  return entries.join("\n\n") + "\n";
}

export function PublicationList({ publications }: Readonly<{ publications: Publication[] }>) {
  const [year, setYear] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const years = useMemo(
    () => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    [publications]
  );
  const visible = year === null ? publications : publications.filter((p) => p.year === year);

  function toggleAbstract(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function exportBibTeX() {
    download(toBibTeX(visible));
  }

  function download(text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `publications-${year ?? "all"}.bib`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setYear(null)}
            aria-pressed={year === null}
            className={`rounded-full border px-4 py-1.5 font-mono-x text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2 ${
              year === null
                ? "border-accent2/60 bg-accent2/10 text-accent2"
                : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            All
          </button>
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              aria-pressed={year === y}
              className={`rounded-full border px-4 py-1.5 font-mono-x text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2 ${
                year === y
                  ? "border-accent2/60 bg-accent2/10 text-accent2"
                  : "border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportBibTeX}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 font-mono-x text-xs text-ink transition-colors hover:border-accent2 hover:text-accent2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2"
        >
          <FileDown className="size-3.5" />
          Export BibTeX
        </button>
      </div>

      <ul className="divide-y divide-line">
        {visible.map((p) => {
          const isOpen = expanded.has(p.slug);
          return (
            <li key={p.slug}>
              <div className="grid gap-2 py-6 sm:grid-cols-[64px_1fr_auto] sm:gap-6">
                <span className="font-mono-x text-xs text-accent2">{p.year}</span>
                <span>
                  <a
                    href={`https://doi.org/${p.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-baseline gap-2 font-display text-xl leading-snug tracking-tight transition-colors hover:text-accent2 sm:text-2xl"
                  >
                    <BookOpen className="mb-0.5 size-3.5 shrink-0 text-muted" />
                    <span>
                      {p.title}
                      <ArrowUpRight className="ml-1 inline size-3" />
                    </span>
                  </a>
                  <span className="mt-1 block text-sm text-muted">
                    {p.journal} · {p.authors}
                  </span>
                  {isOpen && p.abstract && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{p.abstract}</p>
                  )}
                </span>
                <span className="flex items-center gap-3">
                  <span className="hidden font-mono-x text-xs text-muted sm:inline">
                    {p.citations} cites
                  </span>
                  {p.abstract && (
                    <button
                      type="button"
                      onClick={() => toggleAbstract(p.slug)}
                      aria-expanded={isOpen}
                      className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 font-mono-x text-[0.625rem] text-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2"
                    >
                      {isOpen ? "Hide abstract" : "Abstract"}
                      <ChevronDown className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}