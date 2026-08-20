import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type MediaCardProps = {
  href: string;
  title: string;
  image?: string | null;
  imageAlt?: string;
  fallback: ReactNode;
  overlay?: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
  cta: string;
  srOnly?: ReactNode;
};

export function MediaCard({
  href,
  title,
  image,
  imageAlt,
  fallback,
  overlay,
  eyebrow,
  meta,
  description,
  cta,
  srOnly,
}: Readonly<MediaCardProps>) {
  return (
    <Link href={href} className="group flex flex-col gap-4 border-b border-line pb-8">
      <div className="relative aspect-video overflow-hidden rounded-blob bg-surface shadow-soft transition-shadow duration-300 group-hover:shadow-soft-lg">
        {image ? (
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-surface">{fallback}</div>
        )}
        {overlay}
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between font-mono-x text-[0.6875rem] text-muted">
          <span className="text-accent2">{eyebrow}</span>
          {meta}
        </div>
        <h3 className="line-clamp-2 font-display text-2xl leading-snug tracking-tight transition-colors group-hover:text-accent2">
          {title}
        </h3>
        {description}
        <span className="mt-4 inline-flex items-center gap-1.5 font-mono-x text-ink transition-colors group-hover:text-accent2">
          {cta}
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        {srOnly}
      </div>
    </Link>
  );
}
