import type { ReactNode } from "react";

export function Marquee({
  items,
  className = "",
}: Readonly<{
  items: ReactNode[];
  className?: string;
}>) {
  // Random ids instead of the array index — this list renders twice
  // side-by-side (the seamless-scroll trick below), so index-based keys
  // would collide in intent even though they're technically scoped per row.
  const keyedItems = items.map((item) => ({ id: crypto.randomUUID(), item }));

  const row = (
    <div className="flex shrink-0 items-center gap-12 pr-12">
      {keyedItems.map(({ id, item }) => (
        <span key={id} className="flex items-center gap-12 whitespace-nowrap">
          {item}
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}
