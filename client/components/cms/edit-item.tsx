"use client";

import { Pencil, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ArticleEditorModal } from "./article-editor";
import { ContentEditorModal } from "./content-editor";
import { CollectionEditorModal } from "./editor";
import { VideoEditorModal } from "./video-editor";
import { useEditMode } from "./edit-mode";

function EditorSwitch({
  collection,
  blockKey,
  item,
  redirectTo,
  onDeleted,
  onClose,
}: {
  collection: string;
  blockKey?: string;
  item: Record<string, unknown> | null;
  redirectTo?: string;
  onDeleted?: () => void;
  onClose: () => void;
}) {
  if (collection === "article") {
    return <ArticleEditorModal article={item} redirectTo={redirectTo} onClose={onClose} />;
  }
  if (collection === "content") {
    return <ContentEditorModal blockKey={blockKey as string} onClose={onClose} />;
  }
  if (collection === "video") {
    return (
      <VideoEditorModal
        video={{ _id: String(item?._id || ""), title: String(item?.title || "") }}
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
  redirectTo,
  onDeleted,
  children,
}: {
  collection: string;
  blockKey?: string;
  item: Record<string, unknown>;
  redirectTo?: string;
  onDeleted?: () => void;
  children: ReactNode;
}) {
  const { enabled } = useEditMode();
  const [open, setOpen] = useState(false);

  if (!enabled) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Edit ${String(item.title || item.name || collection)}`}
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
          redirectTo={redirectTo}
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
}: {
  collection: string;
  blockKey?: string;
  label: string;
  className?: string;
}) {
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
