const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// Public read-only CMS endpoints. All writes happen under /admin/content
// behind the Bearer JWT; these only serve enabled blocks to the SPA.

// GET /content - all enabled blocks
router.get('/', async (req, res) => {
  try {
    const blocks = await Content.find({ enabled: true }).select('key section payload');
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /content/:key - single enabled block
router.get('/:key', async (req, res) => {
  try {
    const block = await Content.findOne({ key: req.params.key, enabled: true }).select('key section payload');
    if (!block) return res.status(404).json({ error: 'Content block not found' });
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
