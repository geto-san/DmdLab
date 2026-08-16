import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Eye, Play } from "lucide-react";
import { formatDate, formatViews } from "@/lib/format";

type VideoCardProps = {
  id: string;
  title: string;
  thumbnail?: string | null;
  durationLabel?: string | null;
  views?: string;
  uploadDate?: string;
  category?: string;
};

export function VideoCard({
  id,
  title,
  thumbnail,
  durationLabel,
  views,
  uploadDate,
  category,
}: VideoCardProps) {
  return (
    <Link
      href={`/videos/${id}`}
      className="group flex flex-col gap-3 border-b border-line pb-8"
    >
      <div className="relative aspect-video overflow-hidden rounded-blob bg-surface">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-surface">
            <Play className="size-8 text-muted" />
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-bg/70 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <Play className="size-5 fill-current" />
          </span>
        </span>
        {durationLabel && (
          <span className="absolute bottom-3 right-3 rounded-md bg-ink/80 px-2 py-0.5 font-mono-x text-[0.6875rem] text-bg">
            {durationLabel}
          </span>
        )}
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between font-mono-x text-[0.6875rem] text-muted">
          <span className="text-accent2">{category || "Research"}</span>
          {views && (
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-3" />
              {formatViews(views)} views
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 font-display text-2xl leading-snug tracking-tight transition-colors group-hover:text-accent2">
          {title}
        </h3>
        <span className="mt-3 inline-flex items-center gap-1.5 font-mono-x text-ink transition-colors group-hover:text-accent2">
          Watch
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        {uploadDate && <span className="sr-only">{formatDate(uploadDate)}</span>}
      </div>
    </Link>
  );
}
