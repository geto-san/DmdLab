import "server-only";

import axios from "axios";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { videoClicks } from "@/db/schema";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID_RAW = process.env.YOUTUBE_CHANNEL_ID;

const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const DETAILS_URL = "https://www.googleapis.com/youtube/v3/videos";
const LIST_TTL = 5 * 60 * 1000;
const DETAIL_TTL = 10 * 60 * 1000;

const CACHE = new Map<string, { value: unknown; expires: number }>();
function cacheGet<T>(key: string): T | null {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (entry.expires <= Date.now()) {
    CACHE.delete(key);
    return null;
  }
  return entry.value as T;
}
function cacheSet(key: string, value: unknown, ttlMs: number) {
  CACHE.set(key, { value, expires: Date.now() + ttlMs });
}

// Call after any OAuth-based write (upload, metadata edit, delete, thumbnail)
// so the next read doesn't serve a stale entry for up to LIST_TTL/DETAIL_TTL.
export function invalidateVideoCaches(id?: string) {
  for (const key of CACHE.keys()) {
    if (key.startsWith("list:") || (id && key === `detail:${id}`)) {
      CACHE.delete(key);
    }
  }
}

let resolvedChannelId: string | null = null;
let resolvingPromise: Promise<string | null> | null = null;

function extractHandle(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (/^UC[\w-]{22}$/.test(raw)) return null;
  const urlMatch = /youtube\.com\/@([\w.-]+)/i.exec(raw);
  if (urlMatch) return urlMatch[1];
  if (raw.startsWith("@")) return raw.slice(1);
  return null;
}

async function getChannelId(): Promise<string | null> {
  if (resolvedChannelId) return resolvedChannelId;
  if (!CHANNEL_ID_RAW) return null;
  if (/^UC[\w-]{22}$/.test(CHANNEL_ID_RAW)) {
    resolvedChannelId = CHANNEL_ID_RAW;
    return resolvedChannelId;
  }
  const handle = extractHandle(CHANNEL_ID_RAW);
  if (!handle) {
    resolvedChannelId = CHANNEL_ID_RAW;
    return resolvedChannelId;
  }
  resolvingPromise ??= axios
    .get("https://www.googleapis.com/youtube/v3/channels", {
      params: { key: YOUTUBE_API_KEY, forHandle: handle, part: "id" },
    })
    .then((res) => {
      resolvedChannelId = res.data.items?.[0]?.id || CHANNEL_ID_RAW;
      if (!res.data.items?.[0]?.id) {
        console.error(`Could not resolve YouTube handle "${handle}" to a channel ID`);
      }
      return resolvedChannelId;
    })
    .catch((err: unknown) => {
      console.error("Failed to resolve YouTube handle to channel ID:", (err as Error).message);
      resolvedChannelId = CHANNEL_ID_RAW;
      return resolvedChannelId;
    });
  return resolvingPromise;
}

