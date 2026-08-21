"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type SearchState = {
  query: string;
  setQuery: (q: string) => void;
};

const SearchContext = createContext<SearchState | null>(null);

export function VideoSearchProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [query, setQuery] = useState("");
  const value = useMemo(() => ({ query, setQuery }), [query]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useVideoSearch(): SearchState {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useVideoSearch must be used within VideoSearchProvider");
  return ctx;
}
