import { Skeleton } from "@/components/skeleton";

function PlaylistRowSkeleton() {
  return (
    <div className="flex items-start gap-4 py-4">
      <Skeleton className="aspect-video w-32 shrink-0 rounded-xl bg-surface sm:w-40" />
      <div className="min-w-0 flex-1 space-y-2.5 pt-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function VideoDetailLoading() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
      <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:grid-rows-[auto_auto_1fr] xl:grid-cols-[minmax(0,1fr)_400px] lg:[grid-template-areas:'stage_playlist'_'channel_playlist'_'comments_playlist']">
        <section className="min-w-0 lg:[grid-area:stage]">
          <div className="overflow-hidden rounded-blob border border-line">
            <Skeleton className="aspect-video w-full rounded-none bg-surface" />
            <div className="space-y-3 border-t border-line bg-surface px-6 py-6">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-7 w-3/4 max-w-md" />
              <Skeleton className="h-4 w-full max-w-xl" />
              <Skeleton className="h-4 w-4/5 max-w-lg" />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <Skeleton className="h-1 w-full rounded-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="size-9 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 min-w-0 lg:[grid-area:channel]">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-10 w-28 shrink-0 rounded-full" />
        </div>

        <div className="min-w-0 space-y-6 lg:[grid-area:comments]">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-28 w-full rounded-blob bg-surface" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-3.5">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            </div>
          ))}
        </div>

        <div className="min-w-0 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1 lg:[grid-area:playlist]">
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="size-9 rounded-full" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <PlaylistRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
