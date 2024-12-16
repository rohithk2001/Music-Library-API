const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const favoriteSchema = new mongoose.Schema({
  favorite_id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: true,
  },
  albums: [{
    type: mongoose.Schema.Types.String,
    ref: 'Album',
  }],
  tracks: [{
    type: mongoose.Schema.Types.String,
    ref: 'Track',
  }],
  artists: [{
    type: mongoose.Schema.Types.String,
    ref: 'Artist',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
