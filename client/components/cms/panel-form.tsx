"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "./api";
import { COLLECTION_FIELDS, FieldInput, FieldLabel } from "./fields";
import { ErrorBanner, EditorActions } from "./editor-ui";
import { useSidePanel } from "./side-panel-context";

export function PanelForm({
  collection,
  item,
  onDeleteRedirect,
}: Readonly<{
  collection: string;
  item: Record<string, unknown> | null;
  onDeleteRedirect?: string;
}>) {
  const fields = COLLECTION_FIELDS[collection] || [];
  const isEditing = item?.id != null;
  const router = useRouter();
  const { closePanel } = useSidePanel();

  const [form, setForm] = useState<Record<string, string | boolean>>(() => {
    const init: Record<string, string | boolean> = {};
    for (const f of fields) {
      const v = item?.[f.name];
      if (f.type === "json") init[f.name] = JSON.stringify(v ?? {}, null, 2);
      else if (f.type === "tags") init[f.name] = Array.isArray(v) ? (v as string[]).join(", ") : "";
      else if (f.type === "checkbox") init[f.name] = v === true;
      else init[f.name] = (v as string | undefined) ?? "";
    }
    return init;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        if (f.type === "json") {
          try {
            payload[f.name] = JSON.parse(String(form[f.name] || "{}"));
          } catch {
            setError(`Invalid JSON in "${f.label}".`);
            return;
          }
        } else if (f.type === "tags") {
          payload[f.name] = String(form[f.name] || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (f.type === "checkbox") {
          payload[f.name] = form[f.name] === true;
        } else {
          payload[f.name] = String(form[f.name] ?? "");
        }
      }
      if (isEditing) {
        await api(`/admin/${collection}/${item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api(`/admin/${collection}`, { method: "POST", body: JSON.stringify(payload) });
      }
      router.refresh();
      closePanel();
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
      await api(`/admin/${collection}/${item.id}`, { method: "DELETE" });
      router.refresh();
      if (onDeleteRedirect) router.push(onDeleteRedirect);
      closePanel();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <label key={f.name} className="block">
          <FieldLabel>{f.label}</FieldLabel>
          <FieldInput
            def={f}
            value={form[f.name] ?? ""}
            onChange={(v) => setForm((prev) => ({ ...prev, [f.name]: v }))}
          />
          {f.hint && <span className="mt-1.5 block text-xs text-muted">{f.hint}</span>}
        </label>
      ))}

      {error && <ErrorBanner message={error} />}

      <EditorActions
        onSave={save}
        saveLabel={isEditing ? "Save changes" : "Add"}
        busy={busy}
        onDelete={isEditing ? remove : undefined}
      />
    </div>
  );
}
