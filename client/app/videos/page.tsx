import { fetchChannelVideos } from "@/lib/youtube";
import { PageHeader } from "@/components/page-header";
import { VideoCard } from "@/components/video-card";
import { VideoAdminBar } from "@/components/cms/video-admin-bar";
import { EditItem } from "@/components/cms/edit-item";

export const revalidate = 300;

export default async function VideosPage() {
  let videos: Awaited<ReturnType<typeof fetchChannelVideos>> = [];
  let error: string | null = null;

  try {
    videos = await fetchChannelVideos();
  } catch (err) {
    error = (err as Error).message;
  }

  return (
    <div>
      <PageHeader
        index="02"
        eyebrow="Lab activities on YouTube"
        title={
          <>
            Video <em className="text-accent2">Library</em>
          </>
        }
        lead="Lectures, meetings, and demos recorded by the lab — streamed straight from our channel."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <VideoAdminBar />
        {error ? (
          <div className="rounded-blob border border-line bg-surface py-24 text-center">
            <p className="font-display text-3xl">Videos unavailable</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              {error === "YOUTUBE_API_KEY not set"
                ? "The YouTube API key isn't configured. Set YOUTUBE_API_KEY in your environment to enable the video library."
                : "We couldn't reach YouTube right now. Please try again shortly."}
            </p>
          </div>
        ) : videos.length ? (
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
        ) : (
          <div className="rounded-blob border border-line bg-surface py-24 text-center">
            <p className="font-display text-3xl">No videos yet</p>
            <p className="mt-3 text-sm text-muted">Videos will appear here once the channel publishes content.</p>
          </div>
        )}
      </section>
    </div>
  );
}
