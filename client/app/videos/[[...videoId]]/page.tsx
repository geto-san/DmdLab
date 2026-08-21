import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchChannelVideos, fetchVideoById, getChannelUrl, parseDurationSeconds, type YouTubeVideo } from "@/lib/youtube";
import { WatchView } from "@/components/watch/watch-view";
import type { PlaylistEntry } from "@/components/watch/types";
import { VideoAdminBar } from "@/components/cms/video-admin-bar";

export const dynamic = "force-dynamic";

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

function VideosUnavailable({ error }: Readonly<{ error: string }>) {
  return (
    <div className="rounded-blob border border-line bg-surface py-24 text-center">
      <p className="font-display text-3xl">Videos unavailable</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        {error === "YOUTUBE_API_KEY not set"
          ? "The YouTube API key isn't configured. Set YOUTUBE_API_KEY in your environment to enable the video library."
          : "We couldn't reach YouTube right now. Please try again shortly."}
      </p>
    </div>
  );
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ videoId?: string[] }>;
}>): Promise<Metadata> {
  const id = (await params).videoId?.[0];
  if (!id) return { title: "Videos" };
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

export default async function VideosPage({
  params,
}: Readonly<{
  params: Promise<{ videoId?: string[] }>;
}>) {
  const requestedId = (await params).videoId?.[0];

  let videos: YouTubeVideo[] = [];
  let error: string | null = null;

  try {
    videos = await fetchChannelVideos();
  } catch (err) {
    error = (err as Error).message;
  }

  if (error || videos.length === 0) {
    if (requestedId) notFound();
    return (
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        {error ? (
          <VideosUnavailable error={error} />
        ) : (
          <div className="rounded-blob border border-line bg-surface py-24 text-center">
            <p className="font-display text-3xl">No videos yet</p>
            <p className="mt-3 text-sm text-muted">
              Videos will appear here once the channel publishes content.
            </p>
          </div>
        )}
      </section>
    );
  }

  const entries = videos.map(toEntry);
  let current = requestedId ? entries.find((e) => e._id === requestedId) : entries[0];

  if (!current) {
    const direct = requestedId ? await fetchVideoById(requestedId).catch(() => null) : null;
    if (!direct) notFound();
    current = toEntry(direct);
    entries.unshift(current);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
      <WatchView
        initialVideoId={current._id}
        entries={entries}
        channelUrl={getChannelUrl()}
        editableInfo
        header={
          <p className="mb-6 flex items-center gap-3 font-mono-x text-muted">
            <span className="inline-block size-1.5 rounded-full bg-accent2" />
            Video Library · {entries.length} recording{entries.length !== 1 ? "s" : ""}
          </p>
        }
        adminBar={<VideoAdminBar />}
      />
    </section>
  );
}
