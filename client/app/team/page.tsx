import { asc } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { members } from "@/db/schema";
import { Reveal } from "@/components/reveal";
import { TeamShowcase } from "@/components/team-showcase";
import { AddButton } from "@/components/cms/edit-item";
import { JoinTeamForm } from "@/components/join-team-form";

// Reads cookies() for Google-verification state, which makes this page
// dynamic per-request regardless — no ISR revalidate window applies.
export const dynamic = "force-dynamic";

export default async function TeamPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ applied?: string }>;
}>) {
  const [dbRows, { applied }, cookieStore] = await Promise.all([
    db.select().from(members).orderBy(asc(members.id)),
    searchParams,
    cookies(),
  ]);
  const verifiedEmail = cookieStore.get("apply_verified_email")?.value ?? null;
  const verifiedName = cookieStore.get("apply_verified_name")?.value ?? "";

  const active = dbRows.filter((m) => !m.alumni);
  const alumni = dbRows.filter((m) => m.alumni);

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="mb-14">
          <p className="mb-6 flex items-center gap-3 font-mono-x text-muted">
            <span className="inline-block size-1.5 rounded-full bg-accent2" />
            Team · {active.length} researcher{active.length !== 1 ? "s" : ""}
          </p>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Meet our <em className="text-accent2">team members</em>
          </h1>
          <div className="mt-8 grid gap-x-12 gap-y-4 sm:grid-cols-2">
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              We are a multidisciplinary team of researchers, engineers, and students working together to build applied machine learning.
            </p>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              Each person brings a distinct discipline to the lab quantum computing, NLP, prompt engineering, statistics operating as one integrated unit.
            </p>
          </div>
        </div>

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
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                Alumni
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                {alumni.length} former member{alumni.length !== 1 ? "s" : ""} who helped shape the lab&apos;s work before moving on to new adventures.
              </p>
            </div>
            <ul className="divide-y divide-line">
              {alumni.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-baseline gap-x-6 gap-y-1 rounded-xl px-3 py-4 -mx-3 transition-colors hover:bg-bg"
                >
                  <span className="font-display text-xl">{a.name}</span>
                  {a.role && <span className="text-sm text-muted">{a.role}</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="join-team" className="hairline-t border-t border-line bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
              Join the <em className="text-accent2">team</em>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              We&apos;re always looking for curious students to work alongside the lab —
              across research, engineering, and everything in between. Tell us a bit
              about yourself and we&apos;ll be in touch.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <JoinTeamForm
              verifiedEmail={verifiedEmail}
              verifiedName={verifiedName}
              googleError={applied === "error"}
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
