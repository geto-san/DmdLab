"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EditItem } from "@/components/cms/edit-item";

type Member = {
  id: number;
  name: string;
  role?: string | null;
  photo?: string | null;
  bio?: string | null;
  experience?: string | null;
  location?: string | null;
  email?: string | null;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function Photo({
  src,
  name,
  size = "full",
}: Readonly<{ src?: string | null; name: string; size?: "full" | "sm" | "xs" }>) {
  const sizeClasses = {
    full: "size-full",
    sm: "size-full rounded-full",
    xs: "size-full rounded-full",
  };

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        fill
        sizes={size === "full" ? "(min-width: 1024px) 40vw, 90vw" : "80px"}
        className={`object-cover ${sizeClasses[size]}`}
      />
    );
  }

  const textSizes = {
    full: "text-6xl",
    sm: "text-lg",
    xs: "text-sm",
  };

  return (
    <div
      className={`flex size-full items-center justify-center bg-gradient-to-br from-accent2/15 to-accent/15 ${
        size === "full" ? "" : "rounded-full"
      }`}
    >
      <span className={`font-display ${textSizes[size]} text-muted`}>{initials(name)}</span>
    </div>
  );
}

export function TeamShowcase({
  members,
}: Readonly<{ members: Member[] }>) {
  const [active, setActive] = useState(0);
  const total = members.length;
  const member = members[active];
  const hasStats = Boolean(member.experience || member.location || member.email);

  const go = (dir: 1 | -1) => setActive((prev) => (prev + dir + total) % total);

  return (
    <div className="lg:flex lg:items-start lg:gap-6">
      {/* Accent card: photo, name, role, prev/next */}
      <div className="relative w-full max-w-[17rem] shrink-0">
        <div className="relative overflow-hidden rounded-[28px] bg-accent p-6 pb-7">
          <div className="absolute right-3 top-3 z-10">
            <EditItem collection="members" item={member as unknown as Record<string, unknown>}>
              <span />
            </EditItem>
          </div>

          <div className="relative mb-6 size-20 overflow-hidden rounded-full ring-4 ring-bg/30">
            <Photo src={member.photo} name={member.name} />
          </div>

          <h3 className="font-display text-xl leading-tight tracking-tight text-accent-ink">
            {member.name}
          </h3>
          {member.role && (
            <p className="mt-1 text-sm text-accent-ink/70">{member.role}</p>
          )}

          {total > 1 && (
            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous member"
                className="flex size-9 items-center justify-center rounded-full border border-accent-ink/25 text-accent-ink transition-colors hover:border-accent-ink hover:bg-accent-ink/10"
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next member"
                className="flex size-9 items-center justify-center rounded-full border border-accent-ink/25 text-accent-ink transition-colors hover:border-accent-ink hover:bg-accent-ink/10"
              >
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right column: avatar row, connected stats bar, bio */}
      <div className="mt-8 min-w-0 flex-1 space-y-6 lg:mt-0">
        {total > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {members.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Select ${m.name}`}
                className={`relative size-14 shrink-0 overflow-hidden rounded-full border-2 transition-all duration-300 sm:size-16 ${
                  i === active
                    ? "border-accent2 shadow-md scale-110"
                    : "border-line opacity-60 hover:opacity-100 hover:border-muted"
                }`}
              >
                <Photo src={m.photo} name={m.name} size="sm" />
              </button>
            ))}
          </div>
        )}

        {hasStats && (
          <div className="relative rounded-[28px] bg-accent px-6 py-6 sm:px-8">
            {/* Connector bridging the card and this bar on wide screens */}
            <div className="pointer-events-none absolute -left-6 top-1/2 hidden h-1.5 w-6 -translate-y-1/2 rounded-full bg-accent lg:block" />

            <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
              {member.experience && (
                <div>
                  <p className="font-mono-x text-[0.6875rem] text-accent-ink/60">
                    Years of experience
                  </p>
                  <p className="mt-1 font-display text-lg text-accent-ink">{member.experience}</p>
                </div>
              )}
              {member.location && (
                <div>
                  <p className="font-mono-x text-[0.6875rem] text-accent-ink/60">Location</p>
                  <p className="mt-1 font-display text-lg text-accent-ink">{member.location}</p>
                </div>
              )}
              {member.email && (
                <div className="min-w-0">
                  <p className="font-mono-x text-[0.6875rem] text-accent-ink/60">Email address</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-1 block truncate font-display text-lg text-accent-ink underline-offset-4 hover:underline"
                  >
                    {member.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {member.bio && (
          <p className="prose-lab max-w-xl text-sm leading-relaxed text-muted">{member.bio}</p>
        )}
      </div>
    </div>
  );
}
