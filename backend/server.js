/**
 * ============================================================================
 * SMART DICTIONARY - BACKEND SERVER
 * College WAD Edition (Node.js, Express, MongoDB & Authentication)
 * ============================================================================
 */

// 1. Import Dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Models & Data
const User = require('./models/User');
const Favorite = require('./models/Favorite');
const SearchHistory = require('./models/SearchHistory');
const QuizScore = require('./models/QuizScore');
const { DICTIONARY_FALLBACK } = require('./data/dictionaryData');

// In-Memory Dictionary Cache
const dictionaryCache = new Map();

// 2. Initialize Express Application
const app = express();

// 3. Configure Middleware
// Enable CORS (Cross-Origin Resource Sharing) to allow frontend to communicate with backend
app.use(cors());

// Enable JSON body parsing for incoming API requests
app.use(express.json());

// 4. Server Configuration Variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_dictionary';

// 5. Root & Health Check Routes
app.get('/', (req, res) => {
  res.json({
    project: 'Smart Dictionary API',
    edition: 'College WAD Edition',
    status: 'Online'
  });
});

// GET /api/test -> Returns backend status message
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Smart Dictionary backend is working!'
  });
});

// ============================================================================
// 6. AUTHENTICATION ROUTES (Register & Login)
// ============================================================================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (with password hashing)
 * @access  Public
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields: name, email, and password.'
      });
    }

    // 2. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long.'
      });
    }

    // 3. Check if email is already registered
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: 'A user with this email address already exists.'
      });
    }

    // 4. Hash the password with bcryptjs (10 salt rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Create and save new user in MongoDB
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // 6. Return success response (NEVER return the password)
    return res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        createdAt: savedUser.createdAt
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      message: 'Server error during registration. Please try again later.',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & verify password
 * @access  Public
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide both email and password.'
      });
    }

    // 2. Find user by email
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password.'
      });
    }

    // 3. Compare entered password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: 'Invalid email or password.'
      });
    }

    // 4. Return success response (NEVER return the password)
    return res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      message: 'Server error during login. Please try again later.',
      error: error.message
    });
  }
});

// ============================================================================
// 6.5 FAVORITES ROUTES (MongoDB Persistence)
// ============================================================================

/**
 * @route   POST /api/favorites
 * @desc    Save a favorite word for a specific user
 * @access  Public
 */
