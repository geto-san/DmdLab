import { fetchChannelVideos, parseDurationSeconds, type YouTubeVideo } from "@/lib/youtube";
import { VideoCard } from "@/components/video-card";
import { VideoFilters } from "@/components/video-filters";
import { VideoAdminBar } from "@/components/cms/video-admin-bar";
import { EditItem } from "@/components/cms/edit-item";

export const dynamic = "force-dynamic";

type SearchParams = { topic?: string; length?: string; sort?: string };

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

function VideoGrid({
  videos,
  filtered,
}: Readonly<{ videos: YouTubeVideo[]; filtered: boolean }>) {
  if (!videos.length) {
    return (
      <div className="rounded-blob border border-line bg-surface py-24 text-center">
        <p className="font-display text-3xl">{filtered ? "No matches" : "No videos yet"}</p>
        <p className="mt-3 text-sm text-muted">
          {filtered
            ? "No videos match these filters — try widening your search."
            : "Videos will appear here once the channel publishes content."}
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <EditItem
          key={v._id}
          collection="video"
          item={{ _id: v._id, title: v.title, description: v.description }}
        >
          <VideoCard
            id={v._id}
            title={v.title}
            thumbnail={v.thumbnail}
            durationLabel={v.durationLabel}
            views={v.views}
            uploadDate={v.uploadDate}
            category={v.category}
          />
        </EditItem>
      ))}
    </div>
  );
}

function applyFilters(videos: YouTubeVideo[], { topic, length, sort }: SearchParams) {
  let list = videos;

  if (topic && topic !== "all") {
    list = list.filter((v) => v.category === topic);
  }

  if (length && length !== "any") {
    list = list.filter((v) => {
      const secs = parseDurationSeconds(v.duration);
      if (length === "short") return secs > 0 && secs < 300;
      if (length === "medium") return secs >= 300 && secs <= 1200;
      if (length === "long") return secs > 1200;
      return true;
    });
  }

  list = [...list];
  if (sort === "oldest") {
    list.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
  } else if (sort === "title") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    list.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }

  return list;
}

export default async function VideosPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<SearchParams>;
}>) {
  const params = await searchParams;

  let videos: YouTubeVideo[] = [];
  let error: string | null = null;

  try {
    videos = await fetchChannelVideos();
  } catch (err) {
    error = (err as Error).message;
  }

  const topics = Array.from(new Set(videos.map((v) => v.category))).sort();
  const isFiltered = Boolean(
    (params.topic && params.topic !== "all") || (params.length && params.length !== "any")
  );
  const displayed = applyFilters(videos, params);

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="mb-14">
          <p className="mb-6 flex items-center gap-3 font-mono-x text-muted">
            <span className="inline-block size-1.5 rounded-full bg-accent2" />
            Video Library · {videos.length} recording{videos.length !== 1 ? "s" : ""}
          </p>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Browse the <em className="text-accent2">video library</em>
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Talks, tutorials, and research walkthroughs from the lab. Filter by topic or length
            to find what you&apos;re after.
          </p>
        </div>

        {!error && videos.length > 0 && <VideoFilters topics={topics} />}

        <VideoAdminBar />

        {error ? (
          <VideosUnavailable error={error} />
        ) : (
          <VideoGrid videos={displayed} filtered={isFiltered} />
        )}
      </section>
    </div>
  );
}
