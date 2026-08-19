import { asc } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { ALUMNI, LAB_MEMBERS } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { TeamCarousel } from "@/components/team-carousel";
import { AddButton } from "@/components/cms/edit-item";

export const revalidate = 3600;

type Category = {
  name: string;
  items: Record<string, unknown>[];
};

export default async function TeamPage() {
  const dbRows = await db.select().from(members).orderBy(asc(members.category), asc(members.id));

  const categories: Category[] = Array.from(
    dbRows.reduce((map, m) => {
      const name = m.category || "Researchers";
      const list = map.get(name) || [];
      list.push(m as unknown as Record<string, unknown>);
      map.set(name, list);
      return map;
    }, new Map<string, Record<string, unknown>[]>()),
    ([name, items]) => ({ name, items })
  );

  return (
    <div>
      <PageHeader
        index="05"
        eyebrow="The people"
        title={
          <>
            Our <em className="text-accent2">Team</em>
          </>
        }
        lead="A multidisciplinary group of researchers, engineers, and students building applied machine learning."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-blob border border-line bg-surface py-24 text-center">
            <p className="font-display text-3xl">No team members yet</p>
            <p className="text-sm text-muted">
              Members added through the CMS will appear here.
            </p>
            <AddButton collection="members" label="Add member" />
          </div>
        ) : (
          categories.map((category, ci) => (
            <div key={category.name} className="mb-20 last:mb-0">
              <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono-x text-xs text-accent2">0{ci + 1}</span>
                  <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                    {category.name}
                  </h2>
                  <span className="font-mono-x text-xs text-muted">
                    {category.items.length}
                  </span>
                </div>
                <AddButton collection="members" label={`Add to ${category.name}`} />
              </div>
              <Reveal>
                <TeamCarousel items={category.items} categoryLabel={category.name} />
              </Reveal>
            </div>
          ))
        )}
      </section>

      <section className="hairline-t border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h2 className="mb-8 font-display text-3xl tracking-tight sm:text-4xl">
            Alumni
          </h2>
          <ul className="divide-y divide-line">
            {ALUMNI.map((alum) => (
              <li
                key={alum.name}
                className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4"
              >
                <span className="font-display text-xl">{alum.name}</span>
                <span className="text-sm text-muted">{alum.position}</span>
                <span className="ml-auto font-mono-x text-xs text-muted">
                  Class of {alum.year}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-10 font-mono-x text-xs text-muted">
            {LAB_MEMBERS.length} researchers across the lab’s history
          </p>
        </div>
      </section>
    </div>
  );
}
