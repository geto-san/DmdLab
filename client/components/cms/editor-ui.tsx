"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function ErrorBanner({ message }: Readonly<{ message: string }>) {
  return (
    <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
      {message}
    </p>
  );
}

export function EditorActions({
  onSave,
  saveLabel,
  busyLabel = "Saving…",
  busy,
  onDelete,
  deleteLabel = "Delete",
}: Readonly<{
  onSave: () => void;
  saveLabel: string;
  busyLabel?: string;
  busy: boolean;
  onDelete?: () => void;
  deleteLabel?: string;
}>) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <button
        type="button"
        onClick={onSave}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-mono-x text-xs text-accent-ink transition-all duration-300 hover:bg-accent2 hover:text-accent2-ink disabled:opacity-60"
      >
        {busy ? busyLabel : saveLabel}
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-6 py-2.5 font-mono-x text-xs text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-60"
        >
          {busy && <Loader2 className="size-3.5 animate-spin" />}
          {confirmDelete ? "Click again to confirm" : deleteLabel}
        </button>
      )}
    </div>
  );
}
