"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../api";
import { AdminButton, AdminField, AdminInput, AdminTextarea } from "../ui-admin";

type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number";
  required?: boolean;
  hint?: string;
};

const FIELD_MAPS: Record<string, FieldDef[]> = {
  announcements: [
    { name: "title", label: "Title", type: "text", required: true, hint: "Max 200 chars" },
    { name: "body", label: "Body", type: "textarea", required: true, hint: "Max 5000 chars" },
  ],
  members: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "role", label: "Role", type: "text" },
    { name: "bio", label: "Bio", type: "textarea" },
    { name: "photo", label: "Photo URL", type: "text" },
  ],
  posts: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "content", label: "Content", type: "textarea", required: true },
    { name: "author", label: "Author", type: "text" },
  ],
  about: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "content", label: "Content", type: "textarea", required: true },
  ],
  videos: [
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "youtubeUrl",
      label: "YouTube URL",
      type: "text",
      required: true,
      hint: "youtube.com or youtu.be links only",
    },
    { name: "description", label: "Description", type: "textarea" },
  ],
};

type Row = { id: number; [key: string]: unknown };

function labelOf(doc: Row) {
  return String(doc.title || doc.name || "");
}
function metaOf(doc: Row, defs: FieldDef[]) {
  const m = defs[1];
  if (!m) return "";
  const v = doc[m.name];
  return v ? String(v).slice(0, 80) : "";
}
function emptyForm(defs: FieldDef[]) {
  const f: Record<string, string> = {};
  for (const d of defs) f[d.name] = "";
  return f;
}
function toForm(doc: Row, defs: FieldDef[]) {
  const f: Record<string, string> = {};
  for (const d of defs) {
    const v = doc[d.name];
    f[d.name] = v === undefined || v === null ? "" : String(v);
  }
  return f;
}

export function CrudManager({ collection }: { collection: string }) {
  const defs = FIELD_MAPS[collection];
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string>>(emptyForm(defs));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api(`/admin/${collection}`);
      setRows(data);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [collection]);

  useEffect(() => {
    load();
    setEditing(null);
    setForm(emptyForm(defs));
  }, [collection, load, defs]);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm(defs));
    setMessage(null);
    setError(null);
  };

  const startEdit = (doc: Row) => {
    setEditing(doc);
    setForm(toForm(doc, defs));
    setMessage(null);
    setError(null);
  };

  const save = async () => {
    const missing = defs.find((d) => d.required && !form[d.name]);
    if (missing) {
      setError(`"${missing.label}" is required`);
      return;
    }
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const body: Record<string, unknown> = {};
      for (const d of defs) {
        body[d.name] = d.type === "number" ? Number(form[d.name]) : form[d.name];
      }
      if (editing) {
        await api(`/admin/${collection}/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await api(`/admin/${collection}`, { method: "POST", body: JSON.stringify(body) });
      }
      setMessage(editing ? "Updated." : "Created.");
      startCreate();
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (doc: Row) => {
    if (!window.confirm(`Delete "${labelOf(doc) || doc.id}"?`)) return;
    try {
      await api(`/admin/${collection}/${doc.id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const title = collection[0].toUpperCase() + collection.slice(1);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl tracking-tight">{title}</h2>
          <p className="mt-1 font-mono-x text-xs text-muted">{rows.length} records</p>
        </div>
        <AdminButton onClick={startCreate}>
          <Plus className="size-3.5" /> New
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
          {editing ? `Editing: ${labelOf(editing)}` : `New ${collection.slice(0, -1)}`}
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {defs.map((d) => (
            <div key={d.name} className={d.type === "textarea" ? "sm:col-span-2" : ""}>
              <AdminField label={d.label} hint={d.hint}>
                {d.type === "textarea" ? (
                  <AdminTextarea
                    value={form[d.name]}
                    onChange={(e) => setForm({ ...form, [d.name]: e.target.value })}
                    rows={d.name === "content" || d.name === "bio" ? 6 : 3}
                  />
                ) : (
                  <AdminInput
                    type={d.type === "number" ? "number" : "text"}
                    value={form[d.name]}
                    onChange={(e) => setForm({ ...form, [d.name]: e.target.value })}
                  />
                )}
              </AdminField>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <AdminButton onClick={save} disabled={busy}>
            {busy ? "Saving…" : editing ? "Update" : "Create"}
          </AdminButton>
          {editing && <AdminButton onClick={startCreate} variant="outline">Cancel</AdminButton>}
        </div>
      </div>

      <ul className="divide-y divide-line">
        {rows.map((doc) => (
          <li key={doc.id} className="flex items-center gap-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg tracking-tight">
                {labelOf(doc) || "Untitled"}
              </p>
              {metaOf(doc, defs) && (
                <p className="truncate font-mono-x text-xs text-muted">{metaOf(doc, defs)}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => startEdit(doc)}
              className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent2 hover:text-accent2"
              aria-label="Edit"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => remove(doc)}
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
