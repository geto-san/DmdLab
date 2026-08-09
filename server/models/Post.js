const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true, trim: true, maxlength: 20000 },
  author: { type: String, trim: true, maxlength: 100, default: 'Unknown' },
  date: { type: Date, default: Date.now },
  tags: { type: [{ type: String, trim: true, maxlength: 50 }], default: [] },
});

module.exports = mongoose.model('Post', postSchema);
