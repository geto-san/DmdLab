const jwt = require('jsonwebtoken');
const Article = require('../models/Article');
const Announcement = require('../models/Announcement');
const Member = require('../models/Member');
const Post = require('../models/Post');
const About = require('../models/About');
const Video = require('../models/Video');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'deepminds-secret';
const JWT_EXPIRES = process.env.ADMIN_JWT_EXPIRES || '8h';

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  if (username !== ADMIN_USER || password !== ADMIN_PASS) return res.status(401).json({ error: 'Invalid credentials' });
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
    try { getIo().emit('article:created', saved); } catch(e) { /* socket not ready */ }
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
        try { await cloudinary.uploader.destroy(existing.image_public_id); } catch (e) { /* ignore */ }
      }
      const result = await uploadStream(req.file.buffer, { folder: 'deepminds/articles' });
      data.image = result.secure_url;
      data.image_public_id = result.public_id;
    }
    const updated = await Article.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ error: 'Article not found' });
  try { getIo().emit('article:updated', updated); } catch(e) { /* socket not ready */ }
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
      try { await cloudinary.uploader.destroy(removed.image_public_id); } catch (e) { /* ignore */ }
    }
    try { getIo().emit('article:deleted', { id: req.params.id }); } catch(e) { /* socket not ready */ }
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
      try { getIo().emit(`${eventPrefix}:created`, saved); } catch(e) { /* socket not ready */ }
      res.status(201).json(saved);
    } catch (err) { res.status(400).json({ error: err.message }); }
  },
  update: async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      try { getIo().emit(`${eventPrefix}:updated`, updated); } catch(e) { /* socket not ready */ }
      res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
  },
  delete: async (req, res) => {
    try {
      const removed = await Model.findByIdAndDelete(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Not found' });
      try { getIo().emit(`${eventPrefix}:deleted`, { id: req.params.id }); } catch(e) { /* socket not ready */ }
      res.json({ success: true });
    } catch (err) { res.status(400).json({ error: err.message }); }
  }
});

exports.announcement = makeCrud(Announcement, 'announcement');
exports.member = makeCrud(Member, 'member');
exports.post = makeCrud(Post, 'post');
exports.about = makeCrud(About, 'about');
exports.video = makeCrud(Video, 'video');
