import { Skeleton } from "@/components/skeleton";

export default function RootLoading() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-5 pb-10 pt-32 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <Skeleton className="mb-6 h-3 w-48" />
          <Skeleton className="mb-4 h-16 w-5/6 max-w-5xl sm:h-24" />
          <Skeleton className="mb-2 h-16 w-3/5 max-w-3xl sm:h-24" />
          <Skeleton className="mt-8 h-4 w-96 max-w-xl" />
          <Skeleton className="mt-2 h-4 w-80 max-w-lg" />
          <div className="mt-10 flex flex-wrap gap-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px px-5 py-16 sm:grid-cols-3 sm:px-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={i > 0 ? "border-t border-line pt-6 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0" : ""}>
              <Skeleton className="h-14 w-24 sm:h-16" />
              <Skeleton className="mt-2 h-3 w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <Skeleton className="mb-6 h-4 w-20" />
        <div className="divide-y divide-line">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-3 py-4">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-3 w-full sm:w-40" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured grid */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Skeleton className="h-12 w-96 max-w-full sm:h-14" />
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-5">
                <Skeleton className="aspect-[4/3] rounded-blob bg-bg" />
                <Skeleton className="h-7 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}