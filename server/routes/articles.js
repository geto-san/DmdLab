const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { sendServerError } = require('../utils/errors');


// GET all or filtered articles
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    // case-insensitive match — the client always sends lowercased categories
    const filter = category && category !== 'all'
      ? { category: new RegExp(`^${category}$`, 'i') }
      : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    // Read-only, JSON-serialized response — .lean() skips hydrating full
    // Mongoose documents (getters/setters/methods) we never use here.
    const articles = await Article.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    res.json(articles);
  } catch (err) {
    sendServerError(res, err, 'GET /articles', 'Failed to fetch articles');
  }
});

// GET /articles/:id
router.get('/:id', async (req, res) => {
  try {
    // Atomically increments the view counter and returns the updated doc
    // in one round trip — the `views` field existed on the model but
    // nothing was ever incrementing it.
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    sendServerError(res, err, 'GET /articles/:id', 'Failed to fetch article');
  }
});

// Note: article creation/update/deletion is intentionally only available at
// POST/PUT/DELETE /admin/articles (see routes/admin.js) — that path is
// protected by adminAuth and handles Multer + Cloudinary image upload.
// An unauthenticated POST / used to live here as a duplicate, unprotected
// way to create articles; it has been removed as a security fix.

module.exports = router;
