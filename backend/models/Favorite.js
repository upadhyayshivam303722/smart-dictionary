const mongoose = require('mongoose');

/**
 * ============================================================================
 * FAVORITE MODEL SCHEMA
 * College WAD Edition
 * ============================================================================
 */
const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  word: {
    type: String,
    required: [true, 'Word is required'],
    lowercase: true,
    trim: true
  },
  phonetic: {
    type: String,
    default: ''
  },
  partOfSpeech: {
    type: String,
    default: 'noun'
  },
  definition: {
    type: String,
    default: ''
  },
  example: {
    type: String,
    default: ''
  },
  audio: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to prevent duplicate favorites per user
favoriteSchema.index({ userId: 1, word: 1 }, { unique: true });

// Create Mongoose Model
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
