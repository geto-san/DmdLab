"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/format";

type RelatedItem = {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  author?: string;
  uploadDate: string;
  durationLabel?: string | null;
};

export function RelatedVideos({ fromId, items }: Readonly<{ fromId: string; items: RelatedItem[] }>) {
  const loggedRef = useRef(new Set<string>());

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>("[data-track-related]");
    const handler = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const toId = target.dataset.videoId;
      if (!toId || loggedRef.current.has(toId)) return;
      loggedRef.current.add(toId);
      fetch(`/api/videos/${fromId}/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toVideoId: toId }),
      }).catch(() => {});
    };
    links.forEach((l) => l.addEventListener("click", handler));
    return () => links.forEach((l) => l.removeEventListener("click", handler));
  }, [fromId]);

  return (
    <ul className="divide-y divide-line">
      {items.map((v) => (
        <li key={v._id}>
          <Link
            href={`/videos/${v._id}`}
            data-track-related
            data-video-id={v._id}
            className="group flex items-center gap-5 py-5"
          >
            <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-xl bg-surface sm:w-48">
              {v.thumbnail && (
                <Image
                  src={v.thumbnail}
                  alt=""
                  fill
                  sizes="192px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {v.durationLabel && (
                <span className="absolute bottom-1.5 right-1.5 rounded bg-ink/80 px-1.5 py-0.5 font-mono-x text-[0.625rem] text-bg">
                  {v.durationLabel}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono-x text-[0.6875rem] text-muted">
                {formatDate(v.uploadDate)}
              </p>
              <h3 className="mt-1 line-clamp-2 font-display text-lg leading-snug tracking-tight transition-colors group-hover:text-accent2 sm:text-xl">
                {v.title}
              </h3>
              {v.author && (
                <p className="mt-1 font-mono-x text-[0.6875rem] text-muted">{v.author}</p>
              )}
            </div>
            <ArrowUpRight className="size-5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