app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, word, phonetic, partOfSpeech, definition, example, audio } = req.body;

    // 1. Validate required fields
    if (!userId || !word) {
      return res.status(400).json({
        message: 'Please provide both userId and word.'
      });
    }

    const normalizedWord = word.trim().toLowerCase();

    // 2. Check if word is already favorited by this user
    const existingFavorite = await Favorite.findOne({
      userId: userId,
      word: normalizedWord
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: `"${word}" is already in your favorites.`,
        favorite: existingFavorite
      });
    }

    // 3. Create and save new Favorite in MongoDB
    const newFavorite = new Favorite({
      userId: userId,
      word: normalizedWord,
      phonetic: phonetic || '',
      partOfSpeech: partOfSpeech || 'noun',
      definition: definition || '',
      example: example || '',
      audio: audio || ''
    });

    const savedFavorite = await newFavorite.save();

    return res.status(201).json({
      message: `"${word}" added to favorites successfully!`,
      favorite: savedFavorite
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'This word is already in your favorites.'
      });
    }
    console.error('Add Favorite Error:', error);
    return res.status(500).json({
      message: 'Server error while saving favorite.',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/favorites/:userId
 * @desc    Get all favorite words for a specific user
 * @access  Public
 */
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: 'Please provide a valid userId.'
      });
    }

    const favorites = await Favorite.find({ userId: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      favorites: favorites,
      count: favorites.length
    });
  } catch (error) {
    console.error('Get Favorites Error:', error);
    return res.status(500).json({
      message: 'Server error while retrieving favorites.',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/favorites/:userId/:word
 * @desc    Remove a specific favorite word for a user
 * @access  Public
 */
app.delete('/api/favorites/:userId/:word', async (req, res) => {
  try {
    const { userId, word } = req.params;

    if (!userId || !word) {
      return res.status(400).json({
        message: 'Please provide both userId and word.'
      });
    }

    const normalizedWord = decodeURIComponent(word).trim().toLowerCase();

    const result = await Favorite.findOneAndDelete({
      userId: userId,
      word: normalizedWord
    });

    if (!result) {
      return res.status(404).json({
        message: `"${word}" was not found in your favorites.`
      });
    }

    return res.status(200).json({
      message: `"${word}" removed from favorites successfully!`,
      word: normalizedWord
    });
  } catch (error) {
    console.error('Delete Favorite Error:', error);
    return res.status(500).json({
      message: 'Server error while deleting favorite.',
      error: error.message
    });
  }
});

// ============================================================================
// 6.8 SEARCH HISTORY ROUTES (MongoDB Persistence)
// ============================================================================

/**
 * @route   POST /api/history
 * @desc    Save or update a search history entry for a user
 * @access  Public
 */
app.post('/api/history', async (req, res) => {
  try {
    const { userId, word, phonetic, partOfSpeech, definition, defsViewedCount } = req.body;

    // 1. Validate required fields
    if (!userId || !word) {
      return res.status(400).json({
        message: 'Please provide both userId and word.'
      });
    }

    const normalizedWord = word.trim().toLowerCase();
    if (!normalizedWord) {
      return res.status(400).json({
        message: 'Word cannot be empty.'
      });
    }

    // 2. Check if word already exists in history for this user
    // If it exists, update searchedAt to now and refresh metadata (avoiding duplicate rows)
    const existingEntry = await SearchHistory.findOne({
      userId: userId,
      word: normalizedWord
    });

    if (existingEntry) {
      existingEntry.searchedAt = new Date();
      if (phonetic) existingEntry.phonetic = phonetic;
      if (partOfSpeech) existingEntry.partOfSpeech = partOfSpeech;
      if (definition) existingEntry.definition = definition;
      if (defsViewedCount) existingEntry.defsViewedCount = defsViewedCount;

      const updatedEntry = await existingEntry.save();
      return res.status(200).json({
        message: `Search history for "${normalizedWord}" updated.`,
        history: updatedEntry
      });
    }

    // 3. Create new Search History record in MongoDB
    const newHistory = new SearchHistory({
      userId: userId,
      word: normalizedWord,
      phonetic: phonetic || '',
      partOfSpeech: partOfSpeech || 'noun',
      definition: definition || '',
      defsViewedCount: defsViewedCount || 1,
      searchedAt: new Date()
    });

    const savedHistory = await newHistory.save();

    return res.status(201).json({
      message: `"${normalizedWord}" added to search history successfully.`,
      history: savedHistory
    });
  } catch (error) {
    console.error('Add Search History Error:', error);
    return res.status(500).json({
      message: 'Server error while saving search history.',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/history/:userId
 * @desc    Get all search history entries for a specific user (newest first)
 * @access  Public
 */
app.get('/api/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: 'Please provide a valid userId.'
      });
    }

    const history = await SearchHistory.find({ userId: userId }).sort({ searchedAt: -1 });

    return res.status(200).json({
      history: history,
      count: history.length
    });
  } catch (error) {
    console.error('Get Search History Error:', error);
    return res.status(500).json({
      message: 'Server error while retrieving search history.',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/history/:userId/:word
 * @desc    Delete a specific word from user search history
 * @access  Public
 */
app.delete('/api/history/:userId/:word', async (req, res) => {
  try {
    const { userId, word } = req.params;

    if (!userId || !word) {
      return res.status(400).json({
        message: 'Please provide both userId and word.'
      });
    }

    const normalizedWord = decodeURIComponent(word).trim().toLowerCase();

    const result = await SearchHistory.findOneAndDelete({
      userId: userId,
      word: normalizedWord
    });

    if (!result) {
      return res.status(404).json({
        message: `"${word}" was not found in your search history.`
      });
    }

    return res.status(200).json({
      message: `"${word}" removed from search history successfully!`,
      word: normalizedWord
    });
  } catch (error) {
    console.error('Delete Search History Entry Error:', error);
    return res.status(500).json({
      message: 'Server error while deleting search history entry.',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/history/:userId
 * @desc    Clear all search history for a user
 * @access  Public
 */
app.delete('/api/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: 'Please provide a valid userId.'
      });
    }

    const result = await SearchHistory.deleteMany({ userId: userId });

    return res.status(200).json({
      message: 'All search history cleared successfully.',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Clear Search History Error:', error);
    return res.status(500).json({
      message: 'Server error while clearing search history.',
      error: error.message
    });
  }
});

// ============================================================================
// 6.9 VOCABULARY QUIZ SCORE ROUTES (MongoDB Persistence)
// ============================================================================

/**
 * @route   POST /api/quiz/scores
 * @desc    Save a completed quiz score for a user
 * @access  Public
 */
app.post('/api/quiz/scores', async (req, res) => {
  try {
    const { userId, score, totalQuestions, percentage } = req.body;

    // 1. Validate required fields
    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required.'
      });
    }

    if (score === undefined || score === null || isNaN(score) || score < 0) {
      return res.status(400).json({
        message: 'A valid numeric score is required.'
      });
    }

    if (!totalQuestions || isNaN(totalQuestions) || totalQuestions <= 0) {
      return res.status(400).json({
        message: 'A valid totalQuestions number greater than 0 is required.'
      });
    }

    const calculatedPercentage = percentage !== undefined && !isNaN(percentage)
      ? Number(percentage)
      : Math.round((Number(score) / Number(totalQuestions)) * 100);

    // 2. Create and save new QuizScore in MongoDB
    const newScore = new QuizScore({
      userId: userId,
      score: Number(score),
      totalQuestions: Number(totalQuestions),
      percentage: calculatedPercentage,
      completedAt: new Date()
    });

    const savedScore = await newScore.save();

    return res.status(201).json({
      message: 'Quiz score saved successfully!',
      quizScore: savedScore
    });
  } catch (error) {
    console.error('Save Quiz Score Error:', error);
    return res.status(500).json({
      message: 'Server error while saving quiz score.',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/quiz/scores/:userId
 * @desc    Get all quiz scores for a specific user (newest first)
 * @access  Public
 */
app.get('/api/quiz/scores/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: 'Please provide a valid userId.'
      });
    }

    const scores = await QuizScore.find({ userId: userId }).sort({ completedAt: -1 });

    return res.status(200).json({
      scores: scores,
      count: scores.length
    });
  } catch (error) {
    console.error('Get Quiz Scores Error:', error);
    return res.status(500).json({
      message: 'Server error while retrieving quiz scores.',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/quiz/scores/:userId/latest
 * @desc    Get the most recent quiz score for a user
 * @access  Public
 */
app.get('/api/quiz/scores/:userId/latest', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: 'Please provide a valid userId.'
      });
    }

    const latestScore = await QuizScore.findOne({ userId: userId }).sort({ completedAt: -1 });

    if (!latestScore) {
      return res.status(404).json({
        message: 'No quiz scores found for this user.'
      });
    }

    return res.status(200).json({
      latestScore: latestScore
    });
  } catch (error) {
    console.error('Get Latest Quiz Score Error:', error);
    return res.status(500).json({
      message: 'Server error while retrieving latest quiz score.',
      error: error.message
    });
  }
});

// ============================================================================
// 6.5 DICTIONARY PROXY ROUTE (Free Dictionary API)
// ============================================================================

/**
 * @route   GET /api/dictionary/:word
 * @desc    Proxies dictionary lookups to Free Dictionary API to avoid client-side browser timeouts & CORS
 * @access  Public
 */
app.get('/api/dictionary/:word', async (req, res) => {
  try {
    const rawWord = req.params.word;
    if (!rawWord || typeof rawWord !== 'string' || !rawWord.trim()) {
      return res.status(400).json({
        message: 'Please provide a valid word to search.'
      });
    }

    const cleanWord = rawWord.trim().toLowerCase();

    // Check in-memory cache
    if (dictionaryCache.has(cleanWord)) {
      console.log(`[Dictionary Backend] Serving from memory cache: "${cleanWord}"`);
      return res.status(200).json(dictionaryCache.get(cleanWord));
    }

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`;
    console.log(`[Dictionary Backend] Requesting: ${apiUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s fast upstream timeout

    let response;
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SmartDictionary-CollegeWAD/1.0'
        },
        signal: controller.signal
      });
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.error(`[Dictionary Backend] API request failed: ${fetchErr.message}`);

      // Check collegiate fallback lexicon if upstream is unresponsive
      if (DICTIONARY_FALLBACK && DICTIONARY_FALLBACK[cleanWord]) {
        console.log(`[Dictionary Backend] Serving collegiate fallback for: "${cleanWord}"`);
        const fallbackData = DICTIONARY_FALLBACK[cleanWord];
        dictionaryCache.set(cleanWord, fallbackData);
        return res.status(200).json(fallbackData);
      }

      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({
          title: 'Upstream Timeout',
          message: `The upstream dictionary service timed out while looking up "${cleanWord}".`,
          resolution: 'Please check your connection or try another collegiate term.'
        });
      }

      return res.status(502).json({
        title: 'Connection Error',
        message: `Failed to connect to dictionary service for "${cleanWord}".`,
        error: fetchErr.message
      });
    }

    clearTimeout(timeoutId);
    console.log(`[Dictionary Backend] API status: ${response.status}`);

    if (response.status === 404) {
      const notFoundData = await response.json().catch(() => ({ title: 'No Definitions Found', message: `Sorry, word "${cleanWord}" not found.` }));
      return res.status(404).json(notFoundData);
    }

    if (!response.ok) {
      // If Cloudflare returns 522/503/etc, try fallback
      if (DICTIONARY_FALLBACK && DICTIONARY_FALLBACK[cleanWord]) {
        console.log(`[Dictionary Backend] Serving collegiate fallback for: "${cleanWord}" after upstream ${response.status}`);
        const fallbackData = DICTIONARY_FALLBACK[cleanWord];
        dictionaryCache.set(cleanWord, fallbackData);
        return res.status(200).json(fallbackData);
      }
      const errData = await response.json().catch(() => ({ message: `Upstream error ${response.status}` }));
      return res.status(response.status).json(errData);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      dictionaryCache.set(cleanWord, data);
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error(`[Dictionary Backend] API request failed: ${error.message}`);
    return res.status(500).json({
      message: 'Server error while fetching dictionary definition.',
      error: error.message
    });
  }
});

// ============================================================================
// 7. CONNECT TO MONGODB & START SERVER
// ============================================================================
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} (host: 0.0.0.0)`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });
