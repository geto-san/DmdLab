import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/format";

type ArticleCardProps = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  date?: string | null | Date;
  author?: string | null;
  image?: string | null;
  index?: number;
};

export function ArticleCard({
  id,
  title,
  description,
  category,
  date,
  author,
  image,
  index,
}: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${id}`}
      className="group flex flex-col gap-4 border-b border-line pb-8"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-blob bg-surface">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-surface">
            <span className="font-mono-x text-muted">{index ? `0${index + 1}` : "DM"}</span>
          </div>
        )}
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between font-mono-x text-[0.6875rem] text-muted">
          <span className="text-accent2">{category || "General"}</span>
          <span>{formatDate(date)}</span>
        </div>
        <h3 className="font-display text-2xl leading-snug tracking-tight transition-colors group-hover:text-accent2">
          {title}
        </h3>
        {description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{description}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 font-mono-x text-ink transition-colors group-hover:text-accent2">
          Read
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        {author && <span className="sr-only">{author}</span>}
      </div>
    </Link>
  );
}
