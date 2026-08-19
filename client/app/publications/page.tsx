import Link from "next/link";
import { ArrowUpRight, BookOpen, Quote } from "lucide-react";
import { PUBLICATIONS } from "@/lib/data";
import { getContentMap, mergeBlock } from "@/lib/content";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { EditItem } from "@/components/cms/edit-item";

export const revalidate = 3600;

type Publication = {
  year: number;
  title: string;
  slug: string;
  authors: string;
  journal: string;
  doi: string;
  citations: number;
  featured: boolean;
};

export default async function PublicationsPage() {
  const content = await getContentMap();
  const block = mergeBlock(
    { publications: PUBLICATIONS } as unknown as Record<string, unknown>,
    content.publications as Record<string, unknown> | undefined
  );
  const all = (block.publications as Publication[]) || PUBLICATIONS;
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured);

  return (
    <div>
      <PageHeader
        index="04"
        eyebrow="Peer-reviewed output"
        title={<em className="text-accent2">Publications</em>}
        lead="Selected papers from the lab, with full-text links where available."
      />

      <EditItem collection="content" blockKey="publications" item={{ title: "Publications" }}>
        <section className="mx-auto max-w-4xl px-5 py-16 sm:px-0">
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
          <h2 className="mb-8 font-mono-x text-muted">All publications</h2>
          <ul className="divide-y divide-line">
            {[...featured, ...rest].map((p) => (
              <li key={p.slug}>
                <a
                  href={`https://doi.org/${p.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-2 py-6 sm:grid-cols-[64px_1fr_auto] sm:items-baseline sm:gap-6"
                >
                  <span className="font-mono-x text-xs text-accent2">{p.year}</span>
                  <span>
                    <span className="font-display text-xl leading-snug tracking-tight transition-colors group-hover:text-accent2 sm:text-2xl">
                      {p.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {p.journal} · {p.authors}
                    </span>
                  </span>
                  <span className="hidden font-mono-x text-xs text-muted sm:inline">
                    {p.citations} cites
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 flex items-start gap-4 rounded-blob border border-line bg-surface p-8">
          <Quote className="mt-1 size-6 shrink-0 text-accent2" />
          <p className="text-lg leading-relaxed text-muted">
            Preprints and working papers are shared as they become available. For
            collaboration or reprints, reach out via the{" "}
            <Link href="/contact" className="text-accent2 underline underline-offset-4">
              contact page
            </Link>
            .
          </p>
        </div>
      </section>
      </EditItem>
    </div>
  );
}
