const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
