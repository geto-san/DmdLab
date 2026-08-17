"use client";

import { useEditMode } from "./edit-mode";
import { VideoConnect } from "./video-connect";
import { VideoUploadButton } from "./video-upload";
import { PlaylistsManager } from "./video-playlists";

export function VideoAdminBar() {
  const { enabled } = useEditMode();
  if (!enabled) return null;
  return (
    <div className="mb-10 flex flex-wrap items-center gap-3 rounded-blob border border-line bg-surface p-4">
      <VideoUploadButton />
      <VideoConnect />
      <PlaylistsManager />
    </div>
  );
}
