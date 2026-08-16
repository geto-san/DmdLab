import Link from "next/link";
import { count, desc, ilike } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { ArticleFilter } from "@/components/article-filter";
import { ArticleCard } from "@/components/article-card";

export const dynamic = "force-dynamic";

const PER_PAGE = 9;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const where = category && category !== "all" ? ilike(articles.category, category) : undefined;
  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select()
      .from(articles)
      .where(where)
      .orderBy(desc(articles.date))
      .limit(PER_PAGE)
      .offset((page - 1) * PER_PAGE),
    db.select({ value: count() }).from(articles).where(where),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div>
      <PageHeader
        index="01"
        eyebrow="Publications & write-ups"
        title={
          <>
            The <em className="text-accent2">Journal</em>
          </>
        }
        lead="Research notes, project updates, and announcements from the lab — filtered by topic."
      >
        <ArticleFilter />
      </PageHeader>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {rows.length ? (
          <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {rows.map((a, i) => (
              <ArticleCard
                key={a.id}
                id={String(a.id)}
                title={a.title}
                description={a.description}
                category={a.category}
                date={a.date}
                author={a.author}
                image={a.image}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-blob border border-line bg-surface py-24 text-center">
            <p className="font-display text-3xl">Nothing here yet</p>
            <p className="mt-3 text-sm text-muted">
              No {category !== "all" ? `"${category}" ` : ""}articles found.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const href =
                category && category !== "all"
                  ? `/articles?category=${encodeURIComponent(category)}&page=${p}`
                  : `/articles?page=${p}`;
              return (
                <Link
                  key={p}
                  href={href}
                  aria-current={p === page ? "page" : undefined}
                  className={`flex size-10 items-center justify-center rounded-full font-mono-x text-xs transition-colors ${
                    p === page
                      ? "bg-accent text-accent-ink"
                      : "border border-line text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </nav>
        )}
      </section>
    </div>
  );
}
