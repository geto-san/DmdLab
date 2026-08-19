"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { EditItem } from "@/components/cms/edit-item";

type TeamCard = {
  name: string;
  role?: string | null;
  image?: string | null;
  bio?: string | null;
  research?: string | null;
  education?: string | null;
  email?: string | null;
};

function toCard(m: Record<string, unknown>): TeamCard {
  return {
    name: typeof m.name === "string" && m.name ? m.name : "Unnamed",
    role: (m.role as string | null) || null,
    image: (m.image || m.photo) as string | null,
    bio: (m.bio as string | null) || null,
    research: (m.research as string | null) || null,
    education: (m.education as string | null) || null,
    email: (m.email as string | null) || null,
  };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function splitName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return [parts[0] ?? "", ""];
  return [parts[0] ?? "", parts.slice(1).join(" ")];
}

function Portrait({ card, className = "" }: Readonly<{ card: TeamCard; className?: string }>) {
  if (card.image) {
    return (
      <Image
        src={card.image}
        alt={card.name}
        fill
        sizes="(min-width: 1024px) 40vw, 90vw"
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent2/15 to-accent/15">
      <span className="font-display text-5xl text-muted">{initials(card.name)}</span>
    </div>
  );
}

export function TeamCarousel({
  items,
  categoryLabel,
}: Readonly<{ items: Record<string, unknown>[]; categoryLabel: string }>) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const total = items.length;

  const rawActive = items[active];
  const card = toCard(rawActive);
  const [first, last] = splitName(card.name);
  const bio = card.bio || card.research || card.education || null;

  const go = (dir: 1 | -1) => {
    setExpanded(false);
    setActive((prev) => (prev + dir + total) % total);
  };

  const windowSize = Math.min(4, total);
  const stack = Array.from({ length: windowSize }, (_, d) => {
    const idx = (active + d) % total;
    return { idx, d, member: items[idx] };
  }).reverse();

  return (
    <div className="flex flex-col items-center">
      {expanded ? (
        <div key={`detail-${active}`} className="grid w-full animate-fade-up gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative order-1 aspect-[4/5] w-full max-w-md overflow-hidden rounded-blob bg-surface lg:max-w-none">
            <Portrait card={card} />
          </div>
          <div className="order-2">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mb-6 inline-flex items-center gap-2 font-mono-x text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="size-3.5" /> Back to {categoryLabel}
            </button>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-line bg-surface px-3 py-1 font-mono-x text-[0.6875rem] text-accent2">
                {categoryLabel}
              </span>
              {card.role && (
                <span className="rounded-full border border-line bg-surface px-3 py-1 font-mono-x text-[0.6875rem] text-muted">
                  {card.role}
                </span>
              )}
            </div>
            <h3 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              <em className="text-accent2">{first}</em> {last}
            </h3>
            {bio && <p className="prose-lab mt-6 max-w-lg">{bio}</p>}
            {card.email && (
              <a
                href={`mailto:${card.email}`}
                className="mt-6 inline-flex items-center gap-2 font-mono-x text-accent2 underline-offset-4 hover:underline"
              >
                <Mail className="size-3.5" /> {card.email}
              </a>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="relative aspect-[3/4] w-full max-w-sm">
            {stack.map(({ idx, d, member }) => {
              const c = toCard(member);
              const isFront = d === 0;
              const style = {
                transform: `translate(${d * 30}px, ${d * -12}px) scale(${1 - d * 0.07})`,
                opacity: isFront ? 1 : 0.55 - d * 0.12,
                zIndex: windowSize - d,
              };

              const visual = (
                <div
                  className={`relative h-full w-full overflow-hidden rounded-blob border border-line bg-surface shadow-sm transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isFront ? "group-hover:scale-[1.03]" : ""
                  }`}
                >
                  <Portrait card={c} />
                </div>
              );

              if (!isFront) {
                return (
                  <div
                    key={idx}
                    className="absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={style}
                  >
                    {visual}
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="group absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [&>div]:h-full [&>div]:w-full"
                  style={style}
                >
                  <EditItem collection="members" item={member}>
                    <>
                      {visual}
                      <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        aria-label={`View ${c.name}'s profile`}
                        className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-bg/85 text-ink backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:text-accent-ink"
                      >
                        <ArrowUpRight className="size-4" />
                      </button>
                    </>
                  </EditItem>
                </div>
              );
            })}
          </div>

          <div key={`info-${active}`} className="mt-7 animate-fade-up text-center">
            <h3 className="font-display text-2xl tracking-tight sm:text-3xl">{card.name}</h3>
            {card.role && <p className="mt-1.5 font-mono-x text-xs text-muted">{card.role}</p>}
          </div>
        </>
      )}

      {total > 1 && !expanded && (
        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous member"
            className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next member"
            className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2"
          >
            <ArrowRight className="size-4" />
          </button>
          <span className="ml-2 font-mono-x text-xs text-muted">
            <span className="text-ink">{String(active + 1).padStart(2, "0")}</span> /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
