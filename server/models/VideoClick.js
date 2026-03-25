const mongoose = require('mongoose');

const videoClickSchema = new mongoose.Schema({
  fromVideoId: String,
  toVideoId: String,
  userAgent: String,
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VideoClick', videoClickSchema);
