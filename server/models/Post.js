const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: { type: Date, default: Date.now },
  tags: [String]
});

module.exports = mongoose.model('Post', postSchema);
