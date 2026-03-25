const express = require('express');
const router = express.Router();
const Article = require('../models/Article');


// GET all or filtered articles
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
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


// POST new article
router.post('/', async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const saved = await newArticle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add article' });
  }
});

module.exports = router;
