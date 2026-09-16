import { ArrowUpRight, BookOpen } from "lucide-react";
import { getContentMap } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { EditItem } from "@/components/cms/edit-item";
import { PublicationList, type Publication } from "@/components/publication-list";

export const revalidate = 3600;

type PublicationRow = Publication & { featured: boolean };

export default async function PublicationsPage() {
  const content = await getContentMap();
  const publicationsBlock = content.publications as { publications?: PublicationRow[] } | undefined;
  const all = (publicationsBlock?.publications ?? []) as PublicationRow[];
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured);

  return (
    <div>
      <EditItem collection="content" blockKey="publications" item={{ title: "Publications" }}>
        <section className="mx-auto max-w-4xl px-5 pb-16 pt-32 sm:px-0 sm:pt-40">
        {all.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-blob border border-line bg-surface py-24 text-center">
            <BookOpen className="size-6 text-muted" />
            <p className="font-display text-3xl">No publications yet</p>
            <p className="max-w-sm text-sm text-muted">
              Papers added through the CMS will appear here, grouped as featured and full list.
            </p>
          </div>
        ) : (
          <>
        {featured.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-8 font-mono-x text-muted">Featured</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {featured.map((p) => (
                <Reveal key={p.slug}>
                  <a
                    href={`https://doi.org/${p.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-blob border border-line bg-surface p-7 transition-all duration-300 hover:border-accent2"
                  >
                    <BookOpen className="mb-6 size-6 text-accent2" />
                    <p className="mb-3 font-mono-x text-xs text-muted">
                      {p.year} · {p.citations} citations
                    </p>
                    <h3 className="font-display text-2xl leading-snug tracking-tight transition-colors group-hover:text-accent2">
                      {p.title}
                    </h3>
                    <p className="mt-3 font-mono-x text-xs text-muted">{p.journal}</p>
                    <p className="mt-2 text-sm text-muted">{p.authors}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-mono-x text-ink transition-colors group-hover:text-accent2">
                      Read paper
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-6 font-mono-x text-muted">All publications</h2>
          <PublicationList publications={[...featured, ...rest] as Publication[]} />
        </div>

          </>
        )}
      </section>
      </EditItem>
    </div>
  );
}
