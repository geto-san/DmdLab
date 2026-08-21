"use client";

import { Search, X } from "lucide-react";
import { useVideoSearch } from "./search-context";

export function SearchBar() {
  const { query, setQuery } = useVideoSearch();

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search videos…"
        aria-label="Search videos"
        className="w-full rounded-full border border-line bg-surface py-3.5 pl-6 pr-14 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent2 [&::-webkit-search-cancel-button]:hidden"
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
        >
          <X className="size-4" />
        </button>
      ) : (
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
          <Search className="size-4.5" />
        </span>
      )}
    </form>
  );
}
