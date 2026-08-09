const mongoose = require('mongoose');

// CMS content blocks. Each block is keyed by a slug (e.g. 'hero', 'stats')
// and carries an arbitrary JSON `payload` that the public SPA merges over its
// hardcoded defaults. Writes are admin-only (JWT); public reads are read-only.
const contentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/,
    },
    section: { type: String, default: 'general', trim: true },
    title: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
