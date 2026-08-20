import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "accent" | "outline" | "ghost";
  className?: string;
  icon?: boolean;
};

export function Button({ href, children, variant = "accent", className = "", icon = false }: Readonly<ButtonProps>) {
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
  return (
    <button type="button" className={base}>
      {inner}
    </button>
  );
}

export function Badge({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 font-mono-x text-[0.6875rem] text-muted ${className}`}
    >
      {children}
    </span>
  );
}

