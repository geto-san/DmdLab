import { Skeleton } from "@/components/skeleton";

function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[16/10] w-full rounded-blob bg-surface" />
      <div className="flex items-baseline gap-4">
        <Skeleton className="h-3 w-6" />
        <Skeleton className="h-8 w-4/5" />
      </div>
      <Skeleton className="ml-9 h-4 w-full" />
      <Skeleton className="ml-9 h-4 w-2/3" />
    </div>
  );
}

export default function ResearchLoading() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <Skeleton className="mb-10 h-9 w-72" />
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
