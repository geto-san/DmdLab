import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, Radio } from "lucide-react";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { articles, announcements, members } from "@/db/schema";
import { getContentMap, mergeBlock } from "@/lib/content";
import { getTotalRecordedHours } from "@/lib/youtube";
import { HERO, STATS_ACTIVE_TOPICS_DEFAULT } from "@/lib/data";
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
};

export default async function HomePage() {
  const [content, articleRows, announcementRows, teamCount, recordedHours] = await Promise.all([
    getContentMap(),
    db.select().from(articles).orderBy(desc(articles.date)).limit(3),
    db.select().from(announcements).orderBy(desc(announcements.date)).limit(3),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(members)
      .then((rows) => rows[0]?.count ?? 0)
      .catch(() => 0),
    getTotalRecordedHours().catch(() => 0),
  ]);

  const hero = mergeBlock(HERO as unknown as Record<string, unknown>, content.hero) as unknown as HeroBlock;

  // No hardcoded fallback: an admin-curated "featured-projects" block wins;
  // otherwise the most recent Research projects (DB/CMS-driven, see
  // app/research/page.tsx) stand in. The section itself is hidden when
  // neither source has anything yet.
  type FeaturedProject = { title: string; slug: string; description: string; image: string; status: string };
  const featuredBlock = content["featured-projects"] as
    | { heading?: string; cta?: { label: string; to: string }; projects?: FeaturedProject[] }
    | undefined;
  const researchBlock = content.research as { projects?: FeaturedProject[] } | undefined;
  const featuredProjects = featuredBlock?.projects?.length
    ? featuredBlock.projects
    : (researchBlock?.projects ?? []).slice(0, 3);
  const featuredHeading = featuredBlock?.heading || "Featured Projects";
  const featuredCta = featuredBlock?.cta || { label: "Browse Portfolio", to: "/research" };

  // "Researchers" (live member count) and "Recorded Hours" (live YouTube
  // total) are always computed the CMS "stats" block can only override
  // "Active Topics", which has no underlying table to count from.
  const statsBlock = content.stats as { activeTopics?: { value: number; suffix: string } } | undefined;
  const activeTopics = statsBlock?.activeTopics ?? STATS_ACTIVE_TOPICS_DEFAULT;
  const stats = [
    { label: "Researchers", value: teamCount, suffix: "" },
    { label: "Active Topics", value: activeTopics.value, suffix: activeTopics.suffix },
    { label: "Recorded Hours", value: recordedHours, suffix: "" },
  ];

  // DB-driven "events" content block (see ContentPanelForm): admin-curated
  // seminars, reading-group meetups, and deadlines. Hidden when empty.
  type EventItem = { date: string; title: string; body?: string; link?: string };
  const eventsBlock = content.events as { heading?: string; items?: EventItem[] } | undefined;
  const events = eventsBlock?.items?.length ? eventsBlock.items : [];
  const eventsHeading = eventsBlock?.heading || "Events & Reading Group";

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

        <Marquee
          className="hairline-t border-t border-line py-4"
          items={[
            "Quantum Computing",
            "Prompt Engineering",
            "Natural Language Processing",
            "Statistics",
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
      <section className="hairline-b border-b border-line bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px px-5 py-16 sm:px-8 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={
                i > 0
                  ? "border-t border-line pt-6 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0"
                  : ""
              }
            >
              <p className="font-display text-5xl tracking-tight sm:text-6xl">
                <StatCounter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 font-mono-x text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research focus areas — always-on section (not DB-gated) that gives
          search engines and LLMs real, crawlable text describing what the
          lab works on, and pairs each marquee topic with an H3 so heading
          structure isn't limited to a single H2 on pages with no DB content
          yet. */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Research focus areas
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            DeepMinds Research Lab is a multidisciplinary AI research group at Mbarara University of
            Science and Technology (MUST). We build applied machine learning systems that operate in
            the real world — from real-time wildlife conflict reporting for communities living near
            protected areas, to automated Sign Language translation that makes information more
            accessible. Our work spans four core areas.
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Quantum Computing",
              body: "Exploring quantum algorithms and hybrid quantum-classical approaches to problems in optimization and simulation.",
            },
            {
              title: "Prompt Engineering",
              body: "Designing and evaluating prompting strategies that make large language models more reliable for applied research tasks.",
            },
            {
              title: "Natural Language Processing",
              body: "Building NLP systems for low-resource languages, including automated Sign Language translation and text understanding.",
            },
            {
              title: "Statistics",
              body: "Applying statistical modeling to real-world datasets, from wildlife conflict reporting to experiment design and evaluation.",
            },
          ].map((topic) => (
            <div key={topic.title}>
              <h3 className="font-display text-xl tracking-tight">{topic.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{topic.body}</p>
            </div>
          ))}
        </div>
      </section>

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
                <li className="flex flex-wrap items-baseline gap-x-6 gap-y-1 rounded-xl px-3 py-4 -mx-3 transition-colors hover:bg-surface">
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

      {/* Events & Reading Group (DB-driven content block) */}
      {events.length > 0 && (
        <EditItem collection="content" blockKey="events" item={{ title: "Events & Reading Group" }}>
          <section className="hairline-t border-t border-line bg-surface">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-3xl tracking-tight sm:text-4xl">{eventsHeading}</h2>
              </div>
              <ul className="divide-y divide-line">
                {events.map((e, i) => {
                  const when = new Date(e.date);
                  const dateLabel = Number.isNaN(when.getTime())
                    ? e.date
                    : when.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                  return (
                    <li
                      key={`${e.title}-${i}`}
                      className="flex flex-wrap gap-x-6 gap-y-1 rounded-xl px-3 py-4 -mx-3 transition-colors hover:bg-bg"
                    >
                      <span className="font-mono-x text-xs text-accent2">{dateLabel}</span>
                      <span className="font-display text-xl sm:text-2xl">{e.title}</span>
                      {e.body && <span className="w-full text-sm text-muted sm:w-auto">{e.body}</span>}
                      {e.link && (
                        <a
                          href={e.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono-x text-xs text-ink transition-colors hover:text-accent2"
                        >
                          More info <ArrowRight className="size-3.5" />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </EditItem>
      )}

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
      <EditItem collection="content" blockKey="featured-projects" item={{ title: "Featured projects" }}>
        <section className="hairline-t border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {featuredHeading}
            </h2>
            <Button href={featuredCta.to} variant="outline" icon>
              {featuredCta.label}
            </Button>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {featuredProjects.map((p, i) => (
                <Reveal key={p.slug} delay={i * 100}>
                  <Link href={`/research/${p.slug}`} className="group block">
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-blob bg-surface shadow-soft transition-shadow duration-300 group-hover:shadow-soft-lg">
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
      )}

      {/* Latest articles */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
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
          <p className="text-muted">No articles published yet check back soon.</p>
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
