const mongoose = require('mongoose');

/**
 * ============================================================================
 * SEARCH HISTORY MODEL SCHEMA
 * College WAD Edition
 * ============================================================================
 */
const searchHistorySchema = new mongoose.Schema({
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
  defsViewedCount: {
    type: Number,
    default: 1
  },
  searchedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for fast querying newest searches and checking existing word per user
searchHistorySchema.index({ userId: 1, searchedAt: -1 });
searchHistorySchema.index({ userId: 1, word: 1 });

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

module.exports = SearchHistory;
