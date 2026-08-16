"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, LogOut, Megaphone, Radio, SlidersHorizontal, Users, BookOpen, Home } from "lucide-react";
import { ArticlesManager } from "./sections/articles";
import { CrudManager } from "./sections/crud";
import { ContentManager } from "./sections/content";

const TABS = [
  { id: "articles", label: "Articles", icon: FileText },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "members", label: "Members", icon: Users },
  { id: "posts", label: "Posts", icon: BookOpen },
  { id: "about", label: "About", icon: Radio },
  { id: "videos", label: "Videos", icon: SlidersHorizontal },
  { id: "content", label: "Content blocks", icon: Home },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Dashboard({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>("articles");

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 font-mono-x text-muted">Signed in as {username}</p>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Admin dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono-x text-xs transition-colors hover:border-ink"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono-x text-xs transition-colors hover:border-red-500/60 hover:text-red-500"
          >
            <LogOut className="size-3.5" /> Log out
          </button>
        </div>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-mono-x text-xs transition-all duration-300 ${
                active
                  ? "bg-accent text-accent-ink"
                  : "border border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              <Icon className="size-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-blob border border-line bg-surface p-6 sm:p-10">
        {tab === "articles" && <ArticlesManager />}
        {tab === "content" && <ContentManager />}
        {(tab === "announcements" || tab === "members" || tab === "posts" || tab === "about" || tab === "videos") && (
          <CrudManager collection={tab} />
        )}
      </div>
    </section>
  );
}
