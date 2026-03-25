const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');

// memory storage; we'll upload buffer to Cloudinary
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Public login
router.post('/login', adminController.login);

// Protected profile
router.get('/profile', adminAuth, adminController.getProfile);

// Articles (accept optional image via multipart form field 'image')
router.post('/articles', adminAuth, upload.single('image'), adminController.createArticle);
router.put('/articles/:id', adminAuth, upload.single('image'), adminController.updateArticle);
router.delete('/articles/:id', adminAuth, adminController.deleteArticle);

// Announcements, Members, Posts, About - generic CRUD
router.get('/announcements', adminAuth, adminController.announcement.list);
router.post('/announcements', adminAuth, adminController.announcement.create);
router.put('/announcements/:id', adminAuth, adminController.announcement.update);
router.delete('/announcements/:id', adminAuth, adminController.announcement.delete);

router.get('/members', adminAuth, adminController.member.list);
router.post('/members', adminAuth, adminController.member.create);
router.put('/members/:id', adminAuth, adminController.member.update);
router.delete('/members/:id', adminAuth, adminController.member.delete);

router.get('/posts', adminAuth, adminController.post.list);
router.post('/posts', adminAuth, adminController.post.create);
router.put('/posts/:id', adminAuth, adminController.post.update);
router.delete('/posts/:id', adminAuth, adminController.post.delete);

router.get('/about', adminAuth, adminController.about.list);
router.post('/about', adminAuth, adminController.about.create);
router.put('/about/:id', adminAuth, adminController.about.update);
router.delete('/about/:id', adminAuth, adminController.about.delete);

router.post('/videos', adminAuth, adminController.video.create);
router.put('/videos/:id', adminAuth, adminController.video.update);
router.delete('/videos/:id', adminAuth, adminController.video.delete);

module.exports = router;
