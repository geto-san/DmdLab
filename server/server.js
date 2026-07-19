require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8500;

// Known deployed frontends + local dev, extendable via CORS_ORIGINS (comma-separated)
const allowedOrigins = [
  'https://dmd-lab.vercel.app',
  'https://dmdlab.onrender.com',
  'https://dmdlab-504h.onrender.com', // actual Render service URL
  'https://dmd-72dkuis5b-geto-sans-projects.vercel.app', // known Vercel preview deploy
  'http://localhost:5173',
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()) : []),
];

// Vercel preview deployments get a unique hash per deploy
// (e.g. https://dmd-72dkuis5b-geto-sans-projects.vercel.app), so an exact
// allowlist alone breaks on every new preview. Allow any origin ending in
// a known suffix too, e.g. CORS_ORIGIN_SUFFIXES=-geto-sans-projects.vercel.app
const allowedOriginSuffixes = process.env.CORS_ORIGIN_SUFFIXES
  ? process.env.CORS_ORIGIN_SUFFIXES.split(',').map(s => s.trim())
  : [];

function isOriginAllowed(origin) {
  if (allowedOrigins.includes(origin)) return true;
  return allowedOriginSuffixes.some(suffix => origin.endsWith(suffix));
}

// Security
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://dmd-lab.vercel.app", "https://dmdlab.onrender.com", "https://dmdlab-504h.onrender.com", "data:"],
    },
  })
);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser tools (curl, server-to-server) with no Origin header
    if (!origin || isOriginAllowed(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
}));
// Give CORS rejections a clean 403 instead of falling through to a generic
// 500 — keeps real server errors distinguishable from CORS mismatches in logs.
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Not allowed by CORS', origin: req.headers.origin });
  }
  next(err);
});
app.use(express.json());

// Routes
const articleRoutes = require('./routes/articles');
app.use('/articles', articleRoutes);
const videoRoutes = require('./routes/videos');
app.use('/videos', videoRoutes);
const adminRoutes = require('./routes/admin');
// Mount admin API at /admin so the admin UI is available at https://<host>/admin
app.use('/admin', adminRoutes);
const announcementsRoutes = require('./routes/announcements');
app.use('/announcements', announcementsRoutes);

// Serve static files from the React app build directory — only if it was
// actually built alongside the server (monolith deploy). In a split deploy
// (e.g. this server on Render, client on Vercel) client/dist never exists
// here, so skip this entirely rather than erroring on every request.
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');
const hasClientBuild = fs.existsSync(clientIndexPath);

if (hasClientBuild) {
  app.use(express.static(clientDistPath));
  // Catch-all: send back React's index.html for any non-API route (SPA routing)
  app.get('*', (req, res) => res.sendFile(clientIndexPath));
} else {
  // API-only deploy: a simple health check at / instead of a broken SPA fallback
  app.get('/', (req, res) => res.json({ status: 'ok', service: 'dmdlab-api' }));
  // Anything else unmatched is a real 404, not an attempt to serve a missing file
  app.use((req, res) => res.status(404).json({ error: 'Not found' }));
}

// Connect to Mongo and start server
if (process.env.DB_NAME && /^cluster\d*$/i.test(process.env.DB_NAME.trim())) {
  console.warn(
    `⚠️  DB_NAME="${process.env.DB_NAME}" looks like an Atlas *cluster* name, not a database name. ` +
    `Mongo will happily create/use a database literally called "${process.env.DB_NAME}", which is ` +
    `probably not the database your collections actually live in. Double-check this value.`
  );
}

mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME || undefined })
  .then(() => {
    console.log('✅ MongoDB connected');
    // use native http server so socket.io can attach
    const http = require('http');
    const server = http.createServer(app);
    const { setupSocket } = require('./socket');
    setupSocket(server, allowedOrigins);
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    // exit with failure code so orchestrators can detect
    process.exit(1);
  });
