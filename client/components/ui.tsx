import Link from "next/link";
import type { ReactNode } from "react";
import {
  Sparkles,
  Brain,
  Target,
  Wrench,
  Users,
  BookOpen,
  FlaskConical,
  FlaskRound,
  DollarSign,
  FileText,
  Award,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  brain: Brain,
  target: Target,
  wrench: Wrench,
  users: Users,
  bookopen: BookOpen,
  flaskconical: FlaskConical,
  flaskround: FlaskRound,
  dollarsign: DollarSign,
  filetext: FileText,
  award: Award,
};

export function resolveIcon(name?: string, fallback: LucideIcon = Sparkles) {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return fallback;
}

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "accent" | "outline" | "ghost";
  className?: string;
  icon?: boolean;
};

export function Button({ href, children, variant = "accent", className = "", icon = false }: ButtonProps) {
  const base = [
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono-x transition-all duration-300",
    variant === "accent" && "bg-accent text-accent-ink hover:bg-accent2 hover:text-accent2-ink",
    variant === "outline" && "border border-line text-ink hover:border-ink",
    variant === "ghost" && "text-ink hover:text-accent2",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {children}
      {icon && (
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={base}>
        {inner}
      </Link>
    );
  }
  return <button className={base}>{inner}</button>;
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 font-mono-x text-[0.6875rem] text-muted ${className}`}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 flex items-center gap-3 font-mono-x text-muted">
      <span className="inline-block size-1.5 rounded-full bg-accent" />
      {children}
    </p>
  );
}

export function SectionHeader({
  index,
  title,
  lead,
  action,
}: {
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        {index && (
          <p className="mb-4 font-mono-x text-muted">
            <span className="mr-2 text-accent2">{index}</span>/
          </p>
        )}
        <h2 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h2>
        {lead && <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
