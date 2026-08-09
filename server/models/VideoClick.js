const mongoose = require('mongoose');

const videoClickSchema = new mongoose.Schema({
  fromVideoId: String,
  toVideoId: String,
  userAgent: String,
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

// The /videos/:id/related route aggregates on { fromVideoId, toVideoId }
// for every request — without this, it's a full collection scan as click
// volume grows. fromVideoId first, since every query filters on it with
// equality; toVideoId narrows via $in on top of that.
videoClickSchema.index({ fromVideoId: 1, toVideoId: 1 });

module.exports = mongoose.model('VideoClick', videoClickSchema);
