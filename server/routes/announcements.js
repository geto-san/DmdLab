const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// GET /announcements - list latest announcements (most recent first)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const announcements = await Announcement.find({}).sort({ date: -1 }).limit(limit);
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// GET /announcements/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await Announcement.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
