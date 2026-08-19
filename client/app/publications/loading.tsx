import { Skeleton } from "@/components/skeleton";

export default function PublicationsLoading() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-5 pb-16 pt-32 sm:px-0 sm:pt-40">
        <Skeleton className="mb-10 h-9 w-64" />
        <div className="mb-16">
          <Skeleton className="mb-8 h-4 w-24" />
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-4 rounded-blob border border-line bg-surface p-7">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="mb-8 h-4 w-36" />
          <div className="divide-y divide-line">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid gap-2 py-6 sm:grid-cols-[64px_1fr_auto] sm:items-baseline sm:gap-6">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
