"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export function VideoPlayer({ videoId, title }: Readonly<{ videoId: string; title: string }>) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-blob bg-surface">
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex size-full cursor-pointer items-center justify-center bg-gradient-to-b from-transparent via-transparent to-ink/40"
          aria-label={`Play ${title}`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 616px, 100vw"
            className="object-cover opacity-60"
          />
          <span className="relative flex size-20 items-center justify-center rounded-full bg-accent text-accent-ink transition-transform duration-300 group-hover:scale-110">
            <Play className="size-8 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
