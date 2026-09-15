const mongoose = require('mongoose');

/**
 * ============================================================================
 * QUIZ SCORE MODEL SCHEMA
 * College WAD Edition
 * ============================================================================
 */
const quizScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  score: {
    type: Number,
    required: [true, 'Quiz score is required']
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions count is required']
  },
  percentage: {
    type: Number,
    required: [true, 'Score percentage is required']
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast query of user quiz history sorted newest first
quizScoreSchema.index({ userId: 1, completedAt: -1 });

const QuizScore = mongoose.model('QuizScore', quizScoreSchema);

module.exports = QuizScore;
