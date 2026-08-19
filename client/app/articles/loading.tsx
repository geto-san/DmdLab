import { Skeleton } from "@/components/skeleton";

function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-8">
      <Skeleton className="aspect-[16/9] w-full rounded-blob bg-surface" />
      <div className="space-y-2.5">
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-7 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}

export default function ArticlesLoading() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <Skeleton className="mb-10 h-9 w-64" />
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
