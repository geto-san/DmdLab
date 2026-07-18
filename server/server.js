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
  'http://localhost:5173',
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()) : []),
];

// Security
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://dmd-lab.vercel.app", "https://dmdlab.onrender.com", "data:"],
    },
  })
);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser tools (curl, server-to-server) with no Origin header
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
}));
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

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Connect to Mongo and start server
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
