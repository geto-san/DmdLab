import { Skeleton } from "@/components/skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-32 sm:px-0 sm:pt-40">
      <Skeleton className="h-4 w-36" />
      <div className="mb-10 mt-10 space-y-6">
        <div className="flex gap-3">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-10 w-11/12" />
        <Skeleton className="h-10 w-3/4" />
      </div>
      <Skeleton className="mb-12 aspect-[16/9] w-full rounded-blob bg-surface" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
