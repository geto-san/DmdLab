import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = Number(id);
  const [article] = Number.isInteger(articleId)
    ? await db.select().from(articles).where(eq(articles.id, articleId)).limit(1)
    : [];
  if (!article) notFound();

  const body = String(article.content || article.description || "");

  return (
    <article className="mx-auto max-w-3xl px-5 pt-32 sm:px-0 sm:pt-40">
      <Link
        href="/articles"
        className="mb-10 inline-flex items-center gap-2 font-mono-x text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" /> Back to journal
      </Link>

      <header className="mb-10">
        <div className="mb-6 flex flex-wrap items-center gap-3 font-mono-x text-xs text-muted">
          <Badge>{article.category || "General"}</Badge>
          <span>{formatDate(article.date)}</span>
          {article.author && (
            <>
              <span aria-hidden>/</span>
              <span>{article.author}</span>
            </>
          )}
        </div>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          {article.title}
        </h1>
      </header>

      {article.image && (
        <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-blob bg-surface">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose-lab">
        {body.split(/\n\s*\n/).map((para, i) =>
          para.startsWith("## ") ? (
            <h2 key={i}>{para.replace(/^##\s+/, "")}</h2>
          ) : para.startsWith("### ") ? (
            <h3 key={i}>{para.replace(/^###\s+/, "")}</h3>
          ) : (
            <p key={i}>{para}</p>
          )
        )}
      </div>
    </article>
  );
}