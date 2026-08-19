"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "./api";
import { FieldInput } from "./fields";
import { EditorActions } from "./editor-ui";
import { Skeleton } from "@/components/skeleton";

type BlockRow = {
  id: number;
  key: string;
  section: string | null;
  title: string | null;
  enabled: boolean;
  payload: Record<string, unknown> | null;
};

const KEY_FIELD = { name: "key", label: "Key", type: "text" as const, hint: "lowercase-alphanumeric-dashes" };
const SECTION_FIELD = { name: "section", label: "Section", type: "text" as const };
const TITLE_FIELD = { name: "title", label: "Title", type: "text" as const };
const ENABLED_FIELD = { name: "enabled", label: "Enabled", type: "checkbox" as const };
const PAYLOAD_FIELD = { name: "payload", label: "Payload (JSON)", type: "json" as const };

export function ContentPanelForm({
  blockKey,
}: Readonly<{
  blockKey: string;
}>) {
  const [row, setRow] = useState<BlockRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, string | boolean>>({
    key: blockKey,
    section: "general",
    title: "",
    enabled: true,
    payload: "{}",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const blocks = (await api("/admin/content")) as BlockRow[];
        const found = blocks.find((b) => b.key === blockKey);
        if (found) {
          setRow(found);
          setForm({
            key: found.key,
            section: found.section || "general",
            title: found.title || "",
            enabled: found.enabled !== false,
            payload: JSON.stringify(found.payload ?? {}, null, 2),
          });
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [blockKey]);

  const save = async () => {
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(String(form.payload));
    } catch {
      setError("Invalid JSON in payload.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const body = JSON.stringify({
        key: String(form.key).trim().toLowerCase(),
        section: String(form.section).trim() || "general",
        title: String(form.title),
        enabled: form.enabled === true,
        payload,
      });
      if (row) {
        await api(`/admin/content/${row.id}`, { method: "PUT", body });
      } else {
        await api("/admin/content", { method: "POST", body });
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 py-2">
        <div className="grid gap-5 sm:grid-cols-2">
          <Skeleton className="h-[46px] w-full rounded-xl" />
          <Skeleton className="h-[46px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[46px] w-full rounded-xl" />
        <Skeleton className="h-5 w-24 rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono-x text-xs text-muted">Key</span>
          <FieldInput
            def={KEY_FIELD}
            value={String(form.key)}
            onChange={(v) => setForm((p) => ({ ...p, key: v }))}
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono-x text-xs text-muted">Section</span>
          <FieldInput
            def={SECTION_FIELD}
            value={String(form.section)}
            onChange={(v) => setForm((p) => ({ ...p, section: v }))}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block font-mono-x text-xs text-muted">Title</span>
        <FieldInput
          def={TITLE_FIELD}
          value={String(form.title)}
          onChange={(v) => setForm((p) => ({ ...p, title: v }))}
        />
      </label>
      <label className="flex items-center gap-3">
        <FieldInput
          def={ENABLED_FIELD}
          value={form.enabled}
          onChange={(v) => setForm((p) => ({ ...p, enabled: v }))}
        />
        <span className="font-mono-x text-xs text-muted">Enabled</span>
      </label>
      <label className="block">
        <span className="mb-2 block font-mono-x text-xs text-muted">Payload (JSON)</span>
        <FieldInput
          def={PAYLOAD_FIELD}
          value={String(form.payload)}
          onChange={(v) => setForm((p) => ({ ...p, payload: v }))}
        />
      </label>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <EditorActions onSave={save} saveLabel="Save" busy={busy} />
        <span className="font-mono-x text-xs text-muted">
          {row ? "Existing block" : "New block will be created"}
        </span>
      </div>
    </div>
  );
}
