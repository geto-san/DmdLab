"use client";

import { Pencil, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useEditMode } from "./edit-mode";
import { useSidePanel } from "./side-panel-context";
import { toSafeString } from "@/lib/to-string";

export function EditItem({
  collection,
  blockKey,
  item,
  redirectTo,
  onDeleted,
  children,
}: Readonly<{
  collection: string;
  blockKey?: string;
  item: Record<string, unknown>;
  redirectTo?: string;
  onDeleted?: () => void;
  children: ReactNode;
}>) {
  const { enabled } = useEditMode();
  const { openPanel } = useSidePanel();

  if (!enabled) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <button
        type="button"
        onClick={() => openPanel({ collection, item, blockKey, redirectTo, onDeleted })}
        aria-label={`Edit ${toSafeString(item.title || item.name, collection)}`}
        title="Edit"
        className="absolute right-3 top-3 z-30 flex size-9 items-center justify-center rounded-full border border-line bg-bg/90 text-ink shadow-sm backdrop-blur transition-colors hover:border-accent2 hover:text-accent2"
      >
        <Pencil className="size-4" />
      </button>
    </div>
  );
}

export function AddButton({
  collection,
  blockKey,
  label,
  className = "",
}: Readonly<{
  collection: string;
  blockKey?: string;
  label: string;
  className?: string;
}>) {
  const { enabled } = useEditMode();
  const { openPanel } = useSidePanel();

  if (!enabled) return null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => openPanel({ collection, item: null, blockKey })}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-accent2/60 px-4 py-2 font-mono-x text-xs text-accent2 transition-colors hover:bg-accent2/10"
      >
        <Plus className="size-3.5" /> {label}
      </button>
    </div>
  );
}
