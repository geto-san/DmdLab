import { Skeleton } from "@/components/skeleton";

export default function TeamLoading() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-12 w-full max-w-sm" />
        </div>
        <div className="lg:flex lg:items-start lg:gap-6">
          <Skeleton className="h-64 w-full max-w-[17rem] shrink-0 rounded-[28px]" />
          <div className="mt-8 min-w-0 flex-1 space-y-6 lg:mt-0">
            <div className="flex items-center gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="size-14 shrink-0 rounded-full sm:size-16" />
              ))}
            </div>
            <Skeleton className="h-24 w-full rounded-[28px]" />
          </div>
        </div>
      </section>
    </div>
  );
}
