const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true }, // short summary shown in cards/lists
  content: { type: String }, // full article body
  author: { type: String, trim: true, default: 'Unknown' },
  date: { type: Date, default: Date.now },
  category: { type: String, trim: true, default: 'General' },
  views: { type: Number, default: 0 },
  tags: [String],
  image: String, // Cloudinary secure_url
  image_public_id: String, // Cloudinary public_id, needed to delete/replace the image
});

// Matches the actual query pattern used by GET /articles (filter by category, sort by date)
articleSchema.index({ category: 1, date: -1 });

module.exports = mongoose.model('Article', articleSchema);
