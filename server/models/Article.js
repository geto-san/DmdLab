const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  author: String,
  date: Date,
  category: String,
  views: String,
  tags: [String]
});

module.exports = mongoose.model('Article', articleSchema);
