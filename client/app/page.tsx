import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, Radio } from "lucide-react";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articles, announcements } from "@/db/schema";
import { getContentMap, mergeBlock } from "@/lib/content";
import { HERO, FEATURED_PROJECTS, STATS } from "@/lib/data";
import { Button } from "@/components/ui";
import { Marquee } from "@/components/marquee";
import { Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";
import { ArticleCard } from "@/components/article-card";
import { EditItem, AddButton } from "@/components/cms/edit-item";

export const revalidate = 3600;

type HeroTitle = { before: string; highlight: string; after: string };
type HeroBlock = {
  eyebrow: string;
  title: HeroTitle;
  description: string;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
  stats: { value: string; label: string }[];
};

export default async function HomePage() {
  const [content, articleRows, announcementRows] = await Promise.all([
    getContentMap(),
    db.select().from(articles).orderBy(desc(articles.date)).limit(3),
    db.select().from(announcements).orderBy(desc(announcements.date)).limit(3),
  ]);

  const hero = mergeBlock(HERO as unknown as Record<string, unknown>, content.hero) as unknown as HeroBlock;
  const featured = mergeBlock(FEATURED_PROJECTS as unknown as Record<string, unknown>, content["featured-projects"]) as unknown as {
    heading: string;
    cta: { label: string; to: string };
    projects: { title: string; slug: string; description: string; image: string; status: string }[];
  };
  const statsBlock = content.stats as { stats: { label: string; value: number; suffix: string }[] } | undefined;
  const stats = statsBlock?.stats?.length ? statsBlock.stats : STATS;

  return (
    <div>
      {/* Hero */}
      <EditItem collection="content" blockKey="hero" item={{ title: "Hero section" }}>
        <section className="noise-overlay relative flex min-h-screen flex-col justify-end overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[120vh] bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_srgb,var(--accent2)_14%,transparent),transparent)]" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-32 sm:px-8">
          <Reveal>
            <p className="mb-6 flex items-center gap-3 font-mono-x text-muted">
              <span className="inline-block size-1.5 animate-pulse-dot rounded-full bg-accent" />
              {hero.eyebrow}
            </p>
            <h1 className="max-w-5xl font-display text-[clamp(2.75rem,8.5vw,7.5rem)] leading-[0.98] tracking-tight">
              {hero.title.before}
              <em className="text-accent2">{hero.title.highlight}</em>
              {hero.title.after}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              {hero.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href={hero.primaryCta.to} icon>
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.to} variant="outline">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px px-5 pb-10 sm:px-8 md:grid-cols-4">
          {hero.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="border-t border-line pt-4">
              <p className="font-display text-3xl sm:text-4xl">{s.value}</p>
              <p className="mt-1 font-mono-x text-xs text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
        <Marquee
          className="hairline-t border-t border-line py-4"
          items={[
            "Deep Learning",
            "Protein Folding",
            "Drug Discovery",
            "Wildlife Conflict",
            "Sign Language",
            "Molecular Dynamics",
          ]}
        />
        <a
          href="#lab"
          className="absolute bottom-24 right-8 hidden text-muted transition-colors hover:text-ink md:block"
          aria-label="Scroll to content"
        >
          <ArrowDown className="size-5 animate-bounce" />
        </a>
      </section>
      </EditItem>

      {/* Stats band */}
      <EditItem collection="content" blockKey="stats" item={{ title: "Stats band" }}>
        <section className="hairline-b border-b border-line bg-surface">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 py-16 sm:px-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={i > 0 ? "md:border-l md:border-line md:pl-10" : ""}>
                <p className="font-display text-5xl tracking-tight sm:text-6xl">
                  <StatCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 font-mono-x text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </EditItem>

      {/* Announcements */}
      {announcementRows.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <Reveal>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 font-mono-x text-muted">
                <Radio className="size-3.5 text-accent2" /> Latest
              </p>
              <AddButton collection="announcements" label="Add announcement" />
            </div>
          </Reveal>
          <ul className="divide-y divide-line">
            {announcementRows.map((a) => (
              <EditItem key={a.id} collection="announcements" item={a}>
                <li className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
                  <span className="font-mono-x text-xs text-muted">
                    {new Date(a.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-display text-xl sm:text-2xl">{a.title}</span>
                  {a.body && <span className="w-full text-sm text-muted sm:w-auto">{a.body}</span>}
                </li>
              </EditItem>
            ))}
          </ul>
        </section>
      )}

      {/* Featured projects */}
      <EditItem collection="content" blockKey="featured-projects" item={{ title: "Featured projects" }}>
        <section className="hairline-t border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {String(featured.heading)}
            </h2>
            <Button href={String(featured.cta.to)} variant="outline" icon>
              {String(featured.cta.label)}
            </Button>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {featured.projects.map((p, i) => (
                <Reveal key={p.slug} delay={i * 100}>
                  <Link href={`/research/${p.slug}`} className="group block">
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-blob bg-surface">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 font-mono-x text-[0.625rem] text-accent-ink">
                        {p.status}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl leading-snug tracking-tight transition-colors group-hover:text-accent2">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                      {p.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-mono-x text-ink transition-colors group-hover:text-accent2">
                      View project <ArrowRight className="size-3.5" />
                    </span>
                  </Link>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>
      </EditItem>

      {/* Latest articles */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 font-mono-x text-muted">
              <span className="mr-2 text-accent2">03</span>/
            </p>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              From the Journal
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <AddButton collection="article" label="Add article" />
            <Button href="/articles" variant="outline" icon>
              All articles
            </Button>
          </div>
        </div>
        {articleRows.length ? (
          <div className="grid gap-10 md:grid-cols-3">
            {articleRows.map((a, i) => (
              <EditItem key={a.id} collection="article" item={a}>
                <ArticleCard
                  id={String(a.id)}
                  title={a.title}
                  description={a.description}
                  category={a.category}
                  date={a.date}
                  author={a.author}
                  image={a.image}
                  index={i}
                />
              </EditItem>
            ))}
          </div>
        ) : (
          <p className="text-muted">No articles published yet — check back soon.</p>
        )}
      </section>

      {/* CTA */}
      <section className="hairline-t border-t border-line">
        <div className="noise-overlay mx-auto max-w-7xl px-5 py-24 text-center sm:px-8">
          <Reveal>
            <p className="mb-5 font-mono-x text-muted">Lab activities</p>
            <h2 className="mx-auto max-w-3xl font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              Watch what we&apos;re{" "}
              <em className="text-accent2">working on</em>
            </h2>
            <div className="mt-10 flex justify-center">
              <Button href="/videos" icon>
                Open video library
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
