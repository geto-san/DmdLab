const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Article = require('../models/Article');
const Announcement = require('../models/Announcement');
const Member = require('../models/Member');
const Post = require('../models/Post');
const About = require('../models/About');
const Video = require('../models/Video');
const Content = require('../models/Content');
const { ADMIN_USER, ADMIN_PASS, ADMIN_PASS_HASH, JWT_SECRET, JWT_EXPIRES } = require('../config/auth');

// Constant-time string comparison. Buffers of different lengths can't be
// compared by crypto.timingSafeEqual directly, so we still run a dummy
// comparison in that branch to avoid leaking the expected length via timing.
function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(String(a ?? ''));
  const bufB = Buffer.from(String(b ?? ''));
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  const usernameOk = timingSafeStringEqual(username, ADMIN_USER);

  let passwordOk = false;
  if (ADMIN_PASS_HASH) {
    passwordOk = await bcrypt.compare(password, ADMIN_PASS_HASH).catch(() => false);
  } else if (ADMIN_PASS) {
    passwordOk = timingSafeStringEqual(password, ADMIN_PASS);
  }

  if (!usernameOk || !passwordOk) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  res.json({ token });
};

exports.getProfile = async (req, res) => {
  res.json({ username: req.admin.username });
};

// Articles CRUD (admin)
const { uploadStream, cloudinary } = require('../utils/cloudinary');
const { getIo } = require('../socket');

exports.createArticle = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file && req.file.buffer) {
      const result = await uploadStream(req.file.buffer, { folder: 'deepminds/articles' });
      data.image = result.secure_url;
      data.image_public_id = result.public_id;
    }
    const newArticle = new Article(data);
    const saved = await newArticle.save();
    try { getIo().emit('article:created', saved); } catch { /* socket not ready */ }
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add article', details: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file && req.file.buffer) {
      // if existing article had an image, remove it
      const existing = await Article.findById(req.params.id);
      if (existing && existing.image_public_id) {
        try { await cloudinary.uploader.destroy(existing.image_public_id); } catch { /* ignore */ }
      }
      const result = await uploadStream(req.file.buffer, { folder: 'deepminds/articles' });
      data.image = result.secure_url;
      data.image_public_id = result.public_id;
    }
    const updated = await Article.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ error: 'Article not found' });
  try { getIo().emit('article:updated', updated); } catch { /* socket not ready */ }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update article', details: err.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const removed = await Article.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Article not found' });
    if (removed.image_public_id) {
      try { await cloudinary.uploader.destroy(removed.image_public_id); } catch { /* ignore */ }
    }
    try { getIo().emit('article:deleted', { id: req.params.id }); } catch { /* socket not ready */ }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete article', details: err.message });
  }
};

// Generic CRUD for Announcement, Member, Post, About
const makeCrud = (Model, eventPrefix) => ({
  list: async (req, res) => {
    try {
      const docs = await Model.find({});
      res.json(docs);
    } catch (err) { res.status(400).json({ error: err.message }); }
  },
  create: async (req, res) => {
    try {
      const doc = new Model(req.body);
      const saved = await doc.save();
      try { getIo().emit(`${eventPrefix}:created`, saved); } catch { /* socket not ready */ }
      res.status(201).json(saved);
    } catch (err) { res.status(400).json({ error: err.message }); }
  },
  update: async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      try { getIo().emit(`${eventPrefix}:updated`, updated); } catch { /* socket not ready */ }
      res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
  },
  delete: async (req, res) => {
    try {
      const removed = await Model.findByIdAndDelete(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Not found' });
      try { getIo().emit(`${eventPrefix}:deleted`, { id: req.params.id }); } catch { /* socket not ready */ }
      res.json({ success: true });
    } catch (err) { res.status(400).json({ error: err.message }); }
  }
});

exports.announcement = makeCrud(Announcement, 'announcement');
exports.member = makeCrud(Member, 'member');
exports.post = makeCrud(Post, 'post');
exports.about = makeCrud(About, 'about');
exports.video = makeCrud(Video, 'video');

// Content blocks (CMS). Dedicated handlers instead of makeCrud so we can
// normalize the JSON payload, enforce a unique key, and emit socket events.
exports.content = {
  list: async (req, res) => {
    try {
      const docs = await Content.find({}).sort({ section: 1, key: 1 });
      res.json(docs);
    } catch (err) { res.status(400).json({ error: err.message }); }
  },
  create: async (req, res) => {
    try {
      const { key, section, title, enabled, payload } = req.body;
      if (!key || !/^[a-z0-9-]+$/.test(String(key))) {
        return res.status(400).json({ error: 'key must be lowercase alphanumeric with dashes (e.g. hero)' });
      }
      if (payload !== undefined && (typeof payload !== 'object' || Array.isArray(payload) || payload === null)) {
        return res.status(400).json({ error: 'payload must be a JSON object' });
      }
      const doc = new Content({
        key: String(key).trim().toLowerCase(),
        section: String(section || 'general').trim(),
        title: String(title || ''),
        enabled: enabled !== false,
        payload: payload || {},
      });
      const saved = await doc.save();
      try { getIo().emit('content:created', saved); } catch { /* socket not ready */ }
      res.status(201).json(saved);
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ error: `Content key "${req.body.key}" already exists` });
      res.status(400).json({ error: err.message });
    }
  },
  update: async (req, res) => {
    try {
      const data = { ...req.body };
      delete data._id;
      if (data.key !== undefined && !/^[a-z0-9-]+$/.test(String(data.key))) {
        return res.status(400).json({ error: 'key must be lowercase alphanumeric with dashes (e.g. hero)' });
      }
      if (data.payload !== undefined && (typeof data.payload !== 'object' || Array.isArray(data.payload) || data.payload === null)) {
        // Previously this silently replaced a malformed payload with {},
        // which looked like a successful save while actually wiping the
        // content block. Reject it instead so the admin sees the mistake.
        return res.status(400).json({ error: 'payload must be a JSON object' });
      }
      const updated = await Content.findByIdAndUpdate(req.params.id, data, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      try { getIo().emit('content:updated', updated); } catch { /* socket not ready */ }
      res.json(updated);
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ error: `Content key "${req.body.key}" already exists` });
      res.status(400).json({ error: err.message });
    }
  },
  delete: async (req, res) => {
    try {
      const removed = await Content.findByIdAndDelete(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Not found' });
      try { getIo().emit('content:deleted', { id: req.params.id }); } catch { /* socket not ready */ }
      res.json({ success: true });
    } catch (err) { res.status(400).json({ error: err.message }); }
  }
};
