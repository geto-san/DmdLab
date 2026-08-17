"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { api, uploadFileWithProgress } from "./api";
import { Modal } from "./modal";
import { FieldLabel } from "./fields";
import { Skeleton } from "@/components/skeleton";

type ManagedVideo = {
  id: string;
  snippet?: { title: string; description: string; tags?: string[]; categoryId?: string };
  status?: { privacyStatus?: string };
};
type Category = { id: string; title: string };
type Playlist = {
  id: string;
  title: string;
  itemCount: number;
  items: { itemId: string; videoId: string }[];
};

const inputCls =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2";

export function VideoEditorModal({
  video,
  onClose,
  onDeleted,
}: {
  video: { _id: string; title: string };
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const videoId = video._id;

  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [categoryId, setCategoryId] = useState("22");
  const [privacy, setPrivacy] = useState("private");
  const [categories, setCategories] = useState<Category[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [thumbProgress, setThumbProgress] = useState<number | null>(null);

  async function refreshPlaylists() {
    setPlaylistsLoading(true);
    api<Playlist[]>("/videos/playlists")
      .then(setPlaylists)
      .catch(() => {})
      .finally(() => setPlaylistsLoading(false));
  }

  useEffect(() => {
    api<ManagedVideo>(`/videos/${videoId}/manage`)
      .then((m) => {
        setTitle(m.snippet?.title ?? video.title);
        setDescription(m.snippet?.description ?? "");
        setTags((m.snippet?.tags ?? []).join(", "));
        if (m.snippet?.categoryId) setCategoryId(m.snippet.categoryId);
        if (m.status?.privacyStatus) setPrivacy(m.status.privacyStatus);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setMetaLoading(false));
    api<Category[]>("/videos/categories")
      .then(setCategories)
      .catch(() => {});
    refreshPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  async function saveMetadata() {
    setBusy("save");
    setError(null);
    try {
      await api(`/videos/${videoId}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          description,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          categoryId,
          privacyStatus: privacy,
        }),
      });
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function uploadThumbnail() {
    if (!thumbnail) return;
    setBusy("thumb");
    setError(null);
    setThumbProgress(0);
    try {
      await uploadFileWithProgress(`/videos/${videoId}/thumbnail`, thumbnail, {}, (sent, total) => {
        setThumbProgress(total ? Math.round((sent / total) * 100) : 0);
      }).promise;
      router.refresh();
      setThumbnail(null);
      setThumbProgress(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function togglePlaylist(p: Playlist, isMember: boolean) {
    setBusy(`pl:${p.id}`);
    setError(null);
    try {
      if (isMember) {
        const entry = p.items.find((i) => i.videoId === videoId);
        if (entry) await api(`/videos/playlists/${p.id}/items/${entry.itemId}`, { method: "DELETE" });
      } else {
        await api(`/videos/playlists/${p.id}/items`, {
          method: "POST",
          body: JSON.stringify({ videoId }),
        });
      }
      await refreshPlaylists();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function removeVideo() {
    setBusy("delete");
    setError(null);
    try {
      await api(`/videos/${videoId}`, { method: "DELETE" });
      router.refresh();
      if (onDeleted) onDeleted();
      else onClose();
    } catch (e) {
      setError((e as Error).message);
      setConfirmDelete(false);
    } finally {
      setBusy(null);
    }
  }

  return (
    <Modal title="Edit video" onClose={onClose} wide>
      <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
        <div className="space-y-5">
          <div>
            <FieldLabel>Title</FieldLabel>
            {metaLoading ? (
              <Skeleton className="h-[46px] w-full rounded-xl" />
            ) : (
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
            )}
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            {metaLoading ? (
              <Skeleton className="h-32 w-full rounded-xl" />
            ) : (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="min-h-32 w-full resize-y rounded-xl border border-line bg-bg px-4 py-3 font-mono-x text-xs outline-none transition-colors focus:border-accent2"
              />
            )}
          </div>

          <div>
            <FieldLabel>Tags (comma separated)</FieldLabel>
            {metaLoading ? (
              <Skeleton className="h-[46px] w-full rounded-xl" />
            ) : (
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputCls} />
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel>Category</FieldLabel>
              {metaLoading ? (
                <Skeleton className="h-[46px] w-full rounded-xl" />
              ) : (
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <FieldLabel>Privacy</FieldLabel>
              {metaLoading ? (
                <Skeleton className="h-[46px] w-full rounded-xl" />
              ) : (
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)} className={inputCls}>
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="public">Public</option>
                </select>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-line pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-line px-5 py-2 font-mono-x text-xs text-muted transition-colors hover:border-ink hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveMetadata}
              disabled={busy !== null}
              className="inline-flex items-center gap-2 rounded-full bg-accent2 px-5 py-2 font-mono-x text-xs text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === "save" && <Loader2 className="size-3.5 animate-spin" />}
              Save changes
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <FieldLabel>Custom thumbnail</FieldLabel>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              className="w-full cursor-pointer rounded-xl border border-line bg-bg px-4 py-3 text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-full file:border-none file:bg-accent2/10 file:px-3 file:py-1.5 file:font-mono-x file:text-xs file:text-accent2"
            />
            <button
              type="button"
              onClick={uploadThumbnail}
              disabled={!thumbnail || busy !== null}
              className="mt-3 w-full rounded-full border border-accent2/60 px-4 py-2 font-mono-x text-xs text-accent2 transition-colors hover:bg-accent2/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy === "thumb"
                ? thumbProgress !== null && thumbProgress < 100
                  ? `Uploading ${thumbProgress}%…`
                  : "Uploading…"
                : "Set thumbnail"}
            </button>
            {busy === "thumb" && (
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                {thumbProgress !== null && thumbProgress < 100 ? (
                  <div
                    className="h-full rounded-full bg-accent2 transition-[width] duration-200"
                    style={{ width: `${thumbProgress}%` }}
                  />
                ) : (
                  <div className="h-full w-full animate-pulse rounded-full bg-accent2" />
                )}
              </div>
            )}
          </div>

          <div>
            <FieldLabel>Playlists</FieldLabel>
            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {playlistsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))
              ) : playlists.length === 0 ? (
                <p className="text-xs text-muted">No playlists on the channel yet.</p>
              ) : (
                playlists.map((p) => {
                  const isMember = p.items.some((i) => i.videoId === videoId);
                  return (
                    <label
                      key={p.id}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-bg px-3 py-2.5"
                    >
                      <span className="min-w-0 truncate text-sm">
                        {p.title}{" "}
                        <span className="font-mono-x text-[0.6875rem] text-muted">({p.itemCount})</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={isMember}
                        disabled={busy === `pl:${p.id}`}
                        onChange={() => togglePlaylist(p, isMember)}
                        className="size-4 shrink-0 accent-[var(--accent)]"
                      />
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
            <FieldLabel>Danger zone</FieldLabel>
            <button
              type="button"
              onClick={() => (confirmDelete ? removeVideo() : setConfirmDelete(true))}
              disabled={busy !== null}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-500/50 px-4 py-2 font-mono-x text-xs text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy === "delete" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              {confirmDelete ? "Click again to permanently delete" : "Delete video"}
            </button>
            <p className="mt-2 text-[0.6875rem] leading-relaxed text-muted">
              Deletes the video from the YouTube channel. This cannot be undone.
            </p>
          </div>
        </aside>
      </div>
    </Modal>
  );
}
