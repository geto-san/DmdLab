"use client";

import Link from "next/link";
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";

const LENGTH_OPTIONS = [
  { value: "any", label: "Any length" },
  { value: "short", label: "Under 5 min" },
  { value: "medium", label: "5–20 min" },
  { value: "long", label: "Over 20 min" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title A–Z" },
];

function buildHref(current: ReadonlyURLSearchParams, key: string, value: string) {
  const params = new URLSearchParams(current.toString());
  if (value === "all" || value === "any" || value === "newest") {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/videos?${qs}` : "/videos";
}

function ChipGroup({
  label,
  options,
  paramKey,
  active,
  searchParams,
}: Readonly<{
  label: string;
  options: { value: string; label: string }[];
  paramKey: string;
  active: string;
  searchParams: ReadonlyURLSearchParams;
}>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono-x text-[0.6875rem] text-muted">{label}</span>
      {options.map((opt) => {
        const isActive = active === opt.value;
        return (
          <Link
            key={opt.value}
            href={buildHref(searchParams, paramKey, opt.value)}
            aria-current={isActive ? "true" : undefined}
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 font-mono-x text-[0.6875rem] transition-all duration-300 ${
              isActive
                ? "bg-accent text-accent-ink"
                : "border border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}

export function VideoFilters({ topics }: Readonly<{ topics: string[] }>) {
  const searchParams = useSearchParams();
  const activeTopic = searchParams.get("topic") || "all";
  const activeLength = searchParams.get("length") || "any";
  const activeSort = searchParams.get("sort") || "newest";

  const topicOptions = [{ value: "all", label: "All" }, ...topics.map((t) => ({ value: t, label: t }))];

  return (
    <div className="mb-10 flex flex-col gap-4 rounded-blob border border-line bg-surface p-5 sm:p-6">
      <ChipGroup
        label="Topic"
        options={topicOptions}
        paramKey="topic"
        active={activeTopic}
        searchParams={searchParams}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
        <ChipGroup
          label="Length"
          options={LENGTH_OPTIONS}
          paramKey="length"
          active={activeLength}
          searchParams={searchParams}
        />
        <ChipGroup
          label="Sort"
          options={SORT_OPTIONS}
          paramKey="sort"
          active={activeSort}
          searchParams={searchParams}
        />
      </div>
    </div>
  );
}
