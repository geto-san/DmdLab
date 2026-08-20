"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "./api";
import { FieldInput, type FieldDef } from "./fields";
import { ErrorBanner, EditorActions } from "./editor-ui";

const TEXT_FIELDS: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "role", label: "Role", type: "text" },
];

const PHOTO_URL_FIELD: FieldDef = {
  name: "photo",
  label: "Photo URL",
  type: "text",
  hint: "Paste an image URL, or upload a file below instead. Uploading replaces this.",
};

const CONTACT_FIELDS: FieldDef[] = [
  { name: "email", label: "Email", type: "text", hint: "Not shown publicly. Used to notify members of new articles, research, and publications." },
  { name: "linkedin", label: "LinkedIn URL", type: "text", hint: "Shown as an icon if provided" },
  { name: "github", label: "GitHub URL", type: "text", hint: "Shown as an icon if provided" },
  { name: "otherUrl", label: "Other URL", type: "text", hint: "Personal site, X/Twitter, etc. shown as an icon if provided" },
];

const ALUMNI_FIELD: FieldDef = {
  name: "alumni",
  label: "Alumni",
  type: "checkbox",
  hint: "Show in the Alumni section at the bottom of the Team page",
};

export function MemberPanelForm({
  member,
  redirectTo,
}: Readonly<{
  member: Record<string, unknown> | null;
  redirectTo?: string;
}>) {
  const isEditing = member?.id != null;
  const router = useRouter();

  const allFields = [...TEXT_FIELDS, PHOTO_URL_FIELD, ...CONTACT_FIELDS];
  const [form, setForm] = useState<Record<string, string | boolean>>(() => {
    const init: Record<string, string | boolean> = {};
    for (const f of allFields) init[f.name] = (member?.[f.name] as string | undefined) ?? "";
    init.alumni = member?.alumni === true;
    return init;
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      for (const f of allFields) fd.set(f.name, String(form[f.name] ?? ""));
      fd.set("alumni", form.alumni === true ? "true" : "false");
      if (file) fd.set("photo", file);

      if (isEditing) {
        await api(`/admin/members/${member.id}`, { method: "PUT", body: fd });
      } else {
        await api("/admin/members", { method: "POST", body: fd });
      }
      router.refresh();
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
      await api(`/admin/members/${member.id}`, { method: "DELETE" });
      router.refresh();
      if (redirectTo) router.push(redirectTo);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {TEXT_FIELDS.map((f) => (
        <label key={f.name} className="block">
          <span className="mb-2 block font-mono-x text-xs text-muted">{f.label}</span>
          <FieldInput
            def={f}
            value={form[f.name] ?? ""}
            onChange={(v) => setForm((p) => ({ ...p, [f.name]: v }))}
          />
        </label>
      ))}

      <div>
        <span className="mb-2 block font-mono-x text-xs text-muted">Photo</span>
        {(file || form.photo) && (
          <div className="relative mb-3 aspect-square w-32 overflow-hidden rounded-full bg-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={file ? URL.createObjectURL(file) : String(form.photo)}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        )}

        <FieldInput
          def={PHOTO_URL_FIELD}
          value={form.photo ?? ""}
          onChange={(v) => setForm((p) => ({ ...p, photo: v }))}
        />
        <span className="mt-1.5 block text-xs text-muted">{PHOTO_URL_FIELD.hint}</span>

        <div className="mt-3">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-muted file:mr-4 file:cursor-pointer file:rounded-full file:border-none file:bg-accent file:px-4 file:py-2 file:font-mono-x file:text-xs file:text-accent-ink"
          />
          {isEditing && !file && (
            <p className="mt-1.5 text-xs text-muted">
              Leave empty to keep the current photo. A new upload replaces it.
            </p>
          )}
        </div>
      </div>

      {CONTACT_FIELDS.map((f) => (
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

      <label className="flex items-center gap-3">
        <FieldInput
          def={ALUMNI_FIELD}
          value={form.alumni}
          onChange={(v) => setForm((p) => ({ ...p, alumni: v }))}
        />
        <span className="font-mono-x text-xs text-muted">{ALUMNI_FIELD.label}</span>
      </label>
      <p className="-mt-3 text-xs text-muted">{ALUMNI_FIELD.hint}</p>

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
