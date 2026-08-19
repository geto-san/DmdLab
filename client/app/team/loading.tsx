import { Skeleton } from "@/components/skeleton";

export default function TeamLoading() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-12 w-full max-w-sm" />
        </div>
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="flex flex-col items-center gap-8">
            <Skeleton className="aspect-[4/5] w-full max-w-md rounded-3xl" />
            <div className="flex items-center gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="size-14 shrink-0 rounded-full sm:size-16" />
              ))}
            </div>
          </div>
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
      </section>
    </div>
  );
}
