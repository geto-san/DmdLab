import Image from "next/image";
import { Mail } from "lucide-react";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { ALUMNI, LAB_MEMBERS } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { EditItem, AddButton } from "@/components/cms/edit-item";

export const revalidate = 3600;

type TeamCard = {
  name: string;
  role?: string | null;
  image?: string | null;
  bio?: string | null;
  research?: string | null;
  education?: string | null;
  email?: string | null;
};

type Category = {
  name: string;
  items: Record<string, unknown>[];
};

function renderMember(m: Record<string, unknown>): TeamCard {
  return {
    name: String(m.name || "Unnamed"),
    role: (m.role as string | null) || null,
    image: (m.image || m.photo) as string | null,
    bio: (m.bio as string | null) || null,
    research: (m.research as string | null) || null,
    education: (m.education as string | null) || null,
    email: (m.email as string | null) || null,
  };
}

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
              <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {category.items.map((item, mi) => {
                  const member = renderMember(item);
                  const card = (
                    <div className="group">
                      <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-blob bg-surface">
                        {member.image && (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                          />
                        )}
                        <div className="absolute inset-0 flex translate-y-4 flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/30 to-transparent p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="line-clamp-4 text-sm leading-relaxed text-bg">
                            {member.bio || member.research || member.education}
                          </p>
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="mt-3 inline-flex items-center gap-1.5 font-mono-x text-xs text-bg underline-offset-4 hover:underline"
                            >
                              <Mail className="size-3" /> {member.email}
                            </a>
                          )}
                        </div>
                      </div>
                      <h3 className="font-display text-xl leading-snug tracking-tight">
                        {member.name}
                      </h3>
                      <p className="mt-1 font-mono-x text-xs text-muted">{member.role}</p>
                      {member.research && (
                        <p className="mt-1 text-xs text-accent2">{member.research}</p>
                      )}
                    </div>
                  );
                  return (
                    <Reveal key={String(item.name ?? item.id ?? mi)} delay={mi * 80}>
                      <EditItem collection="members" item={item}>
                        {card}
                      </EditItem>
                    </Reveal>
                  );
                })}
              </div>
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
