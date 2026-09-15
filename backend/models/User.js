const mongoose = require('mongoose');

/**
 * ============================================================================
 * USER MODEL SCHEMA
 * College WAD Edition
 * ============================================================================
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Mongoose Model
const User = mongoose.model('User', userSchema);

module.exports = User;
