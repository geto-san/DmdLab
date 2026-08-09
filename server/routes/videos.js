const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID_RAW = process.env.YOUTUBE_CHANNEL_ID;
const VideoClick = require('../models/VideoClick');

const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const DETAILS_URL = 'https://www.googleapis.com/youtube/v3/videos';
const LIST_TTL = 5 * 60 * 1000; // 5 min
const DETAIL_TTL = 10 * 60 * 1000; // 10 min

// Tiny in-memory TTL cache so repeated page loads / related lookups reuse the
// same YouTube API responses instead of burning quota on every request.
// Bounded (FIFO eviction) so it can't grow without limit if the channel's
// catalog — or request variety via query params like maxResults — grows;
// each instance has its own cache, so this is a per-process cap, not global.
const CACHE = new Map();
const CACHE_MAX_ENTRIES = 500;
function cacheGet(key) {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (entry.expires <= Date.now()) {
    CACHE.delete(key);
    return null;
  }
  return entry.value;
}
function cacheSet(key, value, ttlMs) {
  if (CACHE.size >= CACHE_MAX_ENTRIES && !CACHE.has(key)) {
    // Map preserves insertion order, so the first key is the oldest entry.
    const oldestKey = CACHE.keys().next().value;
    CACHE.delete(oldestKey);
  }
  CACHE.set(key, { value, expires: Date.now() + ttlMs });
}

// YOUTUBE_CHANNEL_ID needs to be the raw channel ID (starts with "UC"), but
// it's easy to instead set it to the channel URL or @handle you'd copy from
// a browser. Resolve those automatically via the API's forHandle lookup,
// rather than silently failing every video request.
let resolvedChannelId = null;
let resolvingPromise = null;

function extractHandle(raw) {
  if (!raw) return null;
  if (/^UC[\w-]{22}$/.test(raw)) return null; // already a real channel ID
  const urlMatch = raw.match(/youtube\.com\/@([\w.-]+)/i);
  if (urlMatch) return urlMatch[1];
  if (raw.startsWith('@')) return raw.slice(1);
  return null;
}

async function getChannelId() {
  if (resolvedChannelId) return resolvedChannelId;
  if (!CHANNEL_ID_RAW) return null;
  if (/^UC[\w-]{22}$/.test(CHANNEL_ID_RAW)) {
    resolvedChannelId = CHANNEL_ID_RAW;
    return resolvedChannelId;
  }
  const handle = extractHandle(CHANNEL_ID_RAW);
  if (!handle) {
    resolvedChannelId = CHANNEL_ID_RAW; // unrecognized format — use as-is, let the API report the real error
    return resolvedChannelId;
  }
  if (!resolvingPromise) {
    resolvingPromise = axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: { key: YOUTUBE_API_KEY, forHandle: handle, part: 'id' },
    }).then(res => {
      resolvedChannelId = res.data.items?.[0]?.id || CHANNEL_ID_RAW;
      if (!res.data.items?.[0]?.id) {
        console.error(`Could not resolve YouTube handle "${handle}" to a channel ID`);
      }
      return resolvedChannelId;
    }).catch(err => {
      console.error('Failed to resolve YouTube handle to channel ID:', err.message);
      resolvedChannelId = CHANNEL_ID_RAW;
      return resolvedChannelId;
    });
  }
  return resolvingPromise;
}

// Parses a YouTube ISO 8601 duration ("PT1H2M3S") into H:MM:SS / M:SS.
//
// NOTE: this regex and the same H ? long-form : short-form logic are
// duplicated in client/src/components/VideoPage/VideoPlayer.jsx
// (parseIsoDuration + formatTime) — client (Vite/ESM) and server
// (CommonJS) are separate npm packages with no shared workspace today, so
// there's no clean import path between them without introducing monorepo
// tooling. If you fix a duration-parsing edge case here (e.g. "PT0S",
// "PT45S", "PT1H2M3S"), fix it there too.
function formatDuration(iso) {
  if (!iso) return null;
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return iso;
  const h = +(m[1] || 0);
  const min = +(m[2] || 0);
  const s = +(m[3] || 0);
  const pad = n => String(n).padStart(2, '0');
  return h ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
}

function inferCategory(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  if (/\b(lecture|talk|seminar|guest|presentation|speaker|discussion)\b/.test(text)) return 'Lecture';
  if (/\b(meeting|sync|standup|check-in|catch-up|update)\b/.test(text)) return 'Meeting';
  if (/\b(tutorial|guide|how to|demo|walkthrough|workshop|intro)\b/.test(text)) return 'Tutorial';
  return 'Research';
}

// Shared by both routes that accept a maxResults query param, so a client
// (or attacker) can't request an unbounded batch and burn YouTube API
// quota / cache memory in one call.
function clampMaxResults(value, fallback = 10) {
  return Math.min(Math.max(parseInt(value, 10) || fallback, 1), 50);
}

