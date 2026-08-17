import { Skeleton, PageHeaderSkeleton } from "@/components/skeleton";

function MemberCardSkeleton() {
  return (
    <div>
      <Skeleton className="mb-4 aspect-[3/4] w-full rounded-blob bg-surface" />
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="mt-2 h-3 w-2/5" />
    </div>
  );
}

export default function TeamLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex items-baseline gap-4">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MemberCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
