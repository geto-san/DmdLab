const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: String,
  role: String,
  bio: String,
  photo: String,
});

module.exports = mongoose.model('Member', memberSchema);
