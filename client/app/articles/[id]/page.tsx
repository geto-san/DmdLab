import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { eq } from "drizzle-orm";
import { cache } from "react";
import type { Metadata } from "next";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { keyFor } from "@/lib/react-keys";
import { Badge } from "@/components/ui";
import { EditItem } from "@/components/cms/edit-item";

export const revalidate = 3600;

function renderParagraph(para: string, key: string) {
  if (para.startsWith("## ")) return <h2 key={key}>{para.replace(/^##\s+/, "")}</h2>;
  if (para.startsWith("### ")) return <h3 key={key}>{para.replace(/^###\s+/, "")}</h3>;
  return <p key={key}>{para}</p>;
}

// Required (even empty) for ISR to apply to a dynamic segment at runtime —
// otherwise Next renders it fully dynamic despite `revalidate` being set.
export async function generateStaticParams() {
  return [];
}

const getArticle = cache(async (id: string) => {
  const articleId = Number(id);
  if (!Number.isInteger(articleId)) return null;
  const [article] = await db.select().from(articles).where(eq(articles.id, articleId)).limit(1);
  return article ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description || undefined,
    openGraph: {
      title: article.title,
      description: article.description || undefined,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  const body = String(article.content || article.description || "");

  return (
    <EditItem collection="article" item={article} redirectTo="/articles">
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
        {(() => {
          const seen = new Map<string, number>();
          return body
            .split(/\n\s*\n/)
            .map((para) => renderParagraph(para, keyFor(para, seen)));
        })()}
      </div>
    </article>
    </EditItem>
  );
}