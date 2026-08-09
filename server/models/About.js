const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true, trim: true, maxlength: 20000 },
  updatedAt: { type: Date, default: Date.now },
});

// Keep updatedAt current on every save, not just document creation.
aboutSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('About', aboutSchema);
