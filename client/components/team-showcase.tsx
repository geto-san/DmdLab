import Image from "next/image";
import { Github, Globe, Linkedin } from "lucide-react";
import { EditItem } from "@/components/cms/edit-item";

type Member = {
  id: number;
  name: string;
  role?: string | null;
  photo?: string | null;
  linkedin?: string | null;
  github?: string | null;
  otherUrl?: string | null;
};

const SOCIAL_ICONS = [
  { key: "linkedin" as const, Icon: Linkedin, label: "LinkedIn" },
  { key: "github" as const, Icon: Github, label: "GitHub" },
  { key: "otherUrl" as const, Icon: Globe, label: "Website" },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function TeamShowcase({
  members,
}: Readonly<{ members: Member[] }>) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-20">
      {members.map((m, i) => (
        <EditItem
          key={m.id}
          collection="members"
          item={m as unknown as Record<string, unknown>}
        >
          <div className={i % 3 === 1 ? "lg:mt-16" : ""}>
            <div className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-blob bg-surface shadow-soft transition-shadow duration-300 group-hover:shadow-soft-lg">
                {m.photo ? (
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 45vw"
                    className="object-cover grayscale-[65%] contrast-[1.05] transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:grayscale-0"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent2/20 to-accent2/5">
                    <span className="font-display text-4xl text-muted">{initials(m.name)}</span>
                  </div>
                )}
              </div>
              <p className="mt-4 font-display text-xl leading-tight tracking-tight transition-colors group-hover:text-accent2">
                {m.name}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {m.role && (
                  <p className="font-mono-x text-[0.6875rem] text-accent2">{m.role}</p>
                )}
                {SOCIAL_ICONS.filter(({ key }) => m[key]).map(({ key, Icon, label }) => (
                  <a
                    key={key}
                    href={m[key] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on ${label}`}
                    className="text-muted transition-colors hover:text-accent2"
                  >
                    <Icon className="size-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </EditItem>
      ))}
    </div>
  );
}
