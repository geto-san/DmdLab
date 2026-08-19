import { ArrowDown, Radio } from "lucide-react";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { announcements, members } from "@/db/schema";
import { getContentMap, mergeBlock } from "@/lib/content";
import { getTotalRecordedHours } from "@/lib/youtube";
import { HERO, STATS_ACTIVE_TOPICS_DEFAULT } from "@/lib/data";
import { Button } from "@/components/ui";
import { Marquee } from "@/components/marquee";
import { Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";
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
  const [content, announcementRows, teamCount, recordedHours] = await Promise.all([
    getContentMap(),
    db.select().from(announcements).orderBy(desc(announcements.date)).limit(3),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(members)
      .then((rows) => rows[0]?.count ?? 0)
      .catch(() => 0),
    getTotalRecordedHours().catch(() => 0),
  ]);

  const hero = mergeBlock(HERO as unknown as Record<string, unknown>, content.hero) as unknown as HeroBlock;

  // "Researchers" (live member count) and "Recorded Hours" (live YouTube
  // total) are always computed — the CMS "stats" block can only override
  // "Active Topics", which has no underlying table to count from.
  const statsBlock = content.stats as { activeTopics?: { value: number; suffix: string } } | undefined;
  const activeTopics = statsBlock?.activeTopics ?? STATS_ACTIVE_TOPICS_DEFAULT;
  const stats = [
    { label: "Researchers", value: teamCount, suffix: "" },
    { label: "Active Topics", value: activeTopics.value, suffix: activeTopics.suffix },
    { label: "Recorded Hours", value: recordedHours, suffix: "" },
  ];

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
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px px-5 py-16 sm:px-8 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={s.label} className={i > 0 ? "sm:border-l sm:border-line sm:pl-10" : ""}>
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
