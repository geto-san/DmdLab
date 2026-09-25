"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

export function SidePanel({
  title,
  onClose,
  wide = false,
  children,
}: Readonly<{
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: ReactNode;
}>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    document.body.style.overflow = "hidden";
    const previouslyFocused = document.activeElement as HTMLElement | null;
    if (dialog && !dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(e) => {
        // The browser's own Escape-to-close; hand control back to the
        // parent (which conditionally renders this component) instead of
        // letting the dialog close itself out of sync with React state.
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 z-[100] m-0 flex h-full max-h-none w-full max-w-none border-none bg-transparent p-0"
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`absolute right-0 top-0 flex h-full w-full flex-col border-l border-line bg-surface shadow-2xl animate-in slide-in-from-right ${
          wide ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          <h2 id={titleId} className="font-display text-xl tracking-tight">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </dialog>
  );
}
