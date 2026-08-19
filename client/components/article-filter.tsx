"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ARTICLE_CATEGORIES } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export function ArticleFilter() {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "all";

  return (
    <div className="flex flex-wrap gap-2">
      {["all", ...ARTICLE_CATEGORIES].map((cat) => {
        const href =
          cat === "all" ? "/articles" : `/articles?category=${encodeURIComponent(cat)}`;
        const isActive = active === cat;
        return (
          <Link
            key={cat}
            href={href}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono-x text-[0.6875rem] transition-all duration-300 ${
              isActive
                ? "bg-accent text-accent-ink"
                : "border border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {cat}
            {isActive && <ArrowUpRight className="size-3" />}
          </Link>
        );
      })}
    </div>
  );
}
