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

let resolvedChannelId: string | null = null;
let resolvingPromise: Promise<string | null> | null = null;

function extractHandle(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (/^UC[\w-]{22}$/.test(raw)) return null;
  const urlMatch = raw.match(/youtube\.com\/@([\w.-]+)/i);
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
  if (!resolvingPromise) {
    resolvingPromise = axios
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
  }
  return resolvingPromise;
}

export function formatDuration(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return iso;
  const h = +(m[1] || 0);
  const min = +(m[2] || 0);
  const s = +(m[3] || 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
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

export async function fetchChannelVideos(maxResults = 10): Promise<YouTubeVideo[]> {
  const cacheKey = `list:${maxResults}`;
  const cached = cacheGet<YouTubeVideo[]>(cacheKey);
  if (cached) return cached;

  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY not set");
  }

  const search = await axios.get(SEARCH_URL, {
    params: {
      key: YOUTUBE_API_KEY,
      channelId: await getChannelId(),
      part: "snippet",
      order: "date",
      maxResults,
    },
  });

  const base: YouTubeVideo[] = search.data.items
    .filter((item: { id: { kind: string } }) => item.id.kind === "youtube#video")
    .map((item: { id: { videoId: string }; snippet: { title: string; description: string; thumbnails: Record<string, { url?: string }>; channelTitle: string; publishedAt: string } }) => ({
      _id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      author: item.snippet.channelTitle,
      uploadDate: item.snippet.publishedAt,
      category: inferCategory(item.snippet.title, item.snippet.description),
    }));

  const ids = base.map((v) => v._id);
  if (ids.length) {
    const details = await axios.get(DETAILS_URL, {
      params: { key: YOUTUBE_API_KEY, id: ids.join(","), part: "contentDetails,statistics" },
    });
    type DetailItem = {
      id: string;
      contentDetails?: { duration?: string };
      statistics?: { viewCount?: string; likeCount?: string };
    };
    const byId = new Map<string, DetailItem>(
      (details.data.items as DetailItem[]).map((it) => [it.id, it])
    );
    for (const v of base) {
      const d = byId.get(v._id);
      if (!d) continue;
      v.duration = d.contentDetails?.duration || null;
      v.durationLabel = formatDuration(v.duration);
      v.views = d.statistics?.viewCount || "0";
      v.likes = d.statistics?.likeCount || "0";
    }
  }

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

export async function fetchRelatedVideos(id: string, maxResults = 12): Promise<RelatedVideo[]> {
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
