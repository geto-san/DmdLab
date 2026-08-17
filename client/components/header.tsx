"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, X } from "lucide-react";
import { EditModeToggle } from "@/components/cms/toolbar";

const NAV_LINKS = [
  { label: "Articles", to: "/articles" },
  { label: "Videos", to: "/videos" },
  { label: "Research", to: "/research" },
  { label: "Publications", to: "/publications" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const isDark = mounted && resolvedTheme === "dark";
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass hairline-b" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2" aria-label="DeepMinds Research Lab home">
            <span className="font-display text-2xl leading-none tracking-tight">DM·Lab</span>
            <span className="font-mono-x hidden text-muted sm:inline">DeepMinds Research</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`font-mono-x transition-colors hover:text-accent2 ${
                  pathname.startsWith(link.to) ? "text-ink" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <EditModeToggle />
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2"
              aria-label="Toggle theme"
            >
              {mounted && isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent2 hover:text-accent2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-bg transition-all duration-500 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <span className="font-display text-2xl leading-none tracking-tight">DM·Lab</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex size-10 items-center justify-center rounded-full border border-line"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Mobile">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.to}
              href={link.to}
              className="flex items-baseline gap-4 border-b border-line py-5"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="font-mono-x text-xs text-accent2">0{i + 1}</span>
              <span className="font-display text-5xl leading-none tracking-tight transition-colors hover:text-accent2">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="px-8 pb-10">
          <Link href="/manage/login" className="font-mono-x text-muted hover:text-accent2">
            Sign in →
          </Link>
        </div>
      </div>
    </>
  );
}
