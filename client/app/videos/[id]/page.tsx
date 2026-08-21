import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { fetchVideoById, fetchRelatedVideos, type RelatedVideo, type YouTubeVideo } from "@/lib/youtube";
import { VideoPlayer } from "@/components/video-player";
import { RelatedVideos } from "@/components/related-videos";
import { VideoDescription } from "@/components/video-description";
import { ShareButton } from "@/components/share-button";
import { VideoDetailEdit } from "@/components/cms/video-detail-edit";
import { Badge } from "@/components/ui";
import { formatRelativeTime } from "@/lib/format";

export const revalidate = 300;

function VideoUnavailable({ error }: Readonly<{ error: string }>) {
  return (
    <div className="rounded-blob border border-line bg-surface py-24 text-center">
      <p className="font-display text-3xl">Video unavailable</p>
      <p className="mt-3 text-sm text-muted">
        {error === "YOUTUBE_API_KEY not set"
          ? "The YouTube API key isn't configured."
          : "We couldn't reach YouTube right now."}
      </p>
    </div>
  );
}

function VideoDetailContent({
  video,
  related,
}: Readonly<{ video: YouTubeVideo; related: RelatedVideo[] }>) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
      <div>
        <VideoPlayer videoId={video._id} title={video.title} durationLabel={video.durationLabel} />
        <VideoDetailEdit video={{ _id: video._id, title: video.title }}>
          <div className="mt-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 font-mono-x text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" /> {formatRelativeTime(video.uploadDate)}
              </span>
              {video.durationLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {video.durationLabel}
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-5xl">
              {video.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Badge>{video.category}</Badge>
              <ShareButton />
            </div>
            {video.description && <VideoDescription text={video.description} />}
          </div>
        </VideoDetailEdit>
      </div>

      <aside>
        <h2 className="mb-4 font-mono-x text-muted">More {video.category} videos</h2>
        {related.length ? (
          <RelatedVideos fromId={video._id} items={related} />
        ) : (
          <p className="text-sm text-muted">No related videos yet.</p>
        )}
      </aside>
    </div>
  );
}

// Required (even empty) for ISR to apply to a dynamic segment at runtime —
// otherwise Next renders it fully dynamic despite `revalidate` being set.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>): Promise<Metadata> {
  const { id } = await params;
  const video = await fetchVideoById(id).catch(() => null);
  if (!video) return {};
  return {
    title: video.title,
    description: video.description?.slice(0, 300) || undefined,
    openGraph: {
      title: video.title,
      description: video.description?.slice(0, 300) || undefined,
      images: video.thumbnail ? [video.thumbnail] : undefined,
    },
  };
}

export default async function VideoDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  let video: YouTubeVideo | null = null;
  let related: RelatedVideo[] = [];
  let error: string | null = null;
  try {
    video = await fetchVideoById(id);
  } catch (err) {
    error = (err as Error).message;
  }

  if (!video && !error) notFound();
  if (video) {
    try {
      related = await fetchRelatedVideos(id);
    } catch {
      related = [];
    }
  }

  return (
    <article className="mx-auto max-w-5xl px-5 pt-32 sm:px-8 sm:pt-40">
      <Link
        href="/videos"
        className="mb-10 inline-flex items-center gap-2 font-mono-x text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" /> Back to library
      </Link>

      {error && <VideoUnavailable error={error} />}
      {!error && video && <VideoDetailContent video={video} related={related} />}
    </article>
  );
}
