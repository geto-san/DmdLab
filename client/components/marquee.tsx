import type { ReactNode } from "react";

export function Marquee({
  items,
  className = "",
}: {
  items: ReactNode[];
  className?: string;
}) {
  const row = (
    <div className="flex shrink-0 items-center gap-12 pr-12">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-12 whitespace-nowrap">
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
