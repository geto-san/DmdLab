import { Skeleton } from "@/components/skeleton";

export default function VideoDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-32 sm:px-8 sm:pt-40">
      <Skeleton className="h-4 w-32" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <Skeleton className="aspect-video w-full rounded-blob bg-surface" />
          <div className="mt-8 space-y-4">
            <div className="flex gap-3">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-11/12" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <aside>
          <Skeleton className="mb-4 h-4 w-16" />
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-video w-full rounded-blob bg-surface" />
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
