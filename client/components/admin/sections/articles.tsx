"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../api";
import { AdminButton, AdminField, AdminInput, AdminTextarea } from "../ui-admin";
import { ARTICLE_CATEGORIES } from "@/lib/data";

type Article = {
  id: number;
  title: string;
  description?: string;
  content?: string;
  author?: string;
  category?: string;
  date?: string;
  tags?: string[];
  image?: string;
};

const EMPTY = {
  title: "",
  description: "",
  content: "",
  author: "",
  category: "Research",
  tags: "",
};

export function ArticlesManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState<Record<string, string>>(EMPTY);
  const [image, setImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api("/admin/articles");
      setArticles(data);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setImage(null);
    setMessage(null);
    setError(null);
  };

  const startEdit = (a: Article) => {
    setEditing(a);
    setForm({
      title: a.title,
      description: a.description || "",
      content: a.content || "",
      author: a.author || "",
      category: a.category || "Research",
      tags: (a.tags || []).join(", "),
    });
    setImage(null);
    setMessage(null);
    setError(null);
  };

  const save = async () => {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const fd = new FormData();
      for (const [k, v] of Object.entries(form)) {
        if (k === "tags") {
          const tags = v.split(",").map((t) => t.trim()).filter(Boolean);
          for (const tag of tags) fd.append("tags", tag);
        } else {
          fd.append(k, v);
        }
      }
      if (image) fd.append("image", image);
      if (editing) {
        await api(`/admin/articles/${editing.id}`, { method: "PUT", body: fd });
      } else {
        await api("/admin/articles", { method: "POST", body: fd });
      }
      setMessage(editing ? "Article updated." : "Article created.");
      startCreate();
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (a: Article) => {
    if (!window.confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try {
      await api(`/admin/articles/${a.id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl tracking-tight">Articles</h2>
          <p className="mt-1 font-mono-x text-xs text-muted">
            {articles.length} published
          </p>
        </div>
        <AdminButton onClick={startCreate}>
          <Plus className="size-3.5" /> New article
        </AdminButton>
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
          {error}
        </p>
      )}

      {message && (
        <p className="mb-6 rounded-xl border border-accent2/40 bg-accent2/10 px-4 py-2.5 text-sm text-accent2">
          {message}
        </p>
      )}

      {/* Editor */}
      <div className="mb-10 rounded-2xl border border-line bg-bg p-6">
        <p className="mb-5 font-mono-x text-xs text-muted">
          {editing ? `Editing: ${editing.title}` : "New article"}
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Title" hint="Required">
            <AdminInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Article title"
            />
          </AdminField>
          <AdminField label="Author">
            <AdminInput
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Lab Admin"
            />
          </AdminField>
          <AdminField label="Category">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent2"
            >
              {ARTICLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Tags" hint="Comma-separated">
            <AdminInput
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="intro, ml, project"
            />
          </AdminField>
          <div className="sm:col-span-2">
            <AdminField label="Description" hint="Short summary shown in cards">
              <AdminInput
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="One or two sentences…"
              />
            </AdminField>
          </div>
          <div className="sm:col-span-2">
            <AdminField label="Content" hint="Use ## and ### for headings; blank lines separate paragraphs">
              <AdminTextarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
                placeholder="Full article body…"
              />
            </AdminField>
          </div>
          <div className="sm:col-span-2">
            <AdminField label="Cover image" hint="JPEG, PNG, WEBP, or GIF · max 10 MB">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="block w-full text-sm text-muted file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-surface file:px-4 file:py-2.5 file:font-mono-x file:text-xs file:text-ink"
              />
            </AdminField>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <AdminButton onClick={save} disabled={busy || !form.title}>
            {busy ? "Saving…" : editing ? "Update article" : "Publish article"}
          </AdminButton>
          {editing && <AdminButton onClick={startCreate} variant="outline">Cancel</AdminButton>}
        </div>
      </div>

      {/* List */}
      <ul className="divide-y divide-line">
        {articles.map((a) => (
          <li key={a.id} className="flex items-center gap-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg tracking-tight">{a.title}</p>
              <p className="font-mono-x text-xs text-muted">
                {a.category} · {new Date(a.date || "").toLocaleDateString("en-US")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => startEdit(a)}
              className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent2 hover:text-accent2"
              aria-label={`Edit ${a.title}`}
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => remove(a)}
              className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-red-500/60 hover:text-red-500"
              aria-label={`Delete ${a.title}`}
            >
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
