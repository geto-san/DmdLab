"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../api";
import { AdminButton, AdminField, AdminInput, AdminTextarea } from "../ui-admin";

type Block = {
  id: number;
  key: string;
  section: string;
  title: string;
  enabled: boolean;
  payload: Record<string, unknown>;
};

const EMPTY = { key: "", section: "home", title: "", enabled: true, payload: "{}" };

export function ContentManager() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editing, setEditing] = useState<Block | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api("/admin/content");
      setBlocks(data);
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
    setMessage(null);
    setError(null);
  };

  const startEdit = (b: Block) => {
    setEditing(b);
    setForm({
      key: b.key,
      section: b.section,
      title: b.title,
      enabled: b.enabled,
      payload: JSON.stringify(b.payload || {}, null, 2),
    });
    setMessage(null);
    setError(null);
  };

  const save = async () => {
    let parsedPayload: Record<string, unknown> = {};
    try {
      parsedPayload = form.payload.trim() ? JSON.parse(form.payload) : {};
    } catch {
      setError("Payload is not valid JSON.");
      return;
    }
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const body = JSON.stringify({
        key: form.key,
        section: form.section,
        title: form.title,
        enabled: form.enabled,
        payload: parsedPayload,
      });
      if (editing) {
        await api(`/admin/content/${editing.id}`, { method: "PUT", body });
      } else {
        await api("/admin/content", { method: "POST", body });
      }
      setMessage(editing ? "Block updated." : "Block created.");
      startCreate();
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (b: Block) => {
    if (!window.confirm(`Delete content block "${b.key}"?`)) return;
    try {
      await api(`/admin/content/${b.id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl tracking-tight">Content blocks</h2>
          <p className="mt-1 font-mono-x text-xs text-muted">
            Keyed JSON payloads merged over the site&apos;s defaults
          </p>
        </div>
        <AdminButton onClick={startCreate}>
          <Plus className="size-3.5" /> New block
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

      <div className="mb-10 rounded-2xl border border-line bg-bg p-6">
        <p className="mb-5 font-mono-x text-xs text-muted">
          {editing ? `Editing: ${editing.key}` : "New block"}
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          <AdminField label="Key" hint="lowercase-alphanumeric-dashes">
            <AdminInput
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              placeholder="hero"
            />
          </AdminField>
          <AdminField label="Section">
            <AdminInput
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              placeholder="home"
            />
          </AdminField>
          <AdminField label="Title">
            <AdminInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Hero section"
            />
          </AdminField>
          <div className="sm:col-span-3">
            <AdminField label="Payload (JSON)">
              <AdminTextarea
                value={form.payload}
                onChange={(e) => setForm({ ...form, payload: e.target.value })}
                rows={10}
                className="font-mono text-xs leading-relaxed"
              />
            </AdminField>
          </div>
          <label className="flex items-center gap-3 sm:col-span-3">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              className="size-4 accent-[var(--accent2)]"
            />
            <span className="font-mono-x text-xs text-muted">
              Enabled (served to the public site)
            </span>
          </label>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <AdminButton onClick={save} disabled={busy || !form.key}>
            {busy ? "Saving…" : editing ? "Update block" : "Create block"}
          </AdminButton>
          {editing && <AdminButton onClick={startCreate} variant="outline">Cancel</AdminButton>}
        </div>
      </div>

      <ul className="divide-y divide-line">
        {blocks.map((b) => (
          <li key={b.id} className="flex items-center gap-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate font-display text-lg tracking-tight">
                <span
                  className={`size-2 rounded-full ${b.enabled ? "bg-accent" : "bg-muted/40"}`}
                  aria-hidden
                />
                {b.key}
                <span className="font-mono-x text-xs text-muted">· {b.section}</span>
              </p>
              {b.title && (
                <p className="truncate font-mono-x text-xs text-muted">{b.title}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => startEdit(b)}
              className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent2 hover:text-accent2"
              aria-label="Edit"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => remove(b)}
              className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-red-500/60 hover:text-red-500"
              aria-label="Delete"
            >
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
