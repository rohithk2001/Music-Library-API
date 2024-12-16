const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const albumSchema = new mongoose.Schema({
  album_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Album name is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Release year is required'],
  },
  hidden: {
    type: Boolean,
    default: false, // Visibility toggle
  },
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
