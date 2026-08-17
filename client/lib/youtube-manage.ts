import "server-only";

import axios from "axios";
import { getAccessToken } from "./youtube-oauth";

const API = "https://www.googleapis.com/youtube/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/youtube/v3";

const http = axios.create();

http.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    const response = (error as { response?: { data?: unknown } }).response;
    const detail = (response?.data as { error?: { message?: string } })?.error?.message;
    if (detail) {
      (error as Error).message = `${(error as Error).message}: ${detail}`;
    }
    return Promise.reject(error);
  }
);

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, string | undefined>;
  body?: unknown;
};

async function yt<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const res = await http.request<T>({
    url: `${API}${path}`,
    method: options.method ?? "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: options.params,
    data: options.body,
  });
  return res.data;
}

type SnippetStatus = {
  id: string;
  snippet?: {
    title: string;
    description: string;
    tags?: string[];
    categoryId?: string;
  };
  status?: { privacyStatus?: string };
};

export async function fetchManagedVideo(id: string) {
  const res = await yt<{ items: SnippetStatus[] }>(`/videos`, {
    params: { part: "snippet,status", id },
  });
  return res.items?.[0] ?? null;
}

export async function updateVideoMetadata(
  id: string,
  fields: {
    title?: string;
    description?: string;
    tags?: string[];
    categoryId?: string;
    privacyStatus?: string;
  }
) {
  const current = await fetchManagedVideo(id);
  if (!current) throw new Error("Video not found");

  const snippet = {
    title: fields.title ?? current.snippet?.title ?? "",
    description: fields.description ?? current.snippet?.description ?? "",
    tags: fields.tags ?? current.snippet?.tags ?? [],
    categoryId: fields.categoryId ?? current.snippet?.categoryId ?? "22",
  };
  const status = {
    privacyStatus: fields.privacyStatus ?? current.status?.privacyStatus ?? "private",
  };

  return yt<{ id: string }>(`/videos`, {
    method: "PUT",
    params: { part: "snippet,status" },
    body: { id, snippet, status },
  });
}

export async function deleteVideo(id: string) {
  return yt<void>(`/videos`, { method: "DELETE", params: { id } });
}

export async function uploadVideo(
  stream: NodeJS.ReadableStream,
  file: { name: string; type: string; size: number },
  metadata: {
    title: string;
    description?: string;
    tags?: string[];
    categoryId?: string;
    privacyStatus?: string;
  }
) {
  const token = await getAccessToken();
  const body = JSON.stringify({
    snippet: {
      title: metadata.title,
      description: metadata.description || "",
      tags: metadata.tags || [],
      categoryId: metadata.categoryId || "22",
    },
    status: { privacyStatus: metadata.privacyStatus || "private" },
  });

  const init = await http.post(
    `${UPLOAD_API}/videos`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Length": String(file.size),
        "X-Upload-Content-Type": file.type || "video/mp4",
      },
      params: { uploadType: "resumable", part: "snippet,status" },
      maxRedirects: 0,
    }
  );

  const uploadUrl = init.headers.location as string;
  if (!uploadUrl) throw new Error("Could not start resumable upload");

  try {
    const upload = await http.put(uploadUrl, stream, {
      headers: {
        "Content-Type": file.type || "video/mp4",
        "Content-Length": String(file.size),
        "Content-Range": `bytes 0-${file.size - 1}/${file.size}`,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return upload.data as { id: string };
  } catch (err) {
    await http.delete(uploadUrl, { maxRedirects: 0 }).catch(() => {});
    throw err;
  }
}

export async function setVideoThumbnail(id: string, image: { type: string; data: Buffer }) {
  const token = await getAccessToken();
  const res = await http.post(
    `${UPLOAD_API}/thumbnails/set`,
    image.data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": image.type || "image/jpeg",
      },
      params: { videoId: id, uploadType: "media" },
    }
  );
  return res.data;
}

export async function listVideoCategories() {
  const res = await yt<{
    items: { id: string; snippet: { title: string } }[];
  }>(`/videoCategories`, { params: { part: "snippet", regionCode: "US" } });
  return res.items.filter((c) => c.snippet.title).map((c) => ({
    id: c.id,
    title: c.snippet.title,
  }));
}

export type PlaylistItemRef = { itemId: string; videoId: string };

export type PlaylistSummary = {
  id: string;
  title: string;
  description: string;
  privacyStatus: string;
  itemCount: number;
  items: PlaylistItemRef[];
};

export async function listPlaylists(): Promise<PlaylistSummary[]> {
  const res = await yt<{ items: { id: string; snippet: { title: string; description?: string }; status?: { privacyStatus?: string } }[] }>(
    `/playlists`,
    { params: { part: "snippet,status", mine: "true", maxResults: "50" } }
  );
  return res.items.map((p) => ({
    id: p.id,
    title: p.snippet.title,
    description: p.snippet.description ?? "",
    privacyStatus: p.status?.privacyStatus ?? "private",
    itemCount: 0,
    items: [],
  }));
}

export async function createPlaylist(data: {
  title: string;
  description?: string;
  privacyStatus?: string;
}) {
  return yt<{ id: string }>(`/playlists`, {
    method: "POST",
    params: { part: "snippet,status" },
    body: {
      snippet: { title: data.title, description: data.description || "" },
      status: { privacyStatus: data.privacyStatus || "private" },
    },
  });
}

export async function deletePlaylist(playlistId: string) {
  return yt<void>(`/playlists`, { method: "DELETE", params: { id: playlistId } });
}

export async function listPlaylistItems(playlistId: string): Promise<PlaylistItemRef[]> {
  const res = await yt<{ items: { id: string; snippet: { resourceId?: { videoId?: string } } }[] }>(
    `/playlistItems`,
    { params: { part: "snippet", playlistId, maxResults: "50" } }
  );
  return res.items
    .filter((i) => i.snippet?.resourceId?.videoId)
    .map((i) => ({ itemId: i.id, videoId: i.snippet.resourceId!.videoId! }));
}

export async function addVideoToPlaylist(playlistId: string, videoId: string) {
  return yt<{ id: string }>(`/playlistItems`, {
    method: "POST",
    params: { part: "snippet" },
    body: {
      snippet: {
        playlistId,
        resourceId: { kind: "youtube#video", videoId },
      },
    },
  });
}

export async function removeFromPlaylist(playlistItemId: string) {
  return yt<void>(`/playlistItems`, {
    method: "DELETE",
    params: { id: playlistItemId },
  });
}

export async function listPlaylistsWithItems() {
  const playlists = await listPlaylists();
  return Promise.all(
    playlists.map(async (p) => {
      const items = await listPlaylistItems(p.id);
      return { ...p, itemCount: items.length, items };
    })
  );
}
