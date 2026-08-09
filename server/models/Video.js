const mongoose = require('mongoose');

// Loosely validates youtube.com/youtu.be watch, share, or embed URLs —
// not exhaustive, but catches obviously-wrong input (e.g. a random URL or
// plain text) before it reaches the DB.
const YOUTUBE_URL_RE = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i;

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  youtubeUrl: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
    validate: {
      validator: (v) => YOUTUBE_URL_RE.test(v),
      message: (props) => `"${props.value}" doesn't look like a YouTube URL`,
    },
  },
  description: { type: String, trim: true, maxlength: 5000 },
  publishedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', videoSchema);
