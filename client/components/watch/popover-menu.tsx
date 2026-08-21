"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type MenuItem = {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onSelect: () => void;
};

export function PopoverMenu({
  trigger,
  triggerLabel,
  items,
  align = "right",
  side = "bottom",
  buttonClass = "",
}: Readonly<{
  trigger: ReactNode;
  triggerLabel: string;
  items: MenuItem[];
  align?: "left" | "right";
  side?: "top" | "bottom";
  buttonClass?: string;
}>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={buttonClass}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute z-30 w-40 rounded-2xl border border-line bg-surface p-1.5 shadow-soft-lg ${
            side === "top" ? "bottom-full mb-2" : "top-full mt-2"
          } ${align === "right" ? "right-0" : "left-0"}`}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-ink/5 ${
                item.active ? "font-semibold text-accent2" : "text-ink"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