function bestThumb(thumbnails) {
  return (
    thumbnails.maxres?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url
  );
}

async function fetchChannelVideos(maxResults = 10) {
  const cacheKey = `list:${maxResults}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const search = await axios.get(SEARCH_URL, {
    params: {
      key: YOUTUBE_API_KEY,
      channelId: await getChannelId(),
      part: 'snippet',
      order: 'date',
      maxResults,
    },
  });

  const base = search.data.items
    .filter(item => item.id.kind === 'youtube#video')
    .map(item => ({
      _id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      author: item.snippet.channelTitle,
      uploadDate: item.snippet.publishedAt,
      category: inferCategory(item.snippet.title, item.snippet.description),
    }));

  const ids = base.map(v => v._id);
  if (ids.length) {
    const details = await axios.get(DETAILS_URL, {
      params: { key: YOUTUBE_API_KEY, id: ids.join(','), part: 'contentDetails,statistics' },
    });
    const byId = new Map(details.data.items.map(it => [it.id, it]));
    for (const v of base) {
      const d = byId.get(v._id);
      if (!d) continue;
      v.duration = d.contentDetails?.duration || null;
      v.durationLabel = formatDuration(v.duration);
      v.views = d.statistics?.viewCount || '0';
      v.likes = d.statistics?.likeCount || '0';
    }
  }

  cacheSet(cacheKey, base, LIST_TTL);
  return base;
}

// GET /videos
router.get('/', async (req, res) => {
  try {
    const maxResults = clampMaxResults(req.query.maxResults, 10);
    const videos = await fetchChannelVideos(maxResults);
    res.json(videos);
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error.message);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `detail:${id}`;
    const cached = cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const response = await axios.get(DETAILS_URL, {
      params: {
        key: YOUTUBE_API_KEY,
        id,
        part: 'snippet,contentDetails,statistics',
      },
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const video = response.data.items[0];
    const formattedVideo = {
      _id: id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: bestThumb(video.snippet.thumbnails),
      author: video.snippet.channelTitle,
      uploadDate: video.snippet.publishedAt,
      category: inferCategory(video.snippet.title, video.snippet.description),
      views: video.statistics?.viewCount || '0',
      likes: video.statistics?.likeCount || '0',
      duration: video.contentDetails?.duration || null,
      durationLabel: formatDuration(video.contentDetails?.duration),
    };

    cacheSet(cacheKey, formattedVideo, DETAIL_TTL);
    res.json(formattedVideo);
  } catch (error) {
    console.error('Failed to fetch video by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// GET /videos/:id/related - server-side related ranking
router.get('/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    // fetch a batch of candidate videos from YouTube (cached when possible)
    const maxResults = req.query.maxResults || 12;
    const pool = await fetchChannelVideos(maxResults);

    const items = pool
      .filter(v => v._id !== id) // never recommend the video you're currently watching
      .map(v => ({
        _id: v._id,
        title: v.title,
        description: v.description,
        thumbnail: v.thumbnail,
        author: v.author,
        uploadDate: v.uploadDate,
        durationLabel: v.durationLabel,
      }));

    // Compute click counts specifically for "clicked from this video" (fromVideoId),
    // not global click counts across the whole site.
    const clickAgg = await VideoClick.aggregate([
      { $match: { fromVideoId: id, toVideoId: { $in: items.map(i => i._id) } } },
      { $group: { _id: '$toVideoId', clicks: { $sum: 1 } } }
    ]);
    const clickMap = clickAgg.reduce((acc, cur) => { acc[cur._id] = cur.clicks; return acc; }, {});

    // Score candidates: clicks weight + recency weight
    const scored = items.map(i => {
      const clicks = clickMap[i._id] || 0;
      const ageDays = Math.max(0, Math.floor((Date.now() - new Date(i.uploadDate).getTime()) / (1000 * 60 * 60 * 24)));
      const recencyScore = Math.max(0, 30 - ageDays);
      const score = clicks * 10 + recencyScore;
      return { item: i, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 6).map(s => s.item);
    res.json(top);
  } catch (err) {
    console.error('Error in related endpoint', err.message);
    res.status(500).json({ error: 'Failed to compute related videos' });
  }
});

// POST /videos/:id/click - log a related video click
router.post('/:id/click', async (req, res) => {
  try {
    const fromId = req.params.id;
    const { toVideoId } = req.body;
    if (!toVideoId) return res.status(400).json({ error: 'Missing toVideoId' });
    await VideoClick.create({ fromVideoId: fromId, toVideoId, userAgent: req.headers['user-agent'] || '', ip: req.ip });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to log click', err.message);
    res.status(500).json({ error: 'Failed to log click' });
  }
});


module.exports = router;
