"use client";

import { Pencil, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ContentEditorModal } from "./content-editor";
import { CollectionEditorModal } from "./editor";
import { VideoEditorModal } from "./video-editor";
import { useEditMode } from "./edit-mode";
import { toSafeString } from "@/lib/to-string";

function EditorSwitch({
  collection,
  blockKey,
  item,
  onDeleted,
  onClose,
}: Readonly<{
  collection: string;
  blockKey?: string;
  item: Record<string, unknown> | null;
  onDeleted?: () => void;
  onClose: () => void;
}>) {
  if (collection === "content") {
    return <ContentEditorModal blockKey={blockKey as string} onClose={onClose} />;
  }
  if (collection === "video") {
    return (
      <VideoEditorModal
        video={{ _id: toSafeString(item?._id), title: toSafeString(item?.title) }}
        onDeleted={onDeleted}
        onClose={onClose}
      />
    );
  }
  return <CollectionEditorModal collection={collection} item={item} onClose={onClose} />;
}

export function EditItem({
  collection,
  blockKey,
  item,
  onDeleted,
  children,
}: Readonly<{
  collection: string;
  blockKey?: string;
  item: Record<string, unknown>;
  onDeleted?: () => void;
  children: ReactNode;
}>) {
  const { enabled } = useEditMode();
  const [open, setOpen] = useState(false);

  if (!enabled) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Edit ${toSafeString(item.title || item.name, collection)}`}
        title="Edit"
        className="absolute right-3 top-3 z-30 flex size-9 items-center justify-center rounded-full border border-line bg-bg/90 text-ink shadow-sm backdrop-blur transition-colors hover:border-accent2 hover:text-accent2"
      >
        <Pencil className="size-4" />
      </button>
      {open && (
        <EditorSwitch
          collection={collection}
          blockKey={blockKey}
          item={item}
          onDeleted={onDeleted}
          onClose={() => setOpen(false)}
        />
      )}
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
  const [open, setOpen] = useState(false);

  if (!enabled) return null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-accent2/60 px-4 py-2 font-mono-x text-xs text-accent2 transition-colors hover:bg-accent2/10"
      >
        <Plus className="size-3.5" /> {label}
      </button>
      {open && (
        <EditorSwitch collection={collection} blockKey={blockKey} item={null} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
