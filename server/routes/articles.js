const express = require('express');
const router = express.Router();
const Article = require('../models/Article');


// GET all or filtered articles
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    // case-insensitive match — the client always sends lowercased categories
    const filter = category && category !== 'all'
      ? { category: new RegExp(`^${category}$`, 'i') }
      : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const articles = await Article.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// GET /articles/:id
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article' });
  }
});

// Note: article creation/update/deletion is intentionally only available at
// POST/PUT/DELETE /admin/articles (see routes/admin.js) — that path is
// protected by adminAuth and handles Multer + Cloudinary image upload.
// An unauthenticated POST / used to live here as a duplicate, unprotected
// way to create articles; it has been removed as a security fix.

module.exports = router;
