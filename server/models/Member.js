const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  role: { type: String, trim: true, maxlength: 100 },
  bio: { type: String, trim: true, maxlength: 2000 },
  photo: { type: String, trim: true, maxlength: 500 }, // image URL
});

module.exports = mongoose.model('Member', memberSchema);
