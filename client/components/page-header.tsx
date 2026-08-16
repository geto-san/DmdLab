import type { ReactNode } from "react";
import { Eyebrow } from "./ui";

export function PageHeader({
  index,
  eyebrow,
  title,
  lead,
  children,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="noise-overlay hairline-b bg-surface">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <Eyebrow>
          {index && <span className="text-accent2">{index}</span>} {eyebrow}
        </Eyebrow>
        <h1 className="max-w-4xl font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl md:text-8xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
