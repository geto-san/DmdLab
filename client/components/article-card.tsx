import { formatDate } from "@/lib/format";
import { MediaCard } from "@/components/media-card";

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
    <MediaCard
      href={`/articles/${id}`}
      title={title}
      image={image}
      fallback={<span className="font-mono-x text-muted">{index ? `0${index + 1}` : "DM"}</span>}
      eyebrow={category || "General"}
      meta={<span>{formatDate(date)}</span>}
      description={
        description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{description}</p>
        )
      }
      cta="Read"
      srOnly={author && <span className="sr-only">{author}</span>}
    />
  );
}
