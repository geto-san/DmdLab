"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: Readonly<{
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onCancel={(e) => {
        // Escape triggers the browser's native close; intercept it so the
        // parent's React state (which controls whether this is mounted at
        // all) stays the single source of truth.
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 z-[100] m-0 flex h-dvh max-h-none w-dvw max-w-none items-start justify-center overflow-y-auto border-0 bg-ink/60 p-5 backdrop-blur-sm backdrop:bg-transparent"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`my-10 w-full rounded-blob border border-line bg-surface p-6 sm:p-8 ${
          wide ? "max-w-4xl" : "max-w-2xl"
        }`}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
