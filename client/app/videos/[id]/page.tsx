import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchChannelVideos,
  fetchVideoById,
  getChannelUrl,
  parseDurationSeconds,
  type YouTubeVideo,
} from "@/lib/youtube";
import { WatchView } from "@/components/watch/watch-view";
import type { PlaylistEntry } from "@/components/watch/types";

export const revalidate = 300;

function toEntry(v: YouTubeVideo): PlaylistEntry {
  return {
    _id: v._id,
    title: v.title,
    description: v.description,
    thumbnail: v.thumbnail,
    author: v.author,
    uploadDate: v.uploadDate,
    category: v.category,
    views: v.views,
    likes: v.likes,
    durationLabel: v.durationLabel,
    durationSeconds: parseDurationSeconds(v.duration),
  };
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
  let error: string | null = null;
  try {
    video = await fetchVideoById(id);
  } catch (err) {
    error = (err as Error).message;
  }

  if (!video && !error) notFound();

  if (error || !video) {
    return (
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="rounded-blob border border-line bg-surface py-24 text-center">
          <p className="font-display text-3xl">Video unavailable</p>
          <p className="mt-3 text-sm text-muted">
            {error === "YOUTUBE_API_KEY not set"
              ? "The YouTube API key isn't configured."
              : "We couldn't reach YouTube right now."}
          </p>
        </div>
      </section>
    );
  }

  let entries: PlaylistEntry[] = [];
  try {
    entries = (await fetchChannelVideos()).map(toEntry);
  } catch {
    entries = [toEntry(video)];
  }

  if (!entries.some((e) => e._id === video._id)) {
    entries = [toEntry(video), ...entries];
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
      <WatchView
        video={toEntry(video)}
        entries={entries}
        channelUrl={getChannelUrl()}
        fromId={video._id}
        editableInfo
      />
    </section>
  );
}
