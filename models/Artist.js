const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const artistSchema = new mongoose.Schema({
  artist_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
  },
  grammy: {
    type: Number,
    default: 0, // Defaults to not winning a Grammy
  },
  hidden: {
    type: Boolean,
    default: false, // Visibility toggle
  },
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
