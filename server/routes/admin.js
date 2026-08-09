const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');

// memory storage; we'll upload buffer to Cloudinary. fileFilter rejects
// anything that isn't a common image type — accept="image/*" on the client
// is trivially spoofable, so this has to be enforced server-side too.
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'));
    }
    cb(null, true);
  },
});

// Turns a multer/fileFilter rejection into a clean 400 instead of falling
// through to Express's generic 500 error page.
function handleUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError || (err && /image/i.test(err.message))) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
}

// 5 attempts per 15 minutes per IP — slows down credential brute-forcing
// without punishing a normal admin who mistypes a password once or twice.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in a few minutes.' },
});

// Public login
router.post('/login', loginLimiter, adminController.login);

// Protected profile
router.get('/profile', adminAuth, adminController.getProfile);

// Articles (accept optional image via multipart form field 'image')
router.post('/articles', adminAuth, upload.single('image'), handleUploadError, adminController.createArticle);
router.put('/articles/:id', adminAuth, upload.single('image'), handleUploadError, adminController.updateArticle);
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

router.get('/videos', adminAuth, adminController.video.list);
router.post('/videos', adminAuth, adminController.video.create);
router.put('/videos/:id', adminAuth, adminController.video.update);
router.delete('/videos/:id', adminAuth, adminController.video.delete);

// Content blocks (CMS) - JWT protected
router.get('/content', adminAuth, adminController.content.list);
router.post('/content', adminAuth, adminController.content.create);
router.put('/content/:id', adminAuth, adminController.content.update);
router.delete('/content/:id', adminAuth, adminController.content.delete);

module.exports = router;
