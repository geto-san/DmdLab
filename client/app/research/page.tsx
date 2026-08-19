import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getContentMap, mergeBlock } from "@/lib/content";
import { RESEARCH_PROJECTS } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui";
import { EditItem } from "@/components/cms/edit-item";

export const revalidate = 3600;

type Project = {
  title: string;
  slug: string;
  status: string;
  duration?: string;
  description: string;
  image: string;
  team?: string[];
  funding?: string;
};

export default async function ResearchPage() {
  const content = await getContentMap();
  const block = mergeBlock(
    { projects: RESEARCH_PROJECTS } as unknown as Record<string, unknown>,
    content.research as Record<string, unknown> | undefined
  );
  const projects = (block.projects as Project[]) || RESEARCH_PROJECTS;

  return (
    <div>
      <PageHeader
        index="03"
        eyebrow="Active work"
        title={
          <>
            Research <em className="text-accent2">Projects</em>
          </>
        }
        lead="Ongoing investigations across computational chemistry, drug discovery, and applied machine learning."
      />

      <EditItem collection="content" blockKey="research" item={{ title: "Research projects" }}>
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 100}>
              <Link href={`/research/${p.slug}`} className="group flex flex-col">
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-blob bg-surface">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 font-mono-x text-[0.625rem] text-accent-ink">
                    {p.status}
                  </span>
                  <span className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-bg/80 text-ink backdrop-blur-sm transition-all duration-300 group-hover:bg-accent group-hover:text-accent-ink">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono-x text-xs text-accent2">0{i + 1}</span>
                  <h2 className="font-display text-2xl leading-snug tracking-tight transition-colors group-hover:text-accent2 sm:text-3xl">
                    {p.title}
                  </h2>
                </div>
                {p.duration && (
                  <p className="mt-2 pl-9 font-mono-x text-xs text-muted">{p.duration}</p>
                )}
                <p className="mt-3 line-clamp-3 pl-9 text-sm leading-relaxed text-muted">
                  {p.description}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center gap-6 rounded-blob border border-line bg-surface py-16 text-center">
          <p className="font-display text-4xl tracking-tight sm:text-5xl">
            Have a question about our work?
          </p>
          <Button href="/contact" variant="outline" icon>
            Get in touch
          </Button>
        </div>
      </section>
      </EditItem>
    </div>
  );
}
