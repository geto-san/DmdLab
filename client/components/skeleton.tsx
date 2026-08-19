export function Skeleton({ className = "" }: Readonly<{ className?: string }>) {
  return <div className={`animate-pulse rounded-lg bg-line/70 ${className}`} aria-hidden />;
}

export function PageHeaderSkeleton() {
  return (
    <section className="noise-overlay hairline-b bg-surface">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="space-y-4">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-20 w-3/4 max-w-4xl" />
          <Skeleton className="h-5 w-1/2 max-w-2xl" />
        </div>
      </div>
    </section>
  );
}
