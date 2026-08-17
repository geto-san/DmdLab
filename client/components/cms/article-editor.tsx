"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "./api";
import { FieldInput, type FieldDef } from "./fields";
import { Modal } from "./modal";
import { ErrorBanner, EditorActions } from "./editor-ui";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "text", hint: "Short summary shown in cards" },
  { name: "author", label: "Author", type: "text" },
  { name: "category", label: "Category", type: "text" },
  { name: "tags", label: "Tags", type: "tags", hint: "Comma-separated" },
  { name: "content", label: "Content", type: "textarea", hint: "Use ## and ### for headings; blank lines separate paragraphs" },
];

export function ArticleEditorModal({
  article,
  redirectTo,
  onClose,
}: {
  article: Record<string, unknown> | null;
  redirectTo?: string;
  onClose: () => void;
}) {
  const isEditing = article != null && article.id != null;
  const router = useRouter();

  const [form, setForm] = useState<Record<string, string | boolean>>(() => {
    const init: Record<string, string | boolean> = {};
    for (const f of FIELDS) {
      const v = article?.[f.name];
      if (f.type === "tags") init[f.name] = Array.isArray(v) ? (v as string[]).join(", ") : "";
      else if (f.type === "checkbox") init[f.name] = v === true;
      else init[f.name] = (v as string | undefined) ?? "";
    }
    return init;
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview] = useState<string | null>(
    isEditing ? String(article?.image || "") || null : null
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      for (const f of FIELDS) {
        if (f.type === "tags") {
          String(form[f.name] || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((t) => fd.append("tags", t));
        } else {
          fd.set(f.name, String(form[f.name] ?? ""));
        }
      }
      if (file) fd.set("image", file);

      if (isEditing) {
        await api(`/admin/articles/${article.id}`, { method: "PUT", body: fd });
      } else {
        await api("/admin/articles", { method: "POST", body: fd });
      }
      router.refresh();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!isEditing) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/admin/articles/${article.id}`, { method: "DELETE" });
      router.refresh();
      if (redirectTo) router.push(redirectTo);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={`${isEditing ? "Edit" : "Add"} article`} onClose={onClose}>
      <div className="space-y-5">
        {FIELDS.map((f) => (
          <label key={f.name} className="block">
            <span className="mb-2 block font-mono-x text-xs text-muted">{f.label}</span>
            <FieldInput
              def={f}
              value={form[f.name] ?? ""}
              onChange={(v) => setForm((p) => ({ ...p, [f.name]: v }))}
            />
            {f.hint && <span className="mt-1.5 block text-xs text-muted">{f.hint}</span>}
          </label>
        ))}

        <div>
          <span className="mb-2 block font-mono-x text-xs text-muted">Cover image</span>
          {(preview || file) && (
            <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-xl bg-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file ? URL.createObjectURL(file) : (preview as string)}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-muted file:mr-4 file:cursor-pointer file:rounded-full file:border-none file:bg-accent file:px-4 file:py-2 file:font-mono-x file:text-xs file:text-accent-ink"
          />
          {isEditing && !file && (
            <p className="mt-1.5 text-xs text-muted">
              Leave empty to keep the current image. A new one replaces it.
            </p>
          )}
        </div>

        {error && <ErrorBanner message={error} />}

        <EditorActions
          onSave={save}
          saveLabel={isEditing ? "Save changes" : "Add"}
          busy={busy}
          onDelete={isEditing ? remove : undefined}
        />
      </div>
    </Modal>
  );
}
