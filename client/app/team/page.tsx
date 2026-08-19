import { asc } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { TeamShowcase } from "@/components/team-showcase";
import { AddButton } from "@/components/cms/edit-item";

export const revalidate = 3600;

export default async function TeamPage() {
  const dbRows = await db.select().from(members).orderBy(asc(members.id));

  const active = dbRows.filter((m) => !m.alumni);
  const alumni = dbRows.filter((m) => m.alumni);

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
        {active.length === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-blob border border-line bg-surface py-24 text-center">
            <p className="font-display text-3xl">No team members yet</p>
            <p className="text-sm text-muted">
              Members added through the CMS will appear here.
            </p>
            <AddButton collection="members" label="Add member" />
          </div>
        ) : (
          <Reveal>
            <TeamShowcase members={active} />
          </Reveal>
        )}

        {active.length > 0 && (
          <div className="mt-10 flex justify-end">
            <AddButton collection="members" label="Add member" />
          </div>
        )}
      </section>

      {alumni.length > 0 && (
        <section className="hairline-t border-t border-line bg-surface">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                Alumni
              </h2>
              <span className="font-mono-x text-xs text-muted">
                {alumni.length} member{alumni.length !== 1 ? "s" : ""}
              </span>
            </div>
            <ul className="divide-y divide-line">
              {alumni.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4"
                >
                  <span className="font-display text-xl">{a.name}</span>
                  {a.role && <span className="text-sm text-muted">{a.role}</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
