import { Eye, Play } from "lucide-react";
import { formatDate, formatViews } from "@/lib/format";
import { MediaCard } from "@/components/media-card";

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
    <MediaCard
      href={`/videos/${id}`}
      title={title}
      image={thumbnail}
      fallback={<Play className="size-8 text-muted" />}
      overlay={
        <>
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
        </>
      }
      eyebrow={category || "Research"}
      meta={
        views && (
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3" />
            {formatViews(views)} views
          </span>
        )
      }
      cta="Watch"
      srOnly={uploadDate && <span className="sr-only">{formatDate(uploadDate)}</span>}
    />
  );
}
