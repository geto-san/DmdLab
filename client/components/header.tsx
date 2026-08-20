"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Inbox, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { useEditMode } from "@/components/cms/edit-mode";

const NAV_LINKS = [
  { label: "Articles", to: "/articles" },
  { label: "Videos", to: "/videos" },
  { label: "Research", to: "/research" },
  { label: "Publications", to: "/publications" },
  { label: "Team", to: "/team" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { isAdmin } = useEditMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    focusable?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const trigger = menuTriggerRef.current;
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [menuOpen]);

  const isDark = mounted && resolvedTheme === "dark";
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass hairline-b shadow-soft" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2" aria-label="DeepMinds Research Lab home">
            <span className="font-display text-2xl leading-none tracking-tight">DM·Lab</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex flex-col items-center gap-2 py-1 font-mono-x transition-colors hover:text-accent2 ${
                    isActive ? "text-ink" : "text-muted"
                  }`}
                >
                  {link.label}
                  <span
                    className={`h-1 w-1 rounded-full bg-accent2 transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/manage/applications"
                title="Team applications"
                aria-label="Team applications"
                className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2"
              >
                <Inbox className="size-4" />
              </Link>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2"
              >
                <LogOut className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2"
              aria-label="Toggle theme"
            >
              {mounted && isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              ref={menuTriggerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        open
        className={`fixed inset-0 z-[60] m-0 flex h-dvh max-h-none w-dvw max-w-none flex-col border-0 bg-bg p-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
        }`}
        aria-label="Menu"
      >
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <span className="font-display text-2xl leading-none tracking-tight">DM·Lab</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex size-11 items-center justify-center rounded-full border border-line transition-colors hover:border-accent2 hover:text-accent2"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Mobile">
          {NAV_LINKS.map((link, i) => {
            const isActive = pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                href={link.to}
                aria-current={isActive ? "page" : undefined}
                className="flex items-baseline gap-4 border-b border-line py-5"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="font-mono-x text-xs text-accent2">0{i + 1}</span>
                <span
                  className={`font-display text-5xl leading-none tracking-tight transition-colors hover:text-accent2 ${
                    isActive ? "text-accent2" : ""
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="px-8 pb-10">
          {isAdmin ? (
            <button
              type="button"
              onClick={handleLogout}
              className="font-mono-x text-muted hover:text-accent2"
            >
              Log out →
            </button>
          ) : (
            <Link href="/manage/login" className="font-mono-x text-muted hover:text-accent2">
              Sign in →
            </Link>
          )}
        </div>
      </dialog>
    </>
  );
}
