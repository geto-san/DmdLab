"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  CheckCircle2,
  ExternalLink,
  FileVideo,
  Loader2,
  RotateCcw,
  UploadCloud,
  X,
} from "lucide-react";
import { api, uploadFileWithProgress, UploadAbortError } from "./api";
import { useEditMode } from "./edit-mode";
import { Modal } from "./modal";
import { FieldLabel } from "./fields";
import { Skeleton } from "@/components/skeleton";

type Category = { id: string; title: string };
type Playlist = { id: string; title: string };

type Status = "queued" | "uploading" | "done" | "error" | "cancelled";

type QueueItem = {
  uid: string;
  file: File;
  title: string;
  status: Status;
  progress: number;
  videoId?: string;
  error?: string;
};

const VIDEO_EXT = /\.(mp4|m4v|mov|webm|avi|mkv|flv|wmv|3gp|mpg|mpeg|ts)$/i;

const inputCls =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent2 disabled:cursor-wait disabled:opacity-60";

let uidCounter = 0;
const nextUid = () => `upl-${++uidCounter}-${Date.now()}`;

function titleFromFile(file: File) {
  return file.name.replace(/\.[^.]+$/, "");
}

function formatMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function VideoUploadButton() {
  const { enabled } = useEditMode();
  const [open, setOpen] = useState(false);
  if (!enabled) return null;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-accent2 px-4 py-2 font-mono-x text-xs text-bg transition-opacity hover:opacity-90"
      >
        <UploadCloud className="size-3.5" /> Upload video
      </button>
      {open && <VideoUploadModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function VideoUploadModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<{ uid: string; abort: () => void } | null>(null);

  const [items, setItems] = useState<QueueItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [categoryId, setCategoryId] = useState("22");
  const [privacy, setPrivacy] = useState("private");
  const [playlistId, setPlaylistId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectsLoading, setSelectsLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api<Category[]>("/videos/categories").catch(() => [] as Category[]),
      api<Playlist[]>("/videos/playlists").catch(() => [] as Playlist[]),
    ]).then(([cats, pls]) => {
      setCategories(cats);
      setPlaylists(pls);
      setSelectsLoading(false);
    });
  }, []);

  function updateItem(uid: string, patch: Partial<QueueItem>) {
    setItems((prev) => prev.map((it) => (it.uid === uid ? { ...it, ...patch } : it)));
  }

  function addFiles(list: FileList | File[]) {
    const accepted = Array.from(list).filter((f) => f.type.startsWith("video/") || VIDEO_EXT.test(f.name));
    if (!accepted.length) {
      setError("Only video files can be uploaded.");
      return;
    }
    setError(null);
    const next = accepted.map((file) => ({
      uid: nextUid(),
      file,
      title: titleFromFile(file),
      status: "queued" as Status,
      progress: 0,
    }));
    setItems((prev) => [...prev, ...next]);
  }

  function removeItem(uid: string) {
    setItems((prev) => prev.filter((it) => it.uid !== uid));
  }

  function retryItem(uid: string) {
    updateItem(uid, { status: "queued", progress: 0, error: undefined });
  }

  function cancelCurrent() {
    abortRef.current?.abort();
  }

  async function uploadOne(item: QueueItem) {
    updateItem(item.uid, { status: "uploading", progress: 0, error: undefined });
    const params = new URLSearchParams({
      title: item.title.trim() || titleFromFile(item.file),
      description,
      tags,
      categoryId,
      privacyStatus: privacy,
    });
    if (playlistId) params.set("playlistId", playlistId);

    const { promise, abort } = uploadFileWithProgress(
      `/videos/upload?${params.toString()}`,
      item.file,
      { "x-file-name": item.file.name },
      (sent, total) => updateItem(item.uid, { progress: total ? Math.round((sent / total) * 100) : 0 })
    );
    abortRef.current = { uid: item.uid, abort };
    try {
      const res = (await promise) as { id?: string };
      updateItem(item.uid, { status: "done", progress: 100, videoId: res.id });
    } catch (e) {
      if (e instanceof UploadAbortError) {
        updateItem(item.uid, { status: "cancelled", progress: 0 });
      } else {
        updateItem(item.uid, { status: "error", error: (e as Error).message, progress: 0 });
      }
    } finally {
      if (abortRef.current?.uid === item.uid) abortRef.current = null;
    }
  }

  async function uploadAll() {
    const queued = items.filter((it) => it.status === "queued");
    if (!queued.length) return;
    setRunning(true);
    setError(null);
    try {
      for (const item of queued) {
        await uploadOne(item);
      }
    } finally {
      setRunning(false);
      router.refresh();
    }
  }

  const uploadableCount = items.filter((it) => it.status === "queued").length;
  const doneCount = items.filter((it) => it.status === "done").length;

  return (
    <Modal title="Upload videos to YouTube" onClose={onClose} wide>
      <div className="space-y-6">
        {/* Dropzone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Add videos"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragActive ? "border-accent2 bg-accent2/5" : "border-line bg-bg/40 hover:border-accent2/60"
          }`}
        >
          <UploadCloud className={`size-8 ${dragActive ? "text-accent2" : "text-muted"}`} />
          <p className="font-display text-xl">
            Drag &amp; drop videos <span className="text-accent2">here</span>
          </p>
          <p className="font-mono-x text-xs text-muted">or click to browse — select multiple files</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/*,.mp4,.m4v,.mov,.webm,.avi,.mkv,.flv,.wmv,.3gp,.mpg,.mpeg,.ts"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Queue */}
        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.uid}
                className={`rounded-xl border bg-bg p-4 ${
                  it.status === "error" ? "border-red-500/40" : "border-line"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface text-muted">
                    <FileVideo className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <input
                      type="text"
                      value={it.title}
                      disabled={it.status === "uploading"}
                      onChange={(e) => updateItem(it.uid, { title: e.target.value })}
                      className="w-full rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-sm font-medium outline-none transition-colors focus:border-line focus:bg-surface disabled:opacity-70"
                    />
                    <div className="mt-1 flex items-center gap-2 font-mono-x text-[0.6875rem] text-muted">
                      <span>{formatMb(it.file.size)}</span>
                      {it.status === "queued" && <span>· Queued</span>}
                      {it.status === "cancelled" && <span className="text-amber-600">· Cancelled</span>}
                    </div>
                    {(it.status === "uploading" || it.status === "error") && (
                      <div className="mt-2">
                        {it.status === "uploading" && (
                          <>
                            <div className="h-1.5 overflow-hidden rounded-full bg-line">
                              {it.progress < 100 ? (
                                <div
                                  className="h-full rounded-full bg-accent2 transition-[width] duration-200"
                                  style={{ width: `${it.progress}%` }}
                                />
                              ) : (
                                <div className="h-full w-full animate-pulse rounded-full bg-accent2" />
                              )}
                            </div>
                            <p className="mt-1 font-mono-x text-[0.6875rem] text-muted">
                              {it.progress < 100
                                ? `Uploading ${it.progress}% · ${(
                                    (it.file.size / (1024 * 1024)) *
                                    (it.progress / 100)
                                  ).toFixed(1)} / ${formatMb(it.file.size)}`
                                : "Uploading to YouTube…"}
                            </p>
                          </>
                        )}
                        {it.status === "error" && (
                          <p className="mt-1 font-mono-x text-[0.6875rem] text-red-500">{it.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {it.status === "done" && it.videoId && (
                      <span className="mr-1 flex items-center gap-1 font-mono-x text-[0.6875rem] text-emerald-600">
                        <CheckCircle2 className="size-3.5" /> Done
                      </span>
                    )}
                    {it.status === "done" && it.videoId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${it.videoId}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open video on YouTube"
                        className="flex size-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent2 hover:text-accent2"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                    {it.status === "uploading" && (
                      <button
                        type="button"
                        onClick={cancelCurrent}
                        aria-label="Cancel upload"
                        className="flex size-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-red-500/50 hover:text-red-500"
                      >
                        <Ban className="size-3.5" />
                      </button>
                    )}
                    {it.status === "error" && (
                      <button
                        type="button"
                        onClick={() => retryItem(it.uid)}
                        aria-label="Retry upload"
                        className="flex size-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent2 hover:text-accent2"
                      >
                        <RotateCcw className="size-3.5" />
                      </button>
                    )}
                    {it.status !== "uploading" && (
                      <button
                        type="button"
                        onClick={() => removeItem(it.uid)}
                        aria-label="Remove"
                        className="flex size-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-red-500/50 hover:text-red-500"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shared metadata */}
        {items.length > 0 && (
          <div className="space-y-5 rounded-xl border border-line bg-surface p-5">
            <div>
              <FieldLabel>Description (applies to all)</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={running}
                className="min-h-16 w-full resize-y rounded-xl border border-line bg-bg px-4 py-3 font-mono-x text-xs outline-none transition-colors focus:border-accent2 disabled:cursor-wait disabled:opacity-60"
              />
            </div>

            <div>
              <FieldLabel>Tags (comma separated, applies to all)</FieldLabel>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="machine learning, quantum computing"
                disabled={running}
                className={inputCls}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <FieldLabel>Category</FieldLabel>
                {selectsLoading ? (
                  <Skeleton className="h-[46px] w-full rounded-xl" />
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={running}
                    className={inputCls}
                  >
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
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  disabled={running}
                  className={inputCls}
                >
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="public">Public</option>
                </select>
              </div>
              <div>
                <FieldLabel>Add to playlist (optional)</FieldLabel>
                {selectsLoading ? (
                  <Skeleton className="h-[46px] w-full rounded-xl" />
                ) : (
                  <select
                    value={playlistId}
                    onChange={(e) => setPlaylistId(e.target.value)}
                    disabled={running}
                    className={inputCls}
                  >
                    <option value="">— None —</option>
                    {playlists.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {doneCount > 0 && (
          <p className="rounded-xl border border-emerald-600/30 bg-emerald-600/5 px-4 py-2.5 text-sm text-emerald-700">
            Uploaded {doneCount} video{doneCount === 1 ? "" : "s"} — processing on YouTube.
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-line pt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={running}
            className="rounded-full border border-line px-5 py-2 font-mono-x text-xs text-muted transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Close
          </button>
          <button
            type="button"
            onClick={uploadAll}
            disabled={running || uploadableCount === 0}
            className="inline-flex items-center gap-2 rounded-full bg-accent2 px-6 py-2 font-mono-x text-xs text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <UploadCloud className="size-3.5" /> Upload{" "}
                {uploadableCount > 0
                  ? `${uploadableCount} video${uploadableCount === 1 ? "" : "s"}`
                  : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
