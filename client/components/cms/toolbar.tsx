"use client";

import { PencilLine } from "lucide-react";
import { useEditMode } from "./edit-mode";

export function EditModeToggle() {
  const { enabled, setEnabled, isAdmin } = useEditMode();

  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      aria-pressed={enabled}
      title="Toggle edit mode"
      className={`flex size-10 items-center justify-center gap-1.5 rounded-full border px-3 font-mono-x text-[0.6875rem] transition-colors ${
        enabled
          ? "border-accent bg-accent text-accent-ink"
          : "border-line text-muted hover:border-accent2 hover:text-accent2"
      }`}
    >
      <PencilLine className="size-3.5" />
      <span className="hidden lg:inline">{enabled ? "Editing" : "Edit"}</span>
    </button>
  );
}