export function formatDuration(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return iso;
  const h = +(m[1] || 0);
  const min = +(m[2] || 0);
  const s = +(m[3] || 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
}

function parseDurationSeconds(iso: string | null | undefined): number {
  if (!iso) return 0;
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return 0;
  const h = +(m[1] || 0);
  const min = +(m[2] || 0);
  const s = +(m[3] || 0);
  return h * 3600 + min * 60 + s;
}

// Sums the actual duration of every video on the channel and returns the
// total in whole hours. Used to drive the "Recorded Hours" homepage stat —
// no hardcoded/estimated figure.
export async function getTotalRecordedHours(): Promise<number> {
  const videos = await fetchChannelVideos();
  const totalSeconds = videos.reduce((sum, v) => sum + parseDurationSeconds(v.duration), 0);
  return Math.round(totalSeconds / 3600);
}

export function inferCategory(title = "", description = "") {
  const text = `${title} ${description}`.toLowerCase();
  if (/\b(lecture|talk|seminar|guest|presentation|speaker|discussion)\b/.test(text)) return "Lecture";
  if (/\b(meeting|sync|standup|check-in|catch-up|update)\b/.test(text)) return "Meeting";
  if (/\b(tutorial|guide|how to|demo|walkthrough|workshop|intro)\b/.test(text)) return "Tutorial";
  return "Research";
}

function bestThumb(thumbnails: Record<string, { url?: string }>) {
  return thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url;
}

export type YouTubeVideo = {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  author?: string;
  uploadDate: string;
  category: string;
  views?: string;
  likes?: string;
  duration?: string | null;
  durationLabel?: string | null;
};

type DetailItem = {
  id: string;
  contentDetails?: { duration?: string };
  statistics?: { viewCount?: string; likeCount?: string };
};

// Pages through the search endpoint, collecting one entry per video until
// either the channel is exhausted or maxResults is reached.
async function collectVideosFromSearch(channelId: string | null, maxResults?: number): Promise<YouTubeVideo[]> {
  const collected: YouTubeVideo[] = [];
  let pageToken = "";

  do {
    const search = await axios.get(SEARCH_URL, {
      params: {
        key: YOUTUBE_API_KEY,
        channelId,
        part: "snippet",
        order: "date",
        maxResults: 50,
        pageToken: pageToken || undefined,
      },
    });

    for (const item of search.data.items) {
      if (item.id.kind !== "youtube#video") continue;
      collected.push({
        _id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        author: item.snippet.channelTitle,
        uploadDate: item.snippet.publishedAt,
        category: inferCategory(item.snippet.title, item.snippet.description),
      });
    }
    pageToken = search.data.nextPageToken || "";
  } while (pageToken && (!maxResults || collected.length < maxResults));

  return collected;
}

// Fetches duration/view/like stats for a batch of videos (50 ids per call,
// the API's max) and merges them onto the matching video objects in place.
async function attachVideoDetails(videos: YouTubeVideo[]): Promise<void> {
  const ids = videos.map((v) => v._id);
  if (!ids.length) return;

  const byId = new Map<string, DetailItem>();
  for (let i = 0; i < ids.length; i += 50) {
    const details = await axios.get(DETAILS_URL, {
      params: { key: YOUTUBE_API_KEY, id: ids.slice(i, i + 50).join(","), part: "contentDetails,statistics" },
    });
    for (const it of details.data.items as DetailItem[]) byId.set(it.id, it);
  }

  for (const v of videos) {
    const d = byId.get(v._id);
    if (!d) continue;
    v.duration = d.contentDetails?.duration || null;
    v.durationLabel = formatDuration(v.duration);
    v.views = d.statistics?.viewCount || "0";
    v.likes = d.statistics?.likeCount || "0";
  }
}

export async function fetchChannelVideos(maxResults?: number): Promise<YouTubeVideo[]> {
  const cacheKey = `list:${maxResults ?? "all"}`;
  const cached = cacheGet<YouTubeVideo[]>(cacheKey);
  if (cached) return cached;

  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY not set");
  }

  const channelId = await getChannelId();
  const collected = await collectVideosFromSearch(channelId, maxResults);
  const base = maxResults ? collected.slice(0, maxResults) : collected;

  await attachVideoDetails(base);

  cacheSet(cacheKey, base, LIST_TTL);
  return base;
}

export async function fetchVideoById(id: string): Promise<YouTubeVideo | null> {
  const cacheKey = `detail:${id}`;
  const cached = cacheGet<YouTubeVideo>(cacheKey);
  if (cached) return cached;

  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY not set");
  }

  const response = await axios.get(DETAILS_URL, {
    params: { key: YOUTUBE_API_KEY, id, part: "snippet,contentDetails,statistics" },
  });

  if (!response.data.items.length) return null;

  const video = response.data.items[0];
  const formatted: YouTubeVideo = {
    _id: id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: bestThumb(video.snippet.thumbnails),
    author: video.snippet.channelTitle,
    uploadDate: video.snippet.publishedAt,
    category: inferCategory(video.snippet.title, video.snippet.description),
    views: video.statistics?.viewCount || "0",
    likes: video.statistics?.likeCount || "0",
    duration: video.contentDetails?.duration || null,
    durationLabel: formatDuration(video.contentDetails?.duration),
  };

  cacheSet(cacheKey, formatted, DETAIL_TTL);
  return formatted;
}

export type RelatedVideo = {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  author?: string;
  uploadDate: string;
  durationLabel?: string | null;
};

const RELATED_POOL_SIZE = 50;

export async function fetchRelatedVideos(id: string, maxResults = RELATED_POOL_SIZE): Promise<RelatedVideo[]> {
  const pool = await fetchChannelVideos(maxResults);

  const items = pool
    .filter((v) => v._id !== id)
    .map((v) => ({
      _id: v._id,
      title: v.title,
      description: v.description,
      thumbnail: v.thumbnail,
      author: v.author,
      uploadDate: v.uploadDate,
      durationLabel: v.durationLabel,
    }));

  const ids = items.map((i) => i._id);
  const clickMap: Record<string, number> = {};
  if (ids.length) {
    const rows = await db
      .select({ toVideoId: videoClicks.toVideoId, clicks: sql<number>`count(*)::int` })
      .from(videoClicks)
      .where(and(eq(videoClicks.fromVideoId, id), inArray(videoClicks.toVideoId, ids)))
      .groupBy(videoClicks.toVideoId);
    for (const r of rows) clickMap[r.toVideoId] = r.clicks;
  }

  const scored = items.map((i) => {
    const clicks = clickMap[i._id] || 0;
    const ageDays = Math.max(
      0,
      Math.floor((Date.now() - new Date(i.uploadDate).getTime()) / (1000 * 60 * 60 * 24))
    );
    const recencyScore = Math.max(0, 30 - ageDays);
    const score = clicks * 10 + recencyScore;
    return { item: i, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 6).map((s) => s.item);
}
