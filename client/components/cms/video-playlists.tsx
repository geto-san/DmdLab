"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListVideo, Loader2, Plus, Trash2 } from "lucide-react";
import { api } from "./api";
import { useEditMode } from "./edit-mode";
import { Modal } from "./modal";
import { FieldLabel } from "./fields";
import { Skeleton } from "@/components/skeleton";

type Playlist = {
  id: string;
  title: string;
  description: string;
  privacyStatus: string;
  itemCount: number;
};

const inputCls =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2";

export function PlaylistsManager() {
  const { enabled } = useEditMode();
  const [open, setOpen] = useState(false);
  if (!enabled) return null;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-accent2/60 px-4 py-2 font-mono-x text-xs text-accent2 transition-colors hover:bg-accent2/10"
      >
        <ListVideo className="size-3.5" /> Playlists
      </button>
      {open && <PlaylistsModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function PlaylistsModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    api<Playlist[]>("/videos/playlists")
      .then(setPlaylists)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function create() {
    if (!title.trim()) {
      setError("Enter a playlist title.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api("/videos/playlists", {
        method: "POST",
        body: JSON.stringify({ title, description, privacyStatus: privacy }),
      });
      setTitle("");
      setDescription("");
      await refresh();
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(playlistId: string) {
    setBusy(true);
    setError(null);
    try {
      await api(`/videos/playlists/${playlistId}`, { method: "DELETE" });
      await refresh();
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="YouTube playlists" onClose={onClose}>
      <div className="space-y-6">
        <div className="rounded-xl border border-line bg-bg/50 p-5">
          <div className="mb-4 flex items-center gap-2 font-mono-x text-xs text-accent2">
            <Plus className="size-3.5" /> New playlist
          </div>
          <div className="space-y-4">
            <div>
              <FieldLabel>Title</FieldLabel>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="min-h-16 w-full resize-y rounded-xl border border-line bg-bg px-4 py-3 font-mono-x text-xs outline-none transition-colors focus:border-accent2"
              />
            </div>
            <div>
              <FieldLabel>Privacy</FieldLabel>
              <select value={privacy} onChange={(e) => setPrivacy(e.target.value)} className={inputCls}>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
                <option value="public">Public</option>
              </select>
            </div>
            <button
              type="button"
              onClick={create}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-accent2 px-5 py-2 font-mono-x text-xs text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && <Loader2 className="size-3.5 animate-spin" />}
              Create playlist
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
          ) : playlists.length === 0 ? (
            <p className="text-sm text-muted">No playlists yet.</p>
          ) : (
            playlists.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-line bg-bg px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">{p.title}</p>
                  <p className="font-mono-x text-[0.6875rem] text-muted">
                    {p.itemCount} video{p.itemCount === 1 ? "" : "s"} · {p.privacyStatus}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  disabled={busy}
                  aria-label={`Delete ${p.title}`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-red-500/50 hover:text-red-500 disabled:opacity-40"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
