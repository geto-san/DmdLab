export function Skeleton({ className = "" }: Readonly<{ className?: string }>) {
  return <div className={`animate-pulse rounded-lg bg-line/70 ${className}`} aria-hidden />;
}
