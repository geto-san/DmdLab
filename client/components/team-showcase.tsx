"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail, MapPin, Clock } from "lucide-react";
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

function splitName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return [parts[0] ?? "", ""];
  return [parts[0] ?? "", parts.slice(1).join(" ")];
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
  const [first, last] = splitName(member.name);

  const go = (dir: 1 | -1) => setActive((prev) => (prev + dir + total) % total);

  return (
    <div className="space-y-12">
      {/* Main showcase area */}
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
        {/* Left: Accent card + avatar row */}
        <div className="flex flex-col items-center gap-8">
          {/* Accent card */}
          <div className="relative w-full max-w-md">
            <div className="relative flex flex-col items-center overflow-hidden rounded-3xl bg-accent px-8 pb-10 pt-12">
              <div className="relative mb-8 size-40 overflow-hidden rounded-full border-4 border-bg/20 shadow-lg lg:size-48">
                <Photo src={member.photo} name={member.name} />
              </div>

              <div className="text-center">
                <h3 className="font-display text-3xl leading-[1.1] tracking-tight text-accent-ink sm:text-4xl">
                  {member.name}
                </h3>
                {member.role && (
                  <p className="mt-2 font-mono-x text-xs text-accent-ink/70">{member.role}</p>
                )}
              </div>
            </div>

            {/* Navigation arrows */}
            {total > 1 && (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous member"
                  className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <span className="font-mono-x text-xs text-muted">
                  <span className="text-ink">{String(active + 1).padStart(2, "0")}</span> /{" "}
                  {String(total).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next member"
                  className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )}

            {/* Edit pencil for the selected member */}
            <div className="absolute right-3 top-3 z-10">
              <EditItem collection="members" item={member as unknown as Record<string, unknown>}>
                <span />
              </EditItem>
            </div>
          </div>

          {/* Avatar row */}
          {total > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto px-2 pb-2">
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
        </div>

        {/* Right: Detail card */}
        <div className="flex flex-col gap-5">
          <div className="rounded-3xl border border-line bg-surface p-8">
            <h3 className="mb-6 font-display text-3xl leading-[1.05] tracking-tight sm:text-5xl">
              <em className="text-accent2">{first}</em> {last}
            </h3>

            <div className="space-y-4">
              {member.experience && (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Clock className="size-4 text-accent2" />
                  </div>
                  <div>
                    <p className="font-mono-x text-[0.6875rem] text-muted">Experience</p>
                    <p className="text-sm">{member.experience}</p>
                  </div>
                </div>
              )}

              {member.location && (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <MapPin className="size-4 text-accent2" />
                  </div>
                  <div>
                    <p className="font-mono-x text-[0.6875rem] text-muted">Location</p>
                    <p className="text-sm">{member.location}</p>
                  </div>
                </div>
              )}

              {member.email && (
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Mail className="size-4 text-accent2" />
                  </div>
                  <div>
                    <p className="font-mono-x text-[0.6875rem] text-muted">Email</p>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-accent2 underline-offset-4 hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {member.bio && <p className="prose-lab mt-6 max-w-lg">{member.bio}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
