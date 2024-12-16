const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const trackSchema = new mongoose.Schema({
  track_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Track name is required'],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'], // Duration in seconds
  },
  hidden: {
    type: Boolean,
    default: false, // Visibility toggle
  },
}, { timestamps: true });

module.exports = mongoose.model('Track', trackSchema);
