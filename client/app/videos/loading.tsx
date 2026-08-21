import { Skeleton } from "@/components/skeleton";

function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-b border-line pb-8">
      <Skeleton className="aspect-video w-full rounded-blob bg-surface" />
      <div className="space-y-2.5">
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-7 w-11/12" />
        <Skeleton className="h-7 w-3/5" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export default function VideosLoading() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="mb-14">
          <Skeleton className="mb-6 h-4 w-48" />
          <Skeleton className="h-12 w-2/3 max-w-xl" />
          <Skeleton className="mt-4 h-4 w-1/2 max-w-lg" />
        </div>

        <div className="mb-10 flex flex-col gap-4 rounded-blob border border-line bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        </div>

        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
