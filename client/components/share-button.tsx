"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({ className = "" }: Readonly<{ className?: string }>) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently, nothing else to do.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 font-mono-x text-[0.6875rem] text-ink transition-colors hover:border-ink ${className}`}
    >
      {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
      {copied ? "Copied" : "Share"}
    </button>
  );
}
