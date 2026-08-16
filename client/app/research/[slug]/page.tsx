import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, DollarSign, Users } from "lucide-react";
import { getContentMap, mergeBlock } from "@/lib/content";
import { RESEARCH_PROJECTS } from "@/lib/data";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

type Project = {
  title: string;
  slug: string;
  status: string;
  duration?: string;
  team?: string[];
  funding?: string;
  description: string;
  image: string;
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContentMap();
  const block = mergeBlock(
    { projects: RESEARCH_PROJECTS } as unknown as Record<string, unknown>,
    content.research as Record<string, unknown> | undefined
  );
  const projects = (block.projects as Project[]) || RESEARCH_PROJECTS;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-5 pt-32 sm:px-0 sm:pt-40">
      <Link
        href="/research"
        className="mb-10 inline-flex items-center gap-2 font-mono-x text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" /> Back to projects
      </Link>

      <header className="mb-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge>{project.status}</Badge>
          {project.duration && (
            <span className="inline-flex items-center gap-1.5 font-mono-x text-xs text-muted">
              <Calendar className="size-3.5" /> {project.duration}
            </span>
          )}
          {project.funding && (
            <span className="inline-flex items-center gap-1.5 font-mono-x text-xs text-muted">
              <DollarSign className="size-3.5" /> {project.funding}
            </span>
          )}
        </div>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          {project.title}
        </h1>
      </header>

      <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-blob bg-surface">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
          priority
        />
      </div>

      <div className="prose-lab">{project.description}</div>

      {project.team && project.team.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl">
            <Users className="size-5 text-accent2" /> Team
          </h2>
          <ul className="flex flex-wrap gap-2">
            {project.team.map((member) => (
              <li
                key={member}
                className="rounded-full border border-line bg-surface px-4 py-1.5 font-mono-x text-xs"
              >
                {member}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
