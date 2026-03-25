const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const VideoClick = require('../models/VideoClick');
const Video = null; // placeholder for future video DB model


// GET /videos
router.get('/', async (req, res) => {
  try {
    const maxResults = req.query.maxResults || 10;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YOUTUBE_API_KEY,
        channelId: CHANNEL_ID,
        part: 'snippet',
        order: 'date',
        maxResults
      },
    });

    const videos = response.data.items
      .filter(item => item.id.kind === 'youtube#video')
      .map(item => ({
        _id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        author: item.snippet.channelTitle,
        uploadDate: item.snippet.publishedAt
      }));

    res.json(videos);
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error.message);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
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
      thumbnail: video.snippet.thumbnails.medium.url,
      author: video.snippet.channelTitle,
      uploadDate: video.snippet.publishedAt,
      category: 'YouTube',
      views: video.statistics.viewCount,
      likes: video.statistics.likeCount,
      duration: video.contentDetails.duration,
    };

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
    // fetch a batch of candidate videos from YouTube
    const maxResults = req.query.maxResults || 12;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YOUTUBE_API_KEY,
        channelId: CHANNEL_ID,
        part: 'snippet',
        order: 'date',
        maxResults
      }
    });

    const items = response.data.items.filter(item => item.id.kind === 'youtube#video')
      .map(item => ({
        _id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url,
        uploadDate: item.snippet.publishedAt
      }));

    // Compute click counts where toVideoId equals candidate._id and fromVideoId equals current id
    const clickAgg = await VideoClick.aggregate([
      { $match: { toVideoId: { $in: items.map(i => i._id) } } },
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
