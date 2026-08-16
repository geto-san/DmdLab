"use client";

import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function AdminButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger";
}) {
  const styles = {
    primary: "bg-accent text-accent-ink hover:bg-accent2 hover:text-accent2-ink",
    outline: "border border-line text-ink hover:border-ink",
    danger: "border border-red-500/40 text-red-500 hover:bg-red-500/10",
  }[variant];
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono-x text-xs transition-all duration-300 disabled:opacity-60 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent2 ${className}`}
    />
  );
}

export function AdminTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full resize-y rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent2 ${className}`}
    />
  );
}

export function AdminField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono-x text-xs text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
