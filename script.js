/**
 * ============================================================================
 * SMART DICTIONARY - JAVASCRIPT & API CONTROLLER
 * College WAD Edition
 *
 * Implements:
 * 1. Home / Search Page View
 * 2. Dedicated Word Result View (Google Stitch Design)
 * 3. Favorites View / Personal Lexicon System (LocalStorage)
 * 4. Search History View & Learning Velocity Tracker (LocalStorage)
 * 5. Vocabulary Quiz Engine (Google Stitch Design)
 * 6. Free Dictionary API Integration (https://api.dictionaryapi.dev/)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DOM ELEMENT REFERENCES
  // --------------------------------------------------------------------------
  // Main Page Views
  const homeView = document.getElementById('homeView');
  const wordResultView = document.getElementById('wordResultView');
  const favoritesView = document.getElementById('favoritesView');
  const historyView = document.getElementById('historyView');
  const quizView = document.getElementById('quizView');
  const wordResultDynamicContent = document.getElementById('wordResultDynamicContent');

  // Search Inputs & Forms
  const searchInput = document.getElementById('mainSearchInput');
  const searchForm = document.getElementById('searchForm');
  const searchSubmitBtn = document.getElementById('searchSubmitBtn');
  const quickLookupBtn = document.getElementById('quickLookupTrigger');
  const voiceSearchBtn = document.getElementById('voiceSearchBtn');

  // Navigation & Headers
  const headerLogoLink = document.getElementById('headerLogoLink');
  const backToHomeBtn = document.getElementById('backToHomeBtn');
  const navHomePill = document.getElementById('navHomePill');
  const navFavoritesPill = document.getElementById('navFavoritesPill');
  const navHistoryPill = document.getElementById('navHistoryPill');
  const navQuizPill = document.getElementById('navQuizPill');
  const favCountBadge = document.getElementById('favCount');
  const navMenu = document.getElementById('navMenu');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navPills = document.querySelectorAll('.nav-pill');

  // Mobile Bottom Navigation Items
  const bottomNavHome = document.getElementById('bottomNavHome');
  const bottomNavFav = document.getElementById('bottomNavFav');
  const bottomNavHistory = document.getElementById('bottomNavHistory');
  const bottomNavQuiz = document.getElementById('bottomNavQuiz');
  const bottomFavCount = document.getElementById('bottomFavCount');

  // Homepage Elements
  const favoriteToggleBtn = document.getElementById('favoriteToggleBtn');
  const playAudioBtn = document.getElementById('playAudioBtn');
  const recentChipsList = document.getElementById('recentChipsList');
  const clearRecentBtn = document.getElementById('clearRecentBtn');
  const trendChips = document.querySelectorAll('.trend-chip');
  const rankedItems = document.querySelectorAll('.ranked-item');
  const toastContainer = document.getElementById('toastContainer');

  // Favorites View Elements
  const favSubtitleCount = document.getElementById('favSubtitleCount');
  const readinessScorePercent = document.getElementById('readinessScorePercent');
  const readinessDesc = document.getElementById('readinessDesc');
  const favFilterInput = document.getElementById('favFilterInput');
  const favFilterPills = document.getElementById('favFilterPills');
  const savedWordsList = document.getElementById('savedWordsList');
  const favPracticeQuizBtn = document.getElementById('favPracticeQuizBtn');
  const exportListBtn = document.getElementById('exportListBtn');

  // Favorites Category Filter Pill Counter Elements
  const filterAllCount = document.getElementById('filterAllCount');
  const filterAdjCount = document.getElementById('filterAdjCount');
  const filterNounCount = document.getElementById('filterNounCount');
  const filterVerbCount = document.getElementById('filterVerbCount');

  // Search History View Elements
  const historyWeeklyCount = document.getElementById('historyWeeklyCount');
  const historyTopCategory = document.getElementById('historyTopCategory');
  const clearAllHistoryBtn = document.getElementById('clearAllHistoryBtn');
  const historyFilterInput = document.getElementById('historyFilterInput');
  const historyGroupsList = document.getElementById('historyGroupsList');

  // Vocabulary Quiz Elements
  const quizDynamicContent = document.getElementById('quizDynamicContent');
  const quizProgressCounter = document.getElementById('quizProgressCounter');
  const quizProgressFill = document.getElementById('quizProgressFill');
  const quizXpText = document.getElementById('quizXpText');
  const quizAccuracyVal = document.getElementById('quizAccuracyVal');
  const quizBottomStatsRow = document.getElementById('quizBottomStatsRow');
  const quizDeckBanner = document.getElementById('quizDeckBanner');

  // User Profile & Dropdown Elements
  const userProfileBadge = document.getElementById('userProfileBadge');
  const userDropdownMenu = document.getElementById('userDropdownMenu');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const userRoleDisplay = document.getElementById('userRoleDisplay');
  const userOnlineIndicator = document.getElementById('userOnlineIndicator');
  const dropdownUserName = document.getElementById('dropdownUserName');
  const dropdownUserEmail = document.getElementById('dropdownUserEmail');
  const dropdownAvatarCircle = document.getElementById('dropdownAvatarCircle');
  const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');

  // Authentication Modal Elements
  const authModalOverlay = document.getElementById('authModalOverlay');
  const authModalBackdrop = document.getElementById('authModalBackdrop');
  const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
  const authModalTitle = document.getElementById('authModalTitle');
  const authModalSubtitle = document.getElementById('authModalSubtitle');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');

  // Auth Forms & Inputs
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  const loginAlert = document.getElementById('loginAlert');
  const toggleLoginPwdBtn = document.getElementById('toggleLoginPwdBtn');
  const switchToRegisterLink = document.getElementById('switchToRegisterLink');

  const registerForm = document.getElementById('registerForm');
  const registerName = document.getElementById('registerName');
  const registerEmail = document.getElementById('registerEmail');
  const registerPassword = document.getElementById('registerPassword');
  const registerSubmitBtn = document.getElementById('registerSubmitBtn');
  const registerAlert = document.getElementById('registerAlert');
  const toggleRegisterPwdBtn = document.getElementById('toggleRegisterPwdBtn');
  const switchToLoginLink = document.getElementById('switchToLoginLink');

  // Backend Auth, Favorites, Search History, Quiz & Dictionary Proxy Constants
  const AUTH_API_URL = 'http://localhost:5000/api/auth';
  const FAVORITES_API_URL = 'http://localhost:5000/api/favorites';
  const HISTORY_API_URL = 'http://localhost:5000/api/history';
  const QUIZ_API_URL = 'http://localhost:5000/api/quiz/scores';
  const DICTIONARY_API_URL = 'http://localhost:5000/api/dictionary';
  const USER_STORAGE_KEY = 'smart_dict_user';

  // State Variables
  let userFavoritesList = []; // Holds user favorites loaded from MongoDB
  let userHistoryList = [];   // Holds user search history loaded from MongoDB
  let isFetchingFavorites = false;
  let isFetchingHistory = false;
  let isSearching = false;
  let currentSearchAudioUrl = '';
  let currentWordEntryData = null; // Caches full current result data for saving
  let currentFavFilter = 'all';    // 'all' | 'adjective' | 'noun' | 'verb'
  let currentFavSearchQuery = '';
  let currentHistorySearchQuery = '';

  // Quiz Engine State
  let currentQuizIndex = 0;
  let quizScore = 0;
  let quizTotalPoints = 200;
  let isCurrentQuestionAnswered = false;
  let quizUserAnswers = []; // Records user responses for the final review breakdown

  // --------------------------------------------------------------------------
  // 2. CURATED VOCABULARY QUIZ DATA (5 Multiple Choice Questions)
  // --------------------------------------------------------------------------
  const QUIZ_QUESTIONS = [
    {
      word: 'Eloquent',
      category: 'SYNONYM CHALLENGE',
      partOfSpeech: 'Adjective',
      origin: 'Origin: Latin (ēloquēns)',
      questionHtml: 'What is the closest synonym for the word "<u>Eloquent</u>"?',
      options: [
        'Hesitant and shy',
        'Articulate and persuasive',
        'Harsh and loud',
        'Complex and confusing'
      ],
      correctIndex: 1,
      explanation: '"Eloquent" means fluent or persuasive in speaking or writing. It originates from Latin eloqui (\'to speak out\').'
    },
    {
      word: 'Ephemeral',
      category: 'DEFINITION MASTERY',
      partOfSpeech: 'Adjective',
      origin: 'Origin: Greek (ephēmeros)',
      questionHtml: 'Which definition best describes the collegiate term "<u>Ephemeral</u>"?',
      options: [
        'Enduring for centuries',
        'Lasting for a very short, fleeting time',
        'Extremely dense and heavy',
        'Existing in enormous quantities'
      ],
      correctIndex: 1,
      explanation: '"Ephemeral" describes things that are fleeting or transitory, derived from the Greek word for \'lasting only a day\'.'
    },
    {
      word: 'Serendipity',
      category: 'CONTEXTUAL USAGE',
      partOfSpeech: 'Noun',
      origin: 'Origin: Persian fairy tale (The Three Princes of Serendip)',
      questionHtml: 'In academic research, "<u>Serendipity</u>" refers to:',
      options: [
        'Rigidly controlled laboratory routines',
        'The fortunate occurrence of discoveries by chance',
        'A catastrophic error in data analysis',
        'Strict repetition of established literature'
      ],
      correctIndex: 1,
      explanation: '"Serendipity" is the faculty of making fortunate and unexpected discoveries by beneficial chance.'
    },
    {
      word: 'Ubiquitous',
      category: 'SYNONYM CHALLENGE',
      partOfSpeech: 'Adjective',
      origin: 'Origin: Latin (ubique - \'everywhere\')',
      questionHtml: 'What is the closest meaning of the word "<u>Ubiquitous</u>"?',
      options: [
        'Present, appearing, or found everywhere',
        'Extremely rare and scarce in nature',
        'Relating exclusively to ancient architecture',
        'Highly specialized and technical'
      ],
      correctIndex: 0,
      explanation: '"Ubiquitous" means present, appearing, or found everywhere at once (omnipresent).'
    },
    {
      word: 'Tenacity',
      category: 'ANTONYM CHALLENGE',
      partOfSpeech: 'Noun',
      origin: 'Origin: Latin (tenax - \'holding fast\')',
      questionHtml: 'What is the primary antonym (opposite) of "<u>Tenacity</u>"?',
      options: [
        'Perseverance and resolve',
        'Surrendering or giving up easily',
        'Intellectual curiosity',
        'Methodological discipline'
      ],
      correctIndex: 1,
      explanation: '"Tenacity" implies steadfast persistence and firm determination; its opposite is surrender, apathy, or yielding.'
    }
  ];

  // --------------------------------------------------------------------------
  // 3. INITIAL SEED DATA (Favorites & History)
  // --------------------------------------------------------------------------
  const DEFAULT_SEED_FAVORITES = [
    {
      word: 'Eloquent',
      phonetic: '/ˈel.ə.kwənt/',
      partOfSpeech: 'adj.',
      definition: 'Fluent or persuasive in speaking or writing; clearly expressing feelings or meaning.',
      example: 'An eloquent appeal for peace during the international symposium.',
      addedTimeLabel: 'Added yesterday',
      addedAt: Date.now() - 86400000,
      audio: ''
    },
    {
      word: 'Pragmatic',
      phonetic: '/ˈpræɡˈmæt.ɪk/',
      partOfSpeech: 'adj.',
      definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
      example: 'We need a pragmatic approach to tackling the budget deficit this quarter.',
      addedTimeLabel: 'Added 3 days ago',
      addedAt: Date.now() - 259200000,
      audio: ''
    },
    {
      word: 'Ephemeral',
      phonetic: '/ɪˈfem.ər.əl/',
      partOfSpeech: 'adj.',
      definition: 'Lasting for a very short time; fleeting or transient.',
      example: 'Fame in the digital era can be intoxicatingly rapid, yet entirely ephemeral.',
      addedTimeLabel: 'Added Oct 12',
      addedAt: Date.now() - 604800000,
      audio: ''
    },
    {
      word: 'Tenacity',
      phonetic: '/təˈnæs.ə.ti/',
      partOfSpeech: 'noun',
      definition: 'The quality or fact of being able to grip something firmly; resolve, persistence, or persistent determination.',
      example: 'Her academic tenacity carried her through grueling thesis defenses.',
      addedTimeLabel: 'Added Oct 10',
      addedAt: Date.now() - 777600000,
      audio: ''
    },
    {
      word: 'Serendipity',
      phonetic: '/ˌser.ənˈdɪp.ə.ti/',
      partOfSpeech: 'noun',
      definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
      example: 'A serendipity of scientific discovery led to the groundbreaking cure.',
      addedTimeLabel: 'Added Oct 8',
      addedAt: Date.now() - 950400000,
      audio: ''
    },
    {
      word: 'Mellifluous',
      phonetic: '/ˈmel.ɪf.lu.əs/',
      partOfSpeech: 'adj.',
      definition: '(of a voice or words) sweet or musical; pleasant to hear (resembling honey).',
      example: 'Her mellifluous lecture engaged the entire auditorium.',
      addedTimeLabel: 'Added Oct 5',
      addedAt: Date.now() - 1209600000,
      audio: ''
    },
    {
      word: 'Equanimity',
      phonetic: '/ˌek.wəˈnɪm.ə.ti/',
      partOfSpeech: 'noun',
      definition: 'Mental calmness, composure, and evenness of temper, especially in a difficult situation.',
      example: 'She accepted both praise and critique with equal equanimity.',
      addedTimeLabel: 'Added Oct 2',
      addedAt: Date.now() - 1468800000,
      audio: ''
    },
    {
      word: 'Ubiquitous',
      phonetic: '/juːˈbɪk.wɪ.təs/',
      partOfSpeech: 'adj.',
      definition: 'Present, appearing, or found everywhere at once.',
      example: 'Smartphones have become ubiquitous in collegiate environments.',
      addedTimeLabel: 'Added Sep 28',
      addedAt: Date.now() - 1814400000,
      audio: ''
    }
  ];

  const nowMs = Date.now();
  const DEFAULT_SEED_HISTORY = [
    {
      word: 'Serendipity',
      phonetic: '/ˌsɛr.ənˈdɪp.ə.ti/',
      partOfSpeech: 'noun',
      definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
      defsViewedCount: 2,
      timestamp: nowMs - (1000 * 60 * 35) // ~35 mins ago today
    },
    {
      word: 'Ubiquitous',
      phonetic: '/juːˈbɪk.wɪ.təs/',
      partOfSpeech: 'adjective',
      definition: 'Present, appearing, or found everywhere at once.',
      defsViewedCount: 1,
      timestamp: nowMs - (1000 * 60 * 60 * 2) // ~2 hours ago today
    },
    {
      word: 'Paradigm',
      phonetic: '/ˈpær.ə.daɪm/',
      partOfSpeech: 'noun',
      definition: 'A typical example or pattern of something; a model or standard archetype.',
      defsViewedCount: 3,
      timestamp: nowMs - (1000 * 60 * 60 * 26) // Yesterday afternoon
    },
    {
      word: 'Cognitive',
      phonetic: '/ˈkɒɡ.nə.tɪv/',
      partOfSpeech: 'adjective',
      definition: 'Relating to cognition, or the mental action or process of acquiring knowledge.',
      defsViewedCount: 1,
      timestamp: nowMs - (1000 * 60 * 60 * 29) // Yesterday afternoon
    },
    {
      word: 'Empirical',
      phonetic: '/ɪmˈpɪr.ɪ.kəl/',
      partOfSpeech: 'adjective',
      definition: 'Based on, concerned with, or verifiable by observation or experience rather than theory.',
      defsViewedCount: 2,
      timestamp: nowMs - (1000 * 60 * 60 * 32) // Yesterday morning
    }
  ];

  // Initialize Systems
  initFavoritesSystem();
  initHistorySystem();

  // --------------------------------------------------------------------------
  // 4. VIEW NAVIGATION & ROUTING (Home <-> Word Result <-> Favorites <-> History <-> Quiz)
  // --------------------------------------------------------------------------
  function showHomeView() {
    if (wordResultView) wordResultView.classList.add('hidden');
    if (favoritesView) favoritesView.classList.add('hidden');
    if (historyView) historyView.classList.add('hidden');
    if (quizView) quizView.classList.add('hidden');
    if (homeView) homeView.classList.remove('hidden');

    navPills.forEach(p => p.classList.remove('active'));
    if (navHomePill) navHomePill.classList.add('active');

    // Update bottom nav
    document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
    if (bottomNavHome) bottomNavHome.classList.add('active');

    // Sync WOTD favorite button state
    syncWotdFavoriteState();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showWordResultView() {
    if (homeView) homeView.classList.add('hidden');
    if (favoritesView) favoritesView.classList.add('hidden');
    if (historyView) historyView.classList.add('hidden');
    if (quizView) quizView.classList.add('hidden');
    if (wordResultView) wordResultView.classList.remove('hidden');

    navPills.forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showFavoritesView() {
    if (homeView) homeView.classList.add('hidden');
    if (wordResultView) wordResultView.classList.add('hidden');
    if (historyView) historyView.classList.add('hidden');
    if (quizView) quizView.classList.add('hidden');
    if (favoritesView) favoritesView.classList.remove('hidden');

    navPills.forEach(p => p.classList.remove('active'));
    if (navFavoritesPill) navFavoritesPill.classList.add('active');

    // Update bottom nav
    document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
    if (bottomNavFav) bottomNavFav.classList.add('active');

    // Fetch latest user favorites from MongoDB if logged in
    const currentUser = getCurrentUser();
    if (currentUser && (currentUser.id || currentUser._id)) {
      fetchUserFavorites(currentUser.id || currentUser._id);
    }

    // Re-render favorites content
    renderFavoritesView();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showHistoryView() {
    if (homeView) homeView.classList.add('hidden');
    if (wordResultView) wordResultView.classList.add('hidden');
    if (favoritesView) favoritesView.classList.add('hidden');
    if (quizView) quizView.classList.add('hidden');
    if (historyView) historyView.classList.remove('hidden');

    navPills.forEach(p => p.classList.remove('active'));
    if (navHistoryPill) navHistoryPill.classList.add('active');

    // Update bottom nav
    document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
    if (bottomNavHistory) bottomNavHistory.classList.add('active');

    // Fetch latest search history from MongoDB if logged in
    const currentUser = getCurrentUser();
    if (currentUser && (currentUser.id || currentUser._id)) {
      fetchUserSearchHistory(currentUser.id || currentUser._id);
    }

    // Re-render search history content
    renderHistoryView();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showQuizView() {
    if (homeView) homeView.classList.add('hidden');
    if (wordResultView) wordResultView.classList.add('hidden');
    if (favoritesView) favoritesView.classList.add('hidden');
    if (historyView) historyView.classList.add('hidden');
    if (quizView) quizView.classList.remove('hidden');

    navPills.forEach(p => p.classList.remove('active'));
    if (navQuizPill) navQuizPill.classList.add('active');

    // Update bottom nav
    document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
    if (bottomNavQuiz) bottomNavQuiz.classList.add('active');

    // Start / Initialize Quiz
    startQuizEngine();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navigation Event Listeners
  if (headerLogoLink) {
    headerLogoLink.addEventListener('click', (e) => {
      e.preventDefault();
      showHomeView();
    });
  }

  if (navHomePill) {
    navHomePill.addEventListener('click', (e) => {
      e.preventDefault();
      showHomeView();
    });
  }

  if (navFavoritesPill) {
    navFavoritesPill.addEventListener('click', (e) => {
      e.preventDefault();
      showFavoritesView();
    });
  }

  if (navHistoryPill) {
    navHistoryPill.addEventListener('click', (e) => {
      e.preventDefault();
      showHistoryView();
    });
  }

  if (navQuizPill) {
    navQuizPill.addEventListener('click', (e) => {
      e.preventDefault();
      showQuizView();
    });
  }

  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', () => {
      showHomeView();
    });
  }

  // Mobile Bottom Navigation Handlers
  if (bottomNavHome) {
    bottomNavHome.addEventListener('click', () => {
      showHomeView();
    });
  }

  if (bottomNavFav) {
    bottomNavFav.addEventListener('click', () => {
      showFavoritesView();
    });
  }

  if (bottomNavHistory) {
    bottomNavHistory.addEventListener('click', () => {
      showHistoryView();
    });
  }

  if (bottomNavQuiz) {
    bottomNavQuiz.addEventListener('click', () => {
      showQuizView();
    });
  }

  // --------------------------------------------------------------------------
  // 5. SEARCH DISPATCHER & EVENT LISTENERS
  // --------------------------------------------------------------------------
  let lastSearchQuery = '';
  let lastSearchTime = 0;
  let currentSearchAbortController = null;

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      executeSearch();
    });
  }

  if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      executeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
      }
    });
  }

  // Global Keyboard Shortcut (⌘K / Ctrl+K)
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      focusSearchInput();
    }
  });

  if (quickLookupBtn) {
    quickLookupBtn.addEventListener('click', () => {
      focusSearchInput();
    });
  }

  function focusSearchInput() {
    if (homeView && homeView.classList.contains('hidden')) {
      showHomeView();
    }
    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Search activated. Enter a word.');
      }
    }, 100);
  }

  function executeSearch() {
    if (!searchInput) return;

    const rawQuery = searchInput.value.trim();

    if (!rawQuery) {
      searchInput.focus();
      showToast('Please enter a word to look up.');
      return;
    }

    const cleanWord = rawQuery.toLowerCase();
    const now = Date.now();
    // Guard against rapid duplicate triggers from simultaneous button click + form submit
    if (cleanWord === lastSearchQuery && now - lastSearchTime < 400) {
      return;
    }
    lastSearchQuery = cleanWord;
    lastSearchTime = now;

    fetchWordDefinition(cleanWord);
  }

  // --------------------------------------------------------------------------
  // 6. BACKEND DICTIONARY API PROXY INTEGRATION & RENDERING
  // --------------------------------------------------------------------------
  /**
   * Fetches word data dynamically via Node/Express Backend Proxy:
   * http://localhost:5000/api/dictionary/{word}
   *
   * @param {string} word - English term to look up
   */
  async function fetchWordDefinition(word) {
    if (!word || typeof word !== 'string' || !word.trim()) {
      showToast('Please enter a word to look up.');
      return;
    }

    const cleanWord = word.trim().toLowerCase();
    isSearching = true;

    // Abort any existing in-flight search request to prevent race conditions
    if (currentSearchAbortController) {
      try {
        currentSearchAbortController.abort();
      } catch (e) {}
      currentSearchAbortController = null;
    }

    const controller = new AbortController();
    currentSearchAbortController = controller;

    // Set 12-second timeout using AbortController
    const timeoutId = setTimeout(() => {
      controller.abort('timeout');
    }, 12000);

    // Switch to Word Result view and show Loading State
    showWordResultView();
    renderWordResultLoading(cleanWord);

    const apiUrl = `${DICTIONARY_API_URL}/${encodeURIComponent(cleanWord)}`;
    console.log('[Smart Dictionary Debug] Search requested for word:', cleanWord);
    console.log('[Smart Dictionary Debug] Backend API URL:', apiUrl);

    let responseData = null;
    let dictionaryFetchSuccess = false;

    // PHASE 1: DICTIONARY API FETCH & RENDERING (Isolated from History)
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('[Smart Dictionary Debug] HTTP Status:', response.status);

      // 404: Word Not Found
      if (response.status === 404) {
        console.warn(`[Smart Dictionary Debug] Word "${cleanWord}" was not found (404).`);
        renderWordResultNotFound(cleanWord);
        return;
      }

      // Other non-200 HTTP statuses
      if (!response.ok) {
        console.error(`[Smart Dictionary Debug] HTTP Error: ${response.status}`);
        renderWordResultError(cleanWord, `Dictionary service returned status ${response.status}. Please try again.`);
        return;
      }

      // Parse JSON
      const data = await response.json();
      console.log('[Smart Dictionary Debug] API Response data:', data);

      if (Array.isArray(data) && data.length > 0 && data[0] && typeof data[0] === 'object') {
        responseData = data[0];
        dictionaryFetchSuccess = true;

        // Render the dedicated Word Result view
        renderWordResultPage(responseData);
        console.log('[Smart Dictionary Debug] renderWordResultPage succeeded for:', responseData.word || cleanWord);

        showToast(`Loaded definition for "${capitalize(responseData.word || cleanWord)}".`);
      } else {
        console.warn('[Smart Dictionary Debug] Unexpected API response format for:', cleanWord, data);
        renderWordResultNotFound(cleanWord);
        return;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      // If aborted because another search was initiated, don't overwrite UI
      if (controller.signal.aborted && controller !== currentSearchAbortController) {
        console.log(`[Smart Dictionary Debug] Search for "${cleanWord}" was superseded.`);
        return;
      }

      if (error.name === 'AbortError' || error === 'timeout' || (controller.signal.aborted && controller === currentSearchAbortController)) {
        console.warn(`[Smart Dictionary Debug] Request timed out for "${cleanWord}".`);
        renderWordResultError(cleanWord, 'Search request timed out. The dictionary service took too long to respond. Please check your internet connection and try again.');
        return;
      }

      console.error(`[Smart Dictionary Debug] Fetch Exception for "${cleanWord}":`, error);
      renderWordResultError(cleanWord, 'Unable to connect to the dictionary service. Please check your network connection.');
      return;
    } finally {
      if (currentSearchAbortController === controller) {
        currentSearchAbortController = null;
      }
      isSearching = false;
      if (searchSubmitBtn) {
        searchSubmitBtn.classList.remove('loading');
      }
    }

    // PHASE 2: INDEPENDENT SEARCH HISTORY PERSISTENCE
    // (Search History or MongoDB failures will NEVER alter or break the rendered word result)
    if (dictionaryFetchSuccess && responseData) {
      try {
        const primaryWord = responseData.word || cleanWord;
        let phoneticScript = responseData.phonetic || '';
        if (!phoneticScript && Array.isArray(responseData.phonetics)) {
          const pObj = responseData.phonetics.find(p => p && p.text && p.text.trim());
          if (pObj) phoneticScript = pObj.text;
        }
        if (!phoneticScript) phoneticScript = `/ ${primaryWord} /`;

        const meanings = Array.isArray(responseData.meanings) ? responseData.meanings : [];
        const rawPos = meanings[0]?.partOfSpeech || 'noun';
        let definitionSnippet = 'No definition available.';
        if (meanings.length > 0 && Array.isArray(meanings[0].definitions) && meanings[0].definitions.length > 0) {
          definitionSnippet = meanings[0].definitions[0].definition || 'No definition available.';
        }

        // Add valid search to persistent Search History (with its own isolated error handler)
        addWordToSearchHistory({
          word: primaryWord,
          phonetic: phoneticScript,
          partOfSpeech: rawPos.toLowerCase().startsWith('adj') ? 'adjective' : rawPos.toLowerCase(),
          definition: definitionSnippet,
          defsViewedCount: meanings.length || 1,
          timestamp: Date.now()
        }).catch(historyErr => {
          console.warn('[Smart Dictionary Debug] Search history save promise error:', historyErr);
        });
      } catch (historyError) {
        console.warn('[Smart Dictionary Debug] Search history save caught error:', historyError);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 7. WORD RESULT VIEW RENDERING (Google Stitch Mockup Fidelity)
  // --------------------------------------------------------------------------
  function renderWordResultPage(entry) {
    if (!wordResultDynamicContent) return;

    const word = entry.word || 'Word';
    const cleanWord = word.toLowerCase();

    // 1. Phonetics & Audio URL
    let phoneticText = entry.phonetic || '';
    if (!phoneticText && Array.isArray(entry.phonetics)) {
      const pObj = entry.phonetics.find(p => p && p.text && p.text.trim());
      if (pObj) phoneticText = pObj.text;
    }
    if (!phoneticText) phoneticText = `/ ${word} /`;

    let audioUrl = '';
    if (Array.isArray(entry.phonetics)) {
      const aObj = entry.phonetics.find(p => p && p.audio && typeof p.audio === 'string' && p.audio.trim().length > 0);
      if (aObj) {
        audioUrl = aObj.audio.startsWith('//') ? 'https:' + aObj.audio : aObj.audio;
      }
    }
    currentSearchAudioUrl = audioUrl;

    // 2. Extract Parts of Speech & Meanings
    const meanings = Array.isArray(entry.meanings) ? entry.meanings : [];
    const rawPos = meanings[0]?.partOfSpeech || 'noun';
    const primaryPos = rawPos.toUpperCase();
    const formattedPos = rawPos.toLowerCase().startsWith('adj') ? 'adj.' : rawPos.toLowerCase();
    const grammarAnnotation = primaryPos === 'NOUN' ? '· [C or U]' : (primaryPos === 'VERB' ? '· [TRANSITIVE]' : (primaryPos === 'ADJECTIVE' ? '· [DESCRIPTIVE]' : ''));

    // 3. Extract Core Definition & Example Sentence
    let coreDefinition = 'No formal definition found.';
    let exampleSentence = '';

    for (const m of meanings) {
      if (Array.isArray(m.definitions) && m.definitions.length > 0) {
        for (const d of m.definitions) {
          if (d && d.definition && d.definition.trim()) {
            if (coreDefinition === 'No formal definition found.') {
              coreDefinition = d.definition.trim();
            }
            if (d.example && d.example.trim()) {
              exampleSentence = d.example.trim();
              break;
            }
          }
        }
        if (exampleSentence) break;
      }
    }

    if (!exampleSentence) {
      exampleSentence = `The collegiate discourse emphasized the importance of ${word} in modern research methodology.`;
    }

    let formattedQuote = escapeHtml(exampleSentence);
    try {
      const regexWord = new RegExp(`(${escapeRegex(word)})`, 'gi');
      formattedQuote = formattedQuote.replace(regexWord, '<span class="highlight-searched-word"><u>$1</u></span>');
    } catch (e) {}

    // 4. Cache structured entry data for Favorites saving
    currentWordEntryData = {
      word: capitalize(word),
      phonetic: phoneticText,
      partOfSpeech: formattedPos,
      definition: coreDefinition,
      example: exampleSentence,
      audio: audioUrl,
      addedTimeLabel: 'Added just now',
      addedAt: Date.now()
    };

    // 5. Collect Synonyms & Antonyms
    const allSynonyms = new Set();
    const allAntonyms = new Set();

    meanings.forEach(m => {
      if (Array.isArray(m.synonyms)) {
        m.synonyms.forEach(s => {
          if (s && typeof s === 'string' && s.trim()) allSynonyms.add(s.trim());
        });
      }
      if (Array.isArray(m.antonyms)) {
        m.antonyms.forEach(a => {
          if (a && typeof a === 'string' && a.trim()) allAntonyms.add(a.trim());
        });
      }
      if (Array.isArray(m.definitions)) {
        m.definitions.forEach(d => {
          if (Array.isArray(d.synonyms)) {
            d.synonyms.forEach(s => {
              if (s && typeof s === 'string' && s.trim()) allSynonyms.add(s.trim());
            });
          }
          if (Array.isArray(d.antonyms)) {
            d.antonyms.forEach(a => {
              if (a && typeof a === 'string' && a.trim()) allAntonyms.add(a.trim());
            });
          }
        });
      }
    });

    const synonymsList = Array.from(allSynonyms).slice(0, 6);
    const antonymsList = Array.from(allAntonyms).slice(0, 4);

    // 6. Check LocalStorage/MongoDB Favorite Status
    const isSaved = isWordInFavorites(cleanWord);

    // 7. Additional Definitions if available
    let additionalDefsHtml = '';
    const allDefs = [];
    meanings.forEach(m => {
      const posLabel = m.partOfSpeech || '';
      if (Array.isArray(m.definitions)) {
        m.definitions.forEach(d => {
          if (d && d.definition && d.definition.trim() && d.definition.trim() !== coreDefinition) {
            allDefs.push({
              pos: posLabel,
              definition: d.definition.trim(),
              example: d.example || ''
            });
          }
        });
      }
    });

    if (allDefs.length > 0) {
      const defItems = allDefs.slice(0, 3).map((item, idx) => `
        <div class="additional-def-item" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--color-border-subtle, #f1f5f9);">
          <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary-blue, #2563eb);">${idx + 2}.</span>
            <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted, #64748b);">${escapeHtml(item.pos)}</span>
          </div>
          <p style="font-size: 0.92rem; color: var(--color-text-secondary, #334155); margin: 0; line-height: 1.5;">${escapeHtml(item.definition)}</p>
          ${item.example ? `<p style="font-size: 0.84rem; color: var(--color-text-muted, #64748b); font-style: italic; margin: 4px 0 0 0;">“${escapeHtml(item.example)}”</p>` : ''}
        </div>
      `).join('');

      additionalDefsHtml = `
        <div class="additional-definitions-wrap" style="margin-top: 18px;">
          <h4 style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted, #64748b); margin-bottom: 8px;">
            Additional Meanings (${allDefs.length})
          </h4>
          ${defItems}
        </div>
      `;
    }

    // 8. Build HTML Structure matching the Stitch Screenshot
    let synonymsSectionHtml = '';
    if (synonymsList.length > 0) {
      const synChips = synonymsList.map(s =>
        `<button class="semantic-word-chip synonym-chip" data-word="${escapeHtml(s)}">${escapeHtml(s)}</button>`
      ).join('');

      synonymsSectionHtml = `
        <div class="result-semantic-section">
          <div class="semantic-section-header">
            <div class="semantic-title-wrap">
              <svg class="semantic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <h3 class="semantic-section-title">Synonyms</h3>
            </div>
            <span class="semantic-count-label">${synonymsList.length} related terms</span>
          </div>
          <div class="semantic-chips-grid">
            ${synChips}
          </div>
        </div>
      `;
    }

    let antonymsSectionHtml = '';
    if (antonymsList.length > 0) {
      const antChips = antonymsList.map(a =>
        `<button class="semantic-word-chip antonym-chip" data-word="${escapeHtml(a)}">${escapeHtml(a)}</button>`
      ).join('');

      antonymsSectionHtml = `
        <div class="result-semantic-section">
          <div class="semantic-section-header">
            <div class="semantic-title-wrap">
              <svg class="semantic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
              </svg>
              <h3 class="semantic-section-title">Antonyms</h3>
            </div>
            <span class="semantic-count-label">Opposite concepts</span>
          </div>
          <div class="semantic-chips-grid">
            ${antChips}
          </div>
        </div>
      `;
    }

    // Assemble Main Result Card
    wordResultDynamicContent.innerHTML = `
      <article class="word-result-card card-surface">
        
        <!-- Top Row: Part of Speech & Saved State -->
        <div class="result-card-header-row">
          <div class="pos-grammatical-lockup">
            <span class="pos-primary-title">${escapeHtml(primaryPos)}</span>
            <span class="pos-type-annotation">${escapeHtml(grammarAnnotation)}</span>
          </div>
          
          <!-- ⭐ Working Favorite Button on Word Result Page -->
          <button class="saved-bookmark-btn ${isSaved ? 'saved' : ''}" id="resultBookmarkBtn" title="Toggle Favorite" aria-label="Toggle Favorite for ${escapeHtml(word)}">
            <svg class="star-icon" viewBox="0 0 24 24" width="16" height="16" fill="${isSaved ? '#f59e0b' : 'none'}" stroke="${isSaved ? '#f59e0b' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span class="bookmark-text" id="bookmarkBtnText">${isSaved ? 'Saved' : 'Favorite'}</span>
          </button>
        </div>

        <!-- Headword Title -->
        <h1 class="result-headword-title">${escapeHtml(capitalize(word))}</h1>

        <!-- Phonetics & Listen Audio Button -->
        <div class="result-phonetics-bar">
          <span class="result-phonetic-script">${escapeHtml(phoneticText)} UK / US</span>
          <button class="result-listen-btn" id="resultAudioBtn" title="Listen to pronunciation">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
            <span>Listen</span>
          </button>
        </div>

        <!-- 1 Core Definition Block -->
        <div class="result-core-definition-block">
          <div class="definition-category-header">
            <span class="core-def-rank-label">1 Core Definition</span>
            <span class="core-def-category-tag">General &amp; Literary</span>
          </div>
          <p class="core-def-body-text">${escapeHtml(coreDefinition)}</p>

          <!-- Quote Callout -->
          <div class="result-quote-callout">
            <span class="quote-symbol">❝</span>
            <div class="quote-content">
              <p class="quote-sentence">“${formattedQuote}”</p>
              <span class="quote-citation">— Academic Journal of Discovery (2025)</span>
            </div>
          </div>

          <!-- Additional Definitions -->
          ${additionalDefsHtml}
        </div>

        <!-- Synonyms Section -->
        ${synonymsSectionHtml}

        <!-- Antonyms Section -->
        ${antonymsSectionHtml}

        <!-- College Essay Tip Box -->
        <div class="college-essay-tip-card">
          <div class="tip-card-header">
            <div class="tip-card-title-group">
              <svg class="tip-cap-icon" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
              </svg>
              <h4 class="tip-card-title">College Essay Tip</h4>
            </div>
            <span class="style-guide-badge">Style Guide</span>
          </div>
          <p class="tip-card-body">
            Avoid confusing <strong>${escapeHtml(word)}</strong> with simple colloquial synonyms. In collegiate prose, ${escapeHtml(word)} implies nuanced scholarly precision and deliberate contextual usage.
          </p>
          <div class="etymology-origin-note">
            <svg class="quill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              <path d="M2 2l7.586 7.586"/>
            </svg>
            <span>Referenced in academic writing and collegiate lexicon repositories.</span>
          </div>
        </div>

        <!-- Mastery Quiz Card -->
        <div class="mastery-quiz-card">
          <div class="quiz-info-group">
            <span class="quiz-eyebrow">MASTERY QUIZ</span>
            <h4 class="quiz-action-prompt">Test this word now</h4>
            <span class="quiz-reward-xp">1 multiple choice question (+10 XP)</span>
          </div>
          <button class="practice-quiz-btn" id="practiceWordBtn">
            <span>Practice</span>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="4" y1="10" x2="16" y2="10"/>
              <polyline points="10 4 16 10 10 16"/>
            </svg>
          </button>
        </div>

      </article>
    `;

    // Attach Event Handlers for the Word Result Page
    attachWordResultCardEvents(word, audioUrl);
  }

  // --------------------------------------------------------------------------
  // 8. LOADING, NOT FOUND & ERROR STATES FOR WORD RESULT VIEW
  // --------------------------------------------------------------------------
  function renderWordResultLoading(word) {
    if (!wordResultDynamicContent) return;
    wordResultDynamicContent.innerHTML = `
      <div class="card-surface" style="padding: 48px 24px; text-align: center;">
        <div class="loading-spinner" style="margin: 0 auto 16px;"></div>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--color-text-title); margin-bottom: 6px;">
          Retrieving "${escapeHtml(word)}"...
        </h3>
        <p style="font-size: 0.9rem; color: var(--color-text-secondary);">
          Searching collegiate lexicon and etymology data...
        </p>
      </div>
    `;
  }

  function renderWordResultNotFound(word) {
    if (!wordResultDynamicContent) return;
    wordResultDynamicContent.innerHTML = `
      <div class="card-surface" style="padding: 40px 24px; text-align: center;">
        <div class="not-found-icon-wrap" style="margin: 0 auto 12px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--color-text-title); margin-bottom: 8px;">
          Term Not Found
        </h2>
        <p style="font-size: 0.95rem; color: var(--color-text-secondary); max-width: 480px; margin: 0 auto 20px;">
          We couldn't find definitions for "<strong>${escapeHtml(word)}</strong>" in the Free Dictionary API. Please double-check the spelling or try another collegiate term.
        </p>
        <button class="retry-search-btn" id="notFoundBackHomeBtn">
          <span>← Back to Home</span>
        </button>
      </div>
    `;

    const backBtn = document.getElementById('notFoundBackHomeBtn');
    if (backBtn) {
      backBtn.addEventListener('click', showHomeView);
    }
  }

  function renderWordResultError(word, message) {
    if (!wordResultDynamicContent) return;
    wordResultDynamicContent.innerHTML = `
      <div class="card-surface" style="padding: 40px 24px; text-align: center;">
        <div class="not-found-icon-wrap" style="margin: 0 auto 12px; background-color: #fff1f2; color: #e11d48;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--color-text-title); margin-bottom: 8px;">
          Unable to Load Word Result
        </h2>
        <p style="font-size: 0.95rem; color: var(--color-text-secondary); max-width: 480px; margin: 0 auto 20px;">
          ${escapeHtml(message)}
        </p>
        <div style="display: flex; justify-content: center; gap: 12px;">
          <button class="retry-search-btn" id="errorRetryBtn">
            <span>Retry Search</span>
          </button>
          <button class="back-to-wotd-btn" id="errorBackBtn" style="padding: 8px 16px;">
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    `;

    const retryBtn = document.getElementById('errorRetryBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => fetchWordDefinition(word));
    }

    const backBtn = document.getElementById('errorBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', showHomeView);
    }
  }

  // --------------------------------------------------------------------------
  // 9. ATTACH DYNAMIC CARD EVENTS (Favorite Toggle, Audio, Chips, Share, Quiz)
  // --------------------------------------------------------------------------
  function attachWordResultCardEvents(word, audioUrl) {
    // 1. Working ⭐ Favorite / Bookmark Button (MongoDB API Connected)
    const bookmarkBtn = document.getElementById('resultBookmarkBtn');

    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', async () => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          showToast('⚠️ Please sign in to save words to your favorites.');
          openAuthModal('login');
          return;
        }

        const isCurrentlySaved = isWordInFavorites(word);
        if (isCurrentlySaved) {
          await removeFavoriteWord(word);
        } else {
          await saveFavoriteWord(currentWordEntryData || word);
        }
      });
    }

    // 2. Audio Pronunciation Button
    const audioBtn = document.getElementById('resultAudioBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        playPronunciation(word, audioUrl, audioBtn);
      });
    }

    // 3. Synonym & Antonym Chips (Click to Search)
    const chips = wordResultDynamicContent.querySelectorAll('.semantic-word-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const synWord = chip.getAttribute('data-word');
        if (synWord) {
          if (searchInput) searchInput.value = synWord;
          fetchWordDefinition(synWord);
        }
      });
    });

    // 4. Share Word Button
    const shareBtn = document.getElementById('shareWordBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const shareText = `Learn "${word}" on Smart Dictionary: ${window.location.href}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareText).then(() => {
            showToast(`📋 Link for "${word}" copied to clipboard!`);
          }).catch(() => {
            showToast(`"${word}" ready for sharing.`);
          });
        } else {
          showToast(`"${word}" ready for sharing.`);
        }
      });
    }

    // 5. Practice Mastery Quiz Button -> Opens Quiz View
    const practiceBtn = document.getElementById('practiceWordBtn');
    if (practiceBtn) {
      practiceBtn.addEventListener('click', () => {
        showQuizView();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 10. MONGODB FAVORITES SYSTEM (Full CRUD & Persistence)
  // --------------------------------------------------------------------------

  /**
   * Fetches user's saved favorites from MongoDB API
   */
  async function fetchUserFavorites(userId) {
    if (!userId) {
      userFavoritesList = [];
      updateFavoritesBadgeCount();
      syncWotdFavoriteState();
      syncWordResultFavoriteState();
      return [];
    }

    isFetchingFavorites = true;
    try {
      const response = await fetch(`${FAVORITES_API_URL}/${userId}`);
      if (response.ok) {
        const data = await response.json();
        userFavoritesList = Array.isArray(data.favorites) ? data.favorites : [];
        try {
          localStorage.setItem(`smart_dict_favorites_${userId}`, JSON.stringify(userFavoritesList));
        } catch (e) {}
      } else {
        loadFavoritesFromCache(userId);
      }
    } catch (error) {
      console.warn('[Smart Dictionary] Favorites fetch error, falling back to cache:', error);
      loadFavoritesFromCache(userId);
    } finally {
      isFetchingFavorites = false;
      updateFavoritesBadgeCount();
      syncWotdFavoriteState();
      syncWordResultFavoriteState();
      if (favoritesView && !favoritesView.classList.contains('hidden')) {
        renderFavoritesList(currentFavFilter, currentFavSearchQuery);
      }
    }
    return userFavoritesList;
  }

  function loadFavoritesFromCache(userId) {
    try {
      const cached = localStorage.getItem(`smart_dict_favorites_${userId}`);
      if (cached) {
        userFavoritesList = JSON.parse(cached) || [];
      }
    } catch (e) {}
  }

  function getFavoritesList() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    return userFavoritesList;
  }

  /**
   * Saves a favorite word to MongoDB backend
   */
  async function saveFavoriteWord(wordData) {
    const currentUser = getCurrentUser();
    if (!currentUser || (!currentUser.id && !currentUser._id)) {
      showToast('⚠️ Please sign in to save words to your favorites.');
      openAuthModal('login');
      return false;
    }

    const userId = currentUser.id || currentUser._id;
    const wordName = typeof wordData === 'string' ? wordData.trim() : (wordData.word || '').trim();
    const cleanWord = wordName.toLowerCase();

    if (!cleanWord) return false;

    if (isWordInFavorites(cleanWord)) {
      showToast(`⭐ "${capitalize(cleanWord)}" is already in your Favorites.`);
      return true;
    }

    const payload = {
      userId: userId,
      word: cleanWord,
      phonetic: (typeof wordData === 'object' && wordData.phonetic) ? wordData.phonetic : `/${cleanWord}/`,
      partOfSpeech: (typeof wordData === 'object' && wordData.partOfSpeech) ? wordData.partOfSpeech : 'noun',
      definition: (typeof wordData === 'object' && wordData.definition) ? wordData.definition : `Collegiate vocabulary entry for ${cleanWord}.`,
      example: (typeof wordData === 'object' && wordData.example) ? wordData.example : '',
      audio: (typeof wordData === 'object' && wordData.audio) ? wordData.audio : ''
    };

    // Optimistically update UI
    const tempFav = {
      _id: 'temp_' + Date.now(),
      userId: userId,
      word: cleanWord,
      phonetic: payload.phonetic,
      partOfSpeech: payload.partOfSpeech,
      definition: payload.definition,
      example: payload.example,
      audio: payload.audio,
      createdAt: new Date().toISOString()
    };
    userFavoritesList.unshift(tempFav);
    updateFavoritesBadgeCount();
    syncWotdFavoriteState();
    syncWordResultFavoriteState();
    if (favoritesView && !favoritesView.classList.contains('hidden')) {
      renderFavoritesList(currentFavFilter, currentFavSearchQuery);
    }

    try {
      const response = await fetch(FAVORITES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.favorite) {
        const idx = userFavoritesList.findIndex(f => f._id === tempFav._id);
        if (idx !== -1) {
          userFavoritesList[idx] = data.favorite;
        }
        try {
          localStorage.setItem(`smart_dict_favorites_${userId}`, JSON.stringify(userFavoritesList));
        } catch (e) {}
        showToast(`⭐ "${capitalize(cleanWord)}" saved to your Favorites!`);
        return true;
      } else {
        if (response.status === 400 && data.message && data.message.includes('already')) {
          showToast(`⭐ "${capitalize(cleanWord)}" is already saved.`);
          return true;
        }
        userFavoritesList = userFavoritesList.filter(f => f._id !== tempFav._id);
        updateFavoritesBadgeCount();
        syncWotdFavoriteState();
        syncWordResultFavoriteState();
        if (favoritesView && !favoritesView.classList.contains('hidden')) {
          renderFavoritesList(currentFavFilter, currentFavSearchQuery);
        }
        showToast(data.message || 'Could not save favorite to database.');
        return false;
      }
    } catch (error) {
      console.error('[Smart Dictionary] Save Favorite API error:', error);
      showToast('⚠️ Network error. Favorite saved locally.');
      return false;
    }
  }

  /**
   * Removes a favorite word from MongoDB backend
   */
  async function removeFavoriteWord(wordName) {
    const currentUser = getCurrentUser();
    if (!currentUser || (!currentUser.id && !currentUser._id)) {
      showToast('⚠️ Please sign in to manage favorites.');
      openAuthModal('login');
      return false;
    }

    const userId = currentUser.id || currentUser._id;
    const cleanWord = (wordName || '').trim().toLowerCase();
    if (!cleanWord) return false;

    const previousFavorites = [...userFavoritesList];

    // Optimistically update UI
    userFavoritesList = userFavoritesList.filter(item => (item.word || '').toLowerCase() !== cleanWord);
    updateFavoritesBadgeCount();
    syncWotdFavoriteState();
    syncWordResultFavoriteState();

    if (favoritesView && !favoritesView.classList.contains('hidden')) {
      renderFavoritesList(currentFavFilter, currentFavSearchQuery);
    }

    try {
      const response = await fetch(`${FAVORITES_API_URL}/${userId}/${encodeURIComponent(cleanWord)}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        try {
          localStorage.setItem(`smart_dict_favorites_${userId}`, JSON.stringify(userFavoritesList));
        } catch (e) {}
        showToast(`☆ Removed "${capitalize(cleanWord)}" from Favorites.`);
        return true;
      } else {
        userFavoritesList = previousFavorites;
        updateFavoritesBadgeCount();
        syncWotdFavoriteState();
        syncWordResultFavoriteState();
        if (favoritesView && !favoritesView.classList.contains('hidden')) {
          renderFavoritesList(currentFavFilter, currentFavSearchQuery);
        }
        showToast(data.message || 'Could not remove favorite.');
        return false;
      }
    } catch (error) {
      console.error('[Smart Dictionary] Delete Favorite API error:', error);
      userFavoritesList = previousFavorites;
      updateFavoritesBadgeCount();
      syncWotdFavoriteState();
      syncWordResultFavoriteState();
      if (favoritesView && !favoritesView.classList.contains('hidden')) {
        renderFavoritesList(currentFavFilter, currentFavSearchQuery);
      }
      showToast('⚠️ Network error while removing favorite.');
      return false;
    }
  }

  function isWordInFavorites(wordName) {
    if (!wordName) return false;
    const cleanWord = wordName.trim().toLowerCase();
    return userFavoritesList.some(item => (item.word || '').toLowerCase() === cleanWord);
  }

  function syncWordResultFavoriteState() {
    const bookmarkBtn = document.getElementById('resultBookmarkBtn');
    const bookmarkText = document.getElementById('bookmarkBtnText');
    if (!bookmarkBtn) return;

    if (currentWordEntryData && currentWordEntryData.word) {
      const isSaved = isWordInFavorites(currentWordEntryData.word);
      const starSvg = bookmarkBtn.querySelector('.star-icon');
      if (isSaved) {
        bookmarkBtn.classList.add('saved');
        if (bookmarkText) bookmarkText.textContent = 'Saved';
        if (starSvg) {
          starSvg.setAttribute('fill', '#f59e0b');
          starSvg.setAttribute('stroke', '#f59e0b');
        }
      } else {
        bookmarkBtn.classList.remove('saved');
        if (bookmarkText) bookmarkText.textContent = 'Favorite';
        if (starSvg) {
          starSvg.setAttribute('fill', 'none');
          starSvg.setAttribute('stroke', 'currentColor');
        }
      }
    }
  }

  function updateFavoritesBadgeCount() {
    const list = getFavoritesList();
    const count = list.length;

    if (favCountBadge) favCountBadge.textContent = count;
    if (bottomFavCount) bottomFavCount.textContent = count;
    if (favSubtitleCount) {
      favSubtitleCount.textContent = `${count} ${count === 1 ? 'word' : 'words'} bookmarked for revision & active recall.`;
    }

    if (filterAllCount) filterAllCount.textContent = count;
    if (filterAdjCount) {
      filterAdjCount.textContent = list.filter(w => (w.partOfSpeech || '').toLowerCase().includes('adj')).length;
    }
    if (filterNounCount) {
      filterNounCount.textContent = list.filter(w => (w.partOfSpeech || '').toLowerCase().includes('noun')).length;
    }
    if (filterVerbCount) {
      filterVerbCount.textContent = list.filter(w => (w.partOfSpeech || '').toLowerCase().includes('verb')).length;
    }

    if (readinessDesc) {
      const dueCount = Math.min(5, count);
      readinessDesc.textContent = `${dueCount} of ${count} words due for spaced retrieval today`;
    }
    if (readinessScorePercent) {
      readinessScorePercent.textContent = count > 0 ? '62%' : '0%';
    }
  }

  function initFavoritesSystem() {
    updateFavoritesBadgeCount();
    syncWotdFavoriteState();
  }

  function syncWotdFavoriteState() {
    if (favoriteToggleBtn) {
      const isSaved = isWordInFavorites('ephemeral');
      if (isSaved) {
        favoriteToggleBtn.classList.add('favorited');
      } else {
        favoriteToggleBtn.classList.remove('favorited');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 11. FAVORITES VIEW CONTROLLER & RENDERING
  // --------------------------------------------------------------------------
  function renderFavoritesView() {
    updateFavoritesBadgeCount();
    renderFavoritesList(currentFavFilter, currentFavSearchQuery);
  }

  function renderFavoritesList(filter = 'all', searchQuery = '') {
    if (!savedWordsList) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      savedWordsList.innerHTML = `
        <div class="card-surface favorites-empty-card" style="padding: 44px 24px; text-align: center;">
          <div class="not-found-icon-wrap" style="margin: 0 auto 16px; background-color: #eff6ff; color: #2563eb;">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h3 class="empty-title" style="font-size: 1.25rem; font-weight: 800; color: var(--color-text-title); margin-bottom: 8px;">
            Sign In to Access Your Personal Lexicon
          </h3>
          <p class="empty-desc" style="font-size: 0.9rem; color: var(--color-text-secondary); max-width: 440px; margin: 0 auto 20px; line-height: 1.5;">
            Your bookmarked words are securely saved to your MongoDB account. Sign in to sync your saved words, track recall readiness, and review vocabulary.
          </p>
          <button class="retry-search-btn" id="favSignInPromptBtn" style="padding: 10px 24px;">
            <span>Sign In / Create Account</span>
          </button>
        </div>
      `;
      const signInBtn = document.getElementById('favSignInPromptBtn');
      if (signInBtn) {
        signInBtn.addEventListener('click', () => openAuthModal('login'));
      }
      return;
    }

    const allFavorites = getFavoritesList();

    let filtered = allFavorites;
    if (filter === 'adjective') {
      filtered = filtered.filter(item => (item.partOfSpeech || '').toLowerCase().includes('adj'));
    } else if (filter === 'noun') {
      filtered = filtered.filter(item => (item.partOfSpeech || '').toLowerCase().includes('noun'));
    } else if (filter === 'verb') {
      filtered = filtered.filter(item => (item.partOfSpeech || '').toLowerCase().includes('verb'));
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(item => {
        const wordMatch = (item.word || '').toLowerCase().includes(query);
        const defMatch = (item.definition || '').toLowerCase().includes(query);
        const exMatch = (item.example || '').toLowerCase().includes(query);
        const posMatch = (item.partOfSpeech || '').toLowerCase().includes(query);
        return wordMatch || defMatch || exMatch || posMatch;
      });
    }

    if (filtered.length === 0) {
      if (allFavorites.length === 0) {
        savedWordsList.innerHTML = `
          <div class="card-surface favorites-empty-card">
            <svg class="empty-star-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <h3 class="empty-title">No Saved Favorites Yet</h3>
            <p class="empty-desc">
              Star any word from the Search Results or Word of the Day to save it to your Personal Lexicon in MongoDB for active recall and revision.
            </p>
            <button class="retry-search-btn" id="emptyGoSearchBtn">
              <span>🔍 Search Words Now</span>
            </button>
          </div>
        `;
        const goSearchBtn = document.getElementById('emptyGoSearchBtn');
        if (goSearchBtn) {
          goSearchBtn.addEventListener('click', () => {
            showHomeView();
            focusSearchInput();
          });
        }
      } else {
        savedWordsList.innerHTML = `
          <div class="card-surface favorites-empty-card" style="padding: 36px 20px;">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.75" style="color: var(--color-text-muted); margin-bottom: 4px;">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21L16.65 16.65"/>
            </svg>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-title);">
              No Matching Saved Words Found
            </h3>
            <p style="font-size: 0.88rem; color: var(--color-text-secondary); max-width: 380px;">
              No saved words matched your filter "<strong>${escapeHtml(searchQuery || filter)}</strong>".
            </p>
            <button class="back-to-wotd-btn" id="resetFavFiltersBtn" style="margin-top: 8px;">
              <span>Clear Filter</span>
            </button>
          </div>
        `;
        const resetBtn = document.getElementById('resetFavFiltersBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (favFilterInput) favFilterInput.value = '';
            currentFavSearchQuery = '';
            currentFavFilter = 'all';
            if (favFilterPills) {
              favFilterPills.querySelectorAll('.fav-pill').forEach(p => {
                p.classList.toggle('active', p.getAttribute('data-filter') === 'all');
              });
            }
            renderFavoritesList('all', '');
          });
        }
      }
      return;
    }

    const cardsHtml = filtered.map(item => {
      const word = item.word || 'Word';
      const phonetic = item.phonetic || '';
      const pos = item.partOfSpeech || 'noun';
      const def = item.definition || '';
      const example = item.example || '';
      const timeLabel = item.addedTimeLabel || (item.createdAt ? formatRelativeTime(new Date(item.createdAt).getTime()) : 'Recently');
      const audio = item.audio || '';

      return `
        <article class="saved-word-card card-surface" data-word="${escapeHtml(word)}">
          <div class="saved-word-top">
            <div class="saved-word-title-group">
              <span class="saved-word-headword" data-word="${escapeHtml(word)}" title="Look up ${escapeHtml(word)}">${escapeHtml(capitalize(word))}</span>
              <span class="saved-word-phonetic">${escapeHtml(phonetic)}</span>
              <span class="saved-word-pos">${escapeHtml(pos)}</span>
            </div>
            <div class="saved-word-actions">
              <button class="fav-audio-btn" data-word="${escapeHtml(word)}" data-audio="${escapeHtml(audio)}" title="Listen to pronunciation" aria-label="Listen to ${escapeHtml(word)}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
              </button>
              <button class="fav-remove-star-btn" data-word="${escapeHtml(word)}" title="Remove from Favorites" aria-label="Remove ${escapeHtml(word)} from favorites">
                <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            </div>
          </div>
          <p class="saved-word-def">${escapeHtml(def)}</p>
          ${example ? `<blockquote class="saved-word-quote">“${escapeHtml(example)}”</blockquote>` : ''}
          <div class="saved-word-footer">
            <span class="saved-word-time">
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="8" cy="8" r="6"/>
                <polyline points="8 4 8 8 10.5 9.5"/>
              </svg>
              ${escapeHtml(timeLabel)}
            </span>
            <button class="deep-dive-btn" data-word="${escapeHtml(word)}" title="View full deep-dive for ${escapeHtml(word)}">
              <span>View full deep-dive</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="8" x2="13" y2="8"/>
                <polyline points="9 4 13 8 9 12"/>
              </svg>
            </button>
          </div>
        </article>
      `;
    }).join('');

    savedWordsList.innerHTML = cardsHtml;
  }

  // Event Delegation on Saved Words List Container
  if (savedWordsList) {
    savedWordsList.addEventListener('click', async (e) => {
      const removeBtn = e.target.closest('.fav-remove-star-btn');
      if (removeBtn) {
        const word = removeBtn.getAttribute('data-word');
        if (word) {
          await removeFavoriteWord(word);
        }
        return;
      }

      const audioBtn = e.target.closest('.fav-audio-btn');
      if (audioBtn) {
        const word = audioBtn.getAttribute('data-word');
        const audioUrl = audioBtn.getAttribute('data-audio');
        if (word) {
          playPronunciation(word, audioUrl, audioBtn);
        }
        return;
      }

      const deepDiveBtn = e.target.closest('.deep-dive-btn');
      const headwordSpan = e.target.closest('.saved-word-headword');
      const targetEl = deepDiveBtn || headwordSpan;

      if (targetEl) {
        const word = targetEl.getAttribute('data-word');
        if (word) {
          if (searchInput) searchInput.value = word;
          fetchWordDefinition(word);
        }
        return;
      }
    });
  }

  if (favFilterInput) {
    favFilterInput.addEventListener('input', (e) => {
      currentFavSearchQuery = e.target.value;
      renderFavoritesList(currentFavFilter, currentFavSearchQuery);
    });
  }

  if (favFilterPills) {
    favFilterPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.fav-pill');
      if (pill) {
        favFilterPills.querySelectorAll('.fav-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFavFilter = pill.getAttribute('data-filter') || 'all';
        renderFavoritesList(currentFavFilter, currentFavSearchQuery);
      }
    });
  }

  if (favPracticeQuizBtn) {
    favPracticeQuizBtn.addEventListener('click', () => {
      showQuizView();
    });
  }

  if (exportListBtn) {
    exportListBtn.addEventListener('click', () => {
      const list = getFavoritesList();
      if (list.length === 0) {
        showToast('No saved words to export.');
        return;
      }

      const headers = ['Word', 'Part of Speech', 'Phonetic', 'Definition', 'Example', 'Added'];
      const rows = list.map(item => [
        `"${(item.word || '').replace(/"/g, '""')}"`,
        `"${(item.partOfSpeech || '').replace(/"/g, '""')}"`,
        `"${(item.phonetic || '').replace(/"/g, '""')}"`,
        `"${(item.definition || '').replace(/"/g, '""')}"`,
        `"${(item.example || '').replace(/"/g, '""')}"`,
        `"${(item.addedTimeLabel || '').replace(/"/g, '""')}"`
      ].join(','));

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', encodedUri);
      downloadLink.setAttribute('download', 'smart-dictionary-favorites.csv');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast(`📥 Exported ${list.length} saved favorites as CSV!`);
    });
  }

  // --------------------------------------------------------------------------
  // 12. SEARCH HISTORY SYSTEM (MongoDB API CRUD & Guest LocalStorage Fallback)
  // --------------------------------------------------------------------------

  /**
   * Fetches user's search history from MongoDB API
   */
  async function fetchUserSearchHistory(userId) {
    if (!userId) {
      userHistoryList = [];
      updateRecentChipsFromHistory();
      return [];
    }

    isFetchingHistory = true;
    try {
      const response = await fetch(`${HISTORY_API_URL}/${userId}`);
      if (response.ok) {
        const data = await response.json();
        userHistoryList = Array.isArray(data.history) ? data.history.map(item => ({
          ...item,
          timestamp: item.searchedAt ? new Date(item.searchedAt).getTime() : Date.now()
        })) : [];
        try {
          localStorage.setItem(`smart_dict_history_${userId}`, JSON.stringify(userHistoryList));
        } catch (e) {}
      } else {
        loadHistoryFromCache(userId);
      }
    } catch (error) {
      console.warn('[Smart Dictionary] History fetch error, falling back to cache:', error);
      loadHistoryFromCache(userId);
    } finally {
      isFetchingHistory = false;
      updateRecentChipsFromHistory();
      if (historyView && !historyView.classList.contains('hidden')) {
        renderHistoryView();
      }
    }
    return userHistoryList;
  }

  function loadHistoryFromCache(userId) {
    try {
      const cached = localStorage.getItem(`smart_dict_history_${userId}`);
      if (cached) {
        userHistoryList = JSON.parse(cached) || [];
      }
    } catch (e) {}
  }

  function getSearchHistory() {
    const currentUser = getCurrentUser();
    if (currentUser && (currentUser.id || currentUser._id)) {
      return userHistoryList;
    }

    // Guest fallback to localStorage
    try {
      const stored = localStorage.getItem('smart_dict_history');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[Smart Dictionary] LocalStorage history read error:', e);
    }

    try {
      localStorage.setItem('smart_dict_history', JSON.stringify(DEFAULT_SEED_HISTORY));
    } catch (e) {
      console.warn('[Smart Dictionary] LocalStorage history seed write error:', e);
    }
    return DEFAULT_SEED_HISTORY;
  }

  async function addWordToSearchHistory(entry) {
    const cleanWord = (entry.word || '').trim().toLowerCase();
    if (!cleanWord) return;

    const currentUser = getCurrentUser();
    const formattedWord = capitalize(entry.word || cleanWord);
    const phonetic = entry.phonetic || `/${cleanWord}/`;
    const partOfSpeech = entry.partOfSpeech || 'noun';
    const definition = entry.definition || 'Collegiate vocabulary search entry.';
    const defsViewedCount = entry.defsViewedCount || 1;
    const nowTime = entry.timestamp || Date.now();

    if (currentUser && (currentUser.id || currentUser._id)) {
      const userId = currentUser.id || currentUser._id;

      // Optimistically update in-memory list (remove duplicate if re-searched and unshift to top)
      const existingIdx = userHistoryList.findIndex(h => (h.word || '').toLowerCase() === cleanWord);
      const historyItem = {
        _id: existingIdx !== -1 ? userHistoryList[existingIdx]._id : ('temp_h_' + Date.now()),
        userId: userId,
        word: formattedWord,
        phonetic: phonetic,
        partOfSpeech: partOfSpeech,
        definition: definition,
        defsViewedCount: defsViewedCount,
        searchedAt: new Date(nowTime).toISOString(),
        timestamp: nowTime
      };

      if (existingIdx !== -1) {
        userHistoryList.splice(existingIdx, 1);
      }
      userHistoryList.unshift(historyItem);

      try {
        localStorage.setItem(`smart_dict_history_${userId}`, JSON.stringify(userHistoryList));
      } catch (e) {}

      updateRecentChipsFromHistory();
      if (historyView && !historyView.classList.contains('hidden')) {
        renderHistoryView();
      }

      // Persist to MongoDB API (saves or updates searchedAt without duplicate rows)
      try {
        const response = await fetch(HISTORY_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            word: cleanWord,
            phonetic: phonetic,
            partOfSpeech: partOfSpeech,
            definition: definition,
            defsViewedCount: defsViewedCount
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.history) {
            const idx = userHistoryList.findIndex(h => (h.word || '').toLowerCase() === cleanWord);
            if (idx !== -1) {
              userHistoryList[idx] = {
                ...data.history,
                timestamp: new Date(data.history.searchedAt).getTime()
              };
            }
            try {
              localStorage.setItem(`smart_dict_history_${userId}`, JSON.stringify(userHistoryList));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('[Smart Dictionary] Failed to save search history to MongoDB:', err);
      }
    } else {
      // Guest localStorage fallback
      const history = getSearchHistory();
      const filtered = history.filter(item => (item.word || '').trim().toLowerCase() !== cleanWord);

      const newEntry = {
        word: formattedWord,
        phonetic: phonetic,
        partOfSpeech: partOfSpeech,
        definition: definition,
        defsViewedCount: defsViewedCount,
        timestamp: nowTime
      };

      filtered.unshift(newEntry);

      try {
        localStorage.setItem('smart_dict_history', JSON.stringify(filtered));
      } catch (e) {
        console.warn('[Smart Dictionary] LocalStorage history save error:', e);
      }

      updateRecentChipsFromHistory();
      if (historyView && !historyView.classList.contains('hidden')) {
        renderHistoryView();
      }
    }
  }

  async function deleteHistoryItem(wordName) {
    const cleanWord = (wordName || '').trim().toLowerCase();
    if (!cleanWord) return;

    const currentUser = getCurrentUser();
    if (currentUser && (currentUser.id || currentUser._id)) {
      const userId = currentUser.id || currentUser._id;
      const prevList = [...userHistoryList];

      userHistoryList = userHistoryList.filter(item => (item.word || '').toLowerCase() !== cleanWord);
      try {
        localStorage.setItem(`smart_dict_history_${userId}`, JSON.stringify(userHistoryList));
      } catch (e) {}

      updateRecentChipsFromHistory();
      renderHistoryView();

      try {
        const response = await fetch(`${HISTORY_API_URL}/${userId}/${encodeURIComponent(cleanWord)}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          userHistoryList = prevList;
          try {
            localStorage.setItem(`smart_dict_history_${userId}`, JSON.stringify(userHistoryList));
          } catch (e) {}
          updateRecentChipsFromHistory();
          renderHistoryView();
        }
      } catch (err) {
        console.warn('[Smart Dictionary] Error deleting history item from MongoDB:', err);
      }
    } else {
      const history = getSearchHistory();
      const updated = history.filter(item => (item.word || '').trim().toLowerCase() !== cleanWord);
      try {
        localStorage.setItem('smart_dict_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('[Smart Dictionary] LocalStorage history delete error:', e);
      }
      updateRecentChipsFromHistory();
      renderHistoryView();
    }
  }

  async function clearSearchHistory() {
    const currentUser = getCurrentUser();
    if (currentUser && (currentUser.id || currentUser._id)) {
      const userId = currentUser.id || currentUser._id;
      userHistoryList = [];
      try {
        localStorage.setItem(`smart_dict_history_${userId}`, JSON.stringify([]));
      } catch (e) {}

      updateRecentChipsFromHistory();
      renderHistoryView();

      try {
        await fetch(`${HISTORY_API_URL}/${userId}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.warn('[Smart Dictionary] Error clearing search history on backend:', err);
      }
    } else {
      try {
        localStorage.setItem('smart_dict_history', JSON.stringify([]));
      } catch (e) {
        console.warn('[Smart Dictionary] LocalStorage history clear error:', e);
      }
      updateRecentChipsFromHistory();
      renderHistoryView();
    }
  }

  function updateRecentChipsFromHistory() {
    const history = getSearchHistory();
    if (!recentChipsList) return;

    if (history.length === 0) {
      recentChipsList.innerHTML = '<span style="color: var(--color-text-muted); font-size: 0.82rem; font-style: italic;">No recent searches to display.</span>';
      if (clearRecentBtn) clearRecentBtn.style.display = 'none';
      return;
    }

    recentChipsList.innerHTML = '';
    if (clearRecentBtn) clearRecentBtn.style.display = 'inline-flex';

    history.slice(0, 5).forEach(item => {
      const chip = document.createElement('button');
      chip.className = 'recent-chip';
      chip.setAttribute('data-word', (item.word || '').toLowerCase());
      chip.innerHTML = `
        <span class="chip-word">${escapeHtml(item.word)}</span>
        <span class="chip-time">${escapeHtml(formatRelativeTime(item.timestamp || (item.searchedAt ? new Date(item.searchedAt).getTime() : Date.now())))}</span>
        <svg class="chip-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M4 12L12 4M12 4H6M12 4V10"/>
        </svg>
      `;
      recentChipsList.appendChild(chip);
    });
  }

  function initHistorySystem() {
    updateRecentChipsFromHistory();
  }

  // --------------------------------------------------------------------------
  // 13. SEARCH HISTORY VIEW CONTROLLER & RENDERING
  // --------------------------------------------------------------------------
  function renderHistoryView() {
    const history = getSearchHistory();

    if (historyWeeklyCount) {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const weekCount = history.filter(h => {
        const ts = h.timestamp || (h.searchedAt ? new Date(h.searchedAt).getTime() : 0);
        return ts >= sevenDaysAgo;
      }).length;
      historyWeeklyCount.textContent = weekCount || history.length;
    }
    if (historyTopCategory) {
      historyTopCategory.textContent = 'Academic Lexicon';
    }

    renderHistoryList(currentHistorySearchQuery);
  }

  function renderHistoryList(searchQuery = '') {
    if (!historyGroupsList) return;

    const allHistory = getSearchHistory();
    const query = (searchQuery || '').trim().toLowerCase();

    let filtered = allHistory;
    if (query) {
      filtered = filtered.filter(item => {
        const wordMatch = (item.word || '').toLowerCase().includes(query);
        const defMatch = (item.definition || '').toLowerCase().includes(query);
        const posMatch = (item.partOfSpeech || '').toLowerCase().includes(query);
        return wordMatch || defMatch || posMatch;
      });
    }

    if (filtered.length === 0) {
      if (allHistory.length === 0) {
        historyGroupsList.innerHTML = `
          <div class="card-surface history-empty-card">
            <svg class="empty-history-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h3 class="empty-title">No Search History Yet</h3>
            <p class="empty-desc">
              Words you look up will be recorded here automatically in MongoDB to help you review, track retention, and revise for academic writing.
            </p>
            <button class="retry-search-btn" id="emptyHistoryGoSearchBtn">
              <span>🔍 Search Lexicon Now</span>
            </button>
          </div>
        `;
        const goSearchBtn = document.getElementById('emptyHistoryGoSearchBtn');
        if (goSearchBtn) {
          goSearchBtn.addEventListener('click', () => {
            showHomeView();
            focusSearchInput();
          });
        }
      } else {
        historyGroupsList.innerHTML = `
          <div class="card-surface history-empty-card" style="padding: 36px 20px;">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.75" style="color: var(--color-text-muted); margin-bottom: 4px;">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21L16.65 16.65"/>
            </svg>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-title);">
              No Matching History Found
            </h3>
            <p style="font-size: 0.88rem; color: var(--color-text-secondary); max-width: 380px;">
              No past searches matched "<strong>${escapeHtml(searchQuery)}</strong>".
            </p>
            <button class="back-to-wotd-btn" id="resetHistoryFilterBtn" style="margin-top: 8px;">
              <span>Clear Filter</span>
            </button>
          </div>
        `;
        const resetBtn = document.getElementById('resetHistoryFilterBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (historyFilterInput) historyFilterInput.value = '';
            currentHistorySearchQuery = '';
            renderHistoryList('');
          });
        }
      }
      return;
    }

    const groupsMap = new Map();
    filtered.forEach(item => {
      const ts = item.timestamp || (item.searchedAt ? new Date(item.searchedAt).getTime() : Date.now());
      const groupKey = getDateGroupKey(ts);
      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, []);
      }
      groupsMap.get(groupKey).push(item);
    });

    let html = '';
    groupsMap.forEach((groupItems, groupKey) => {
      const lookupsLabel = `${groupItems.length} ${groupItems.length === 1 ? 'lookup' : 'lookups'}`;

      const itemsHtml = groupItems.map(item => {
        const word = item.word || 'Word';
        const isSaved = isWordInFavorites(word);
        const pos = (item.partOfSpeech || 'noun').toLowerCase();
        const posClass = pos.includes('adj') ? 'pos-adjective' : (pos.includes('verb') ? 'pos-verb' : 'pos-noun');
        const phonetic = item.phonetic || '';
        const defSnippet = item.definition || '';
        const ts = item.timestamp || (item.searchedAt ? new Date(item.searchedAt).getTime() : Date.now());
        const timeString = formatClockTime(ts);
        const defsCount = item.defsViewedCount || 1;

        return `
          <article class="history-item-card card-surface" data-word="${escapeHtml(word)}">
            <div class="history-item-top">
              <div class="history-item-main" data-word="${escapeHtml(word)}" title="Look up ${escapeHtml(word)} again">
                <div class="history-item-title-row">
                  <span class="history-item-word">${escapeHtml(word)}</span>
                  <span class="history-pos-badge ${posClass}">${escapeHtml(pos)}</span>
                  <span class="history-phonetic">${escapeHtml(phonetic)}</span>
                </div>
                <p class="history-item-def">${escapeHtml(defSnippet)}</p>
              </div>

              <div class="history-item-actions">
                <button class="history-star-btn ${isSaved ? 'saved' : ''}" data-word="${escapeHtml(word)}" title="Toggle Favorite" aria-label="Toggle Favorite for ${escapeHtml(word)}">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="${isSaved ? '#f59e0b' : 'none'}" stroke="${isSaved ? '#f59e0b' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
                <button class="history-delete-item-btn" data-word="${escapeHtml(word)}" title="Remove from History" aria-label="Remove ${escapeHtml(word)} from history">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="history-item-meta-footer" data-word="${escapeHtml(word)}" title="Look up ${escapeHtml(word)} again">
              <span>Searched at ${escapeHtml(timeString)}</span>
              <span class="meta-dot">•</span>
              <span>${defsCount} ${defsCount === 1 ? 'def' : 'defs'} viewed</span>
            </div>
          </article>
        `;
      }).join('');

      html += `
        <div class="history-date-group">
          <div class="history-group-header">
            <span class="group-date-label">${escapeHtml(groupKey)}</span>
            <span class="group-lookups-count">${escapeHtml(lookupsLabel)}</span>
          </div>
          <div class="history-items-stack">
            ${itemsHtml}
          </div>
        </div>
      `;
    });

    historyGroupsList.innerHTML = html;
  }

  // Event Delegation on Search History List
  if (historyGroupsList) {
    historyGroupsList.addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('.history-delete-item-btn');
      if (deleteBtn) {
        const word = deleteBtn.getAttribute('data-word');
        if (word) {
          await deleteHistoryItem(word);
          showToast(`🗑 Removed "${word}" from search history.`);
        }
        return;
      }

      const starBtn = e.target.closest('.history-star-btn');
      if (starBtn) {
        const word = starBtn.getAttribute('data-word');
        if (word) {
          const isSaved = isWordInFavorites(word);
          if (isSaved) {
            await removeFavoriteWord(word);
            starBtn.classList.remove('saved');
            const svg = starBtn.querySelector('svg');
            if (svg) {
              svg.setAttribute('fill', 'none');
              svg.setAttribute('stroke', 'currentColor');
            }
          } else {
            const history = getSearchHistory();
            const histItem = history.find(h => (h.word || '').toLowerCase() === word.toLowerCase());
            await saveFavoriteWord({
              word: histItem ? histItem.word : word,
              phonetic: histItem ? histItem.phonetic : `/${word}/`,
              partOfSpeech: histItem ? histItem.partOfSpeech : 'noun',
              definition: histItem ? histItem.definition : 'Saved from search history.',
              example: '',
              addedTimeLabel: 'Added just now',
              addedAt: Date.now(),
              audio: ''
            });
            starBtn.classList.add('saved');
            const svg = starBtn.querySelector('svg');
            if (svg) {
              svg.setAttribute('fill', '#f59e0b');
              svg.setAttribute('stroke', '#f59e0b');
            }
          }
        }
        return;
      }

      const itemMain = e.target.closest('.history-item-main');
      const itemFooter = e.target.closest('.history-item-meta-footer');
      const targetElement = itemMain || itemFooter;

      if (targetElement) {
        const word = targetElement.getAttribute('data-word');
        if (word) {
          if (searchInput) searchInput.value = word;
          fetchWordDefinition(word);
        }
      }
    });
  }

  if (clearAllHistoryBtn) {
    clearAllHistoryBtn.addEventListener('click', async () => {
      const history = getSearchHistory();
      if (history.length === 0) {
        showToast('Search history is already empty.');
        return;
      }

      const confirmed = window.confirm('Are you sure you want to clear your entire search history? This action cannot be undone.');
      if (confirmed) {
        await clearSearchHistory();

        if (recentChipsList) {
          recentChipsList.innerHTML = '<span style="color: var(--color-text-muted); font-size: 0.82rem; font-style: italic;">No recent searches to display.</span>';
        }
        if (clearRecentBtn) clearRecentBtn.style.display = 'none';

        showToast('🗑 Search history cleared.');
      }
    });
  }

  if (historyFilterInput) {
    historyFilterInput.addEventListener('input', (e) => {
      currentHistorySearchQuery = e.target.value;
      renderHistoryList(currentHistorySearchQuery);
    });
  }

  // --------------------------------------------------------------------------
  // 14. VOCABULARY QUIZ ENGINE (Interactive 5-Question MCQs & Score Calculator)
  // --------------------------------------------------------------------------
  function startQuizEngine() {
    currentQuizIndex = 0;
    quizScore = 0;
    quizTotalPoints = 200;
    isCurrentQuestionAnswered = false;
    quizUserAnswers = [];

    if (quizBottomStatsRow) quizBottomStatsRow.style.display = 'grid';
    if (quizDeckBanner) quizDeckBanner.style.display = 'flex';

    renderCurrentQuizQuestion();
  }

  function renderCurrentQuizQuestion() {
    if (!quizDynamicContent) return;

    const totalQuestions = QUIZ_QUESTIONS.length;
    const currentQ = QUIZ_QUESTIONS[currentQuizIndex];
    isCurrentQuestionAnswered = false;

    // Update Progress Indicator
    if (quizProgressCounter) {
      quizProgressCounter.textContent = `Question ${currentQuizIndex + 1} of ${totalQuestions}`;
    }
    if (quizProgressFill) {
      const fillPercent = ((currentQuizIndex + 1) / totalQuestions) * 100;
      quizProgressFill.style.width = `${fillPercent}%`;
    }

    // Update XP Badge
    if (quizXpText) {
      quizXpText.textContent = `${quizTotalPoints} pts`;
    }

    // Update Accuracy Value
    if (quizAccuracyVal) {
      if (quizUserAnswers.length === 0) {
        quizAccuracyVal.textContent = '100% Correct';
      } else {
        const correctSoFar = quizUserAnswers.filter(a => a.isCorrect).length;
        const accuracyPct = Math.round((correctSoFar / quizUserAnswers.length) * 100);
        quizAccuracyVal.textContent = `${accuracyPct}% Correct`;
      }
    }

    // Generate Option Buttons (A, B, C, D)
    const letters = ['A', 'B', 'C', 'D'];
    const optionsHtml = currentQ.options.map((opt, idx) => `
      <button class="quiz-option-btn" data-index="${idx}">
        <div class="option-left">
          <span class="option-letter">${letters[idx]}</span>
          <span class="option-text">${escapeHtml(opt)}</span>
        </div>
        <span class="option-indicator">
          <svg class="circle-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9"/>
          </svg>
        </span>
      </button>
    `).join('');

    // Question Card HTML
    quizDynamicContent.innerHTML = `
      <article class="quiz-question-card card-surface">
        
        <!-- Question Meta Top Bar -->
        <div class="question-meta-bar">
          <div class="meta-badges-left">
            <span class="q-meta-badge"><span style="font-size: 1rem;">⚖</span> ${escapeHtml(currentQ.partOfSpeech)}</span>
            <span class="q-meta-badge"><span style="font-size: 1rem;">📜</span> ${escapeHtml(currentQ.origin)}</span>
          </div>
          <button class="q-audio-btn" id="quizQuestionAudioBtn" title="Listen to pronunciation of ${escapeHtml(currentQ.word)}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          </button>
        </div>

        <!-- Question Category Eyebrow -->
        <span class="q-category-eyebrow">${escapeHtml(currentQ.category)}</span>

        <!-- Main Question Title -->
        <h2 class="q-heading">${currentQ.questionHtml}</h2>

        <!-- Options List -->
        <div class="quiz-options-list" id="quizOptionsList">
          ${optionsHtml}
        </div>

        <!-- Explanation Callout (Hidden until answered) -->
        <div class="quiz-explanation-box hidden" id="quizExplanationBox">
          <div class="exp-header">
            <span style="font-size: 1.1rem;">💡</span>
            <span class="exp-title" id="quizExpTitle">Spot on!</span>
          </div>
          <p class="exp-body" id="quizExpBody">${currentQ.explanation}</p>
        </div>

        <!-- Actions Row -->
        <div class="quiz-actions-row">
          <button class="quiz-skip-btn" id="quizSkipBtn">Skip Question</button>
          <button class="quiz-next-btn disabled" id="quizNextBtn" disabled>
            <span>Next Question</span>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="8" x2="13" y2="8"/>
              <polyline points="9 4 13 8 9 12"/>
            </svg>
          </button>
        </div>

      </article>
    `;

    // Attach Quiz Events
    attachQuizQuestionEvents(currentQ);
  }

  function attachQuizQuestionEvents(currentQ) {
    // 1. Audio Button
    const audioBtn = document.getElementById('quizQuestionAudioBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        playPronunciation(currentQ.word, null, audioBtn);
      });
    }

    // 2. Options Selection
    const optionsList = document.getElementById('quizOptionsList');
    const explanationBox = document.getElementById('quizExplanationBox');
    const expTitle = document.getElementById('quizExpTitle');
    const nextBtn = document.getElementById('quizNextBtn');
    const skipBtn = document.getElementById('quizSkipBtn');

    if (optionsList) {
      const optionButtons = optionsList.querySelectorAll('.quiz-option-btn');

      optionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (isCurrentQuestionAnswered) return;
          isCurrentQuestionAnswered = true;

          const selectedIdx = parseInt(btn.getAttribute('data-index'), 10);
          const isCorrect = (selectedIdx === currentQ.correctIndex);

          // Record User Answer
          quizUserAnswers.push({
            question: currentQ,
            selectedIdx,
            isCorrect
          });

          // Disable all buttons to freeze choice
          optionButtons.forEach(b => {
            b.disabled = true;
          });

          // Apply Correct / Incorrect Styling
          if (isCorrect) {
            quizScore++;
            quizTotalPoints += 50;
            btn.classList.add('selected-correct');

            const indicator = btn.querySelector('.option-indicator');
            if (indicator) {
              indicator.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clip-rule="evenodd"/>
                </svg>
              `;
            }

            if (expTitle) expTitle.textContent = 'Spot on!';
            showToast('🎉 Correct answer! (+50 XP)');
          } else {
            btn.classList.add('selected-incorrect');

            const indicator = btn.querySelector('.option-indicator');
            if (indicator) {
              indicator.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.7 12.3l-1.4 1.4-2.3-2.3-2.3 2.3-1.4-1.4 2.3-2.3-2.3-2.3 1.4-1.4 2.3 2.3 2.3-2.3 1.4 1.4-2.3 2.3 2.3 2.3z" clip-rule="evenodd"/>
                </svg>
              `;
            }

            // Highlight the correct answer for clarity
            const correctBtn = optionButtons[currentQ.correctIndex];
            if (correctBtn) {
              correctBtn.classList.add('revealed-correct');
              const corrInd = correctBtn.querySelector('.option-indicator');
              if (corrInd) {
                corrInd.innerHTML = `
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clip-rule="evenodd"/>
                  </svg>
                `;
              }
            }

            if (expTitle) expTitle.textContent = 'Academic Insight:';
            showToast('Reviewing correct collegiate definition.');
          }

          // Show Explanation
          if (explanationBox) {
            explanationBox.classList.remove('hidden');
          }

          // Update XP Points & Accuracy
          if (quizXpText) {
            quizXpText.textContent = `${quizTotalPoints} pts`;
          }
          if (quizAccuracyVal) {
            const correctSoFar = quizUserAnswers.filter(a => a.isCorrect).length;
            const accuracyPct = Math.round((correctSoFar / quizUserAnswers.length) * 100);
            quizAccuracyVal.textContent = `${accuracyPct}% Correct`;
          }

          // Enable Next Button
          if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.classList.remove('disabled');
          }
        });
      });
    }

    // 3. Skip Button
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        if (!isCurrentQuestionAnswered) {
          // Record as skipped/unanswered
          quizUserAnswers.push({
            question: currentQ,
            selectedIdx: -1,
            isCorrect: false
          });
        }
        advanceQuizStep();
      });
    }

    // 4. Next Question Button
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        advanceQuizStep();
      });
    }
  }

  function advanceQuizStep() {
    currentQuizIndex++;
    if (currentQuizIndex < QUIZ_QUESTIONS.length) {
      renderCurrentQuizQuestion();
    } else {
      renderQuizFinalResult();
    }
  }

  function renderQuizFinalResult() {
    if (!quizDynamicContent) return;

    // Hide Bottom Stats and Deck Callout on Results Screen
    if (quizBottomStatsRow) quizBottomStatsRow.style.display = 'none';
    if (quizDeckBanner) quizDeckBanner.style.display = 'none';

    // Update Progress Bar to 100%
    if (quizProgressCounter) {
      quizProgressCounter.textContent = 'Quiz Completed';
    }
    if (quizProgressFill) {
      quizProgressFill.style.width = '100%';
    }

    const totalQ = QUIZ_QUESTIONS.length;
    const percentage = Math.round((quizScore / totalQ) * 100);
    const xpEarned = quizScore * 50;

    // Determine Trophy and Performance Feedback Message
    let trophyEmoji = '🏆';
    let feedbackMessage = 'Outstanding Collegiate Mastery! You demonstrated exceptional grasp of GRE and academic lexicon.';

    if (percentage === 100) {
      trophyEmoji = '🏆';
      feedbackMessage = 'Flawless Academic Mastery! You scored 100% on the Daily Vocabulary Quiz.';
    } else if (percentage >= 80) {
      trophyEmoji = '🎯';
      feedbackMessage = 'Excellent Performance! Strong vocabulary command suitable for university writing.';
    } else if (percentage >= 60) {
      trophyEmoji = '👍';
      feedbackMessage = 'Good Effort! Revisiting your missed words will solidify long-term retention.';
    } else {
      trophyEmoji = '📚';
      feedbackMessage = 'Keep Practicing! Review your Personal Lexicon favorites to build vocabulary confidence.';
    }

    // Automatically save completed score to MongoDB if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser && (currentUser.id || currentUser._id)) {
      saveQuizScoreToBackend({
        userId: currentUser.id || currentUser._id,
        score: quizScore,
        totalQuestions: totalQ,
        percentage: percentage
      });
    }

    // Generate Review Breakdown of the 5 Questions
    const reviewItemsHtml = quizUserAnswers.map((ans, idx) => {
      const q = ans.question;
      const letters = ['A', 'B', 'C', 'D'];
      const userChoiceText = ans.selectedIdx >= 0 ? `${letters[ans.selectedIdx]}. ${q.options[ans.selectedIdx]}` : 'Skipped';
      const statusClass = ans.isCorrect ? 'correct' : 'incorrect';
      const statusIcon = ans.isCorrect ? '✓ Correct' : '✗ Incorrect';

      return `
        <div class="review-item">
          <div>
            <span class="review-item-word">${idx + 1}. ${escapeHtml(q.word)}</span>
            <span style="font-size: 0.8rem; color: var(--color-text-secondary); margin-left: 6px;">(${escapeHtml(q.partOfSpeech)})</span>
            <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-top: 2px;">Your answer: ${escapeHtml(userChoiceText)}</p>
          </div>
          <span class="review-item-status ${statusClass}">${statusIcon}</span>
        </div>
      `;
    }).join('');

    // Final Result Card HTML
    quizDynamicContent.innerHTML = `
      <article class="quiz-result-card card-surface">
        
        <div class="result-trophy-wrap">
          <span>${trophyEmoji}</span>
        </div>

        <span class="result-eyebrow">SESSION SUMMARY</span>
        <h2 class="result-score-title">${quizScore} / ${totalQ} Correct</h2>
        
        <div class="result-percentage-badge">
          ${percentage}% Score · +${xpEarned} XP Earned
        </div>

        <p class="result-feedback-message">${escapeHtml(feedbackMessage)}</p>

        <!-- Question Performance Breakdown -->
        <div class="result-questions-review">
          <h4 class="review-title">Performance Breakdown</h4>
          ${reviewItemsHtml}
        </div>

        <!-- Action Buttons -->
        <div class="result-actions-row">
          <button class="quiz-restart-btn" id="quizRestartBtn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            <span>Restart Quiz</span>
          </button>
          
          <button class="quiz-favs-btn" id="quizGoFavoritesBtn">
            <span>Review Favorites</span>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="3" y1="8" x2="13" y2="8"/>
              <polyline points="9 4 13 8 9 12"/>
            </svg>
          </button>
        </div>

      </article>
    `;

    // Attach Final Action Listeners
    const restartBtn = document.getElementById('quizRestartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        startQuizEngine();
      });
    }

    const goFavsBtn = document.getElementById('quizGoFavoritesBtn');
    if (goFavsBtn) {
      goFavsBtn.addEventListener('click', () => {
        showFavoritesView();
      });
    }
  }

  /**
   * Saves completed quiz score to MongoDB backend
   */
  async function saveQuizScoreToBackend(scoreData) {
    try {
      const response = await fetch(QUIZ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreData)
      });

      if (response.ok) {
        showToast('🏆 Quiz score saved to your profile!');
      } else {
        const data = await response.json();
        console.warn('[Smart Dictionary] Could not save quiz score:', data.message);
      }
    } catch (error) {
      console.warn('[Smart Dictionary] Quiz score network error:', error);
    }
  }

  // --------------------------------------------------------------------------
  // 15. AUDIO PRONUNCIATION (API Audio + Web Speech API Fallback)
  // --------------------------------------------------------------------------
  function playPronunciation(word, audioUrl, buttonEl) {
    if (buttonEl) buttonEl.classList.add('playing');

    if (audioUrl) {
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        if (buttonEl) buttonEl.classList.remove('playing');
      };

      audio.onerror = () => {
        console.warn(`[Smart Dictionary] Remote audio failed for "${word}", fallback to SpeechSynthesis.`);
        fallbackSpeechSynthesis(word, buttonEl);
      };

      audio.play().catch(err => {
        console.warn('[Smart Dictionary] Audio play caught error, fallback to SpeechSynthesis:', err);
        fallbackSpeechSynthesis(word, buttonEl);
      });
    } else {
      fallbackSpeechSynthesis(word, buttonEl);
    }
  }

  function fallbackSpeechSynthesis(word, buttonEl) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.85;
      utterance.lang = 'en-US';

      utterance.onend = () => {
        if (buttonEl) buttonEl.classList.remove('playing');
      };
      utterance.onerror = () => {
        if (buttonEl) buttonEl.classList.remove('playing');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      if (buttonEl) buttonEl.classList.remove('playing');
      showToast(`Pronouncing: "${word}"`);
    }
  }

  // --------------------------------------------------------------------------
  // 16. RECENT QUICK LOOKUPS MANAGER (Homepage)
  // --------------------------------------------------------------------------
  function addWordToRecentSearches(word) {
    if (!recentChipsList) return;

    const emptyMsg = recentChipsList.querySelector('span');
    if (emptyMsg) {
      recentChipsList.innerHTML = '';
      if (clearRecentBtn) clearRecentBtn.style.display = 'block';
    }

    const safeWord = word.replace(/'/g, "\\'");
    const existing = recentChipsList.querySelector(`[data-word="${safeWord.toLowerCase()}"]`);
    if (existing) {
      existing.remove();
    }

    const chip = document.createElement('button');
    chip.className = 'recent-chip';
    chip.setAttribute('data-word', word.toLowerCase());
    chip.innerHTML = `
      <span class="chip-word">${escapeHtml(capitalize(word))}</span>
      <span class="chip-time">Just now</span>
      <svg class="chip-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M4 12L12 4M12 4H6M12 4V10"/>
      </svg>
    `;

    recentChipsList.prepend(chip);

    while (recentChipsList.children.length > 6) {
      recentChipsList.removeChild(recentChipsList.lastChild);
    }
  }

  // --------------------------------------------------------------------------
  // 17. HOMEPAGE EVENT LISTENERS & CHIPS
  // --------------------------------------------------------------------------
  // Word of the Day Star Favorite Button (Homepage)
  if (favoriteToggleBtn) {
    favoriteToggleBtn.addEventListener('click', async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        showToast('⚠️ Please sign in to save words to your favorites.');
        openAuthModal('login');
        return;
      }

      const isSaved = isWordInFavorites('ephemeral');
      if (isSaved) {
        await removeFavoriteWord('ephemeral');
      } else {
        await saveFavoriteWord({
          word: 'Ephemeral',
          phonetic: '/ɪˈfem.ər.əl/',
          partOfSpeech: 'adj.',
          definition: 'Lasting for a very short time; fleeting or transient.',
          example: 'Fashions are ephemeral, but true style endures.',
          audio: ''
        });
      }
    });
  }

  // Word of the Day Audio
  if (playAudioBtn) {
    playAudioBtn.addEventListener('click', () => {
      playPronunciation('Ephemeral', null, playAudioBtn);
    });
  }

  // Explore Etymology link on WOTD card -> Opens Word Result view for Ephemeral
  const wotdEtymologyLink = document.querySelector('.wotd-footer-bar .etymology-link');
  if (wotdEtymologyLink) {
    wotdEtymologyLink.addEventListener('click', () => {
      fetchWordDefinition('ephemeral');
    });
  }

  // Trending Chips -> Search
  trendChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const word = chip.getAttribute('data-word') || chip.innerText.trim();
      if (searchInput) searchInput.value = word;
      fetchWordDefinition(word);
    });
  });

  // Recent Searches Chips -> Search
  if (recentChipsList) {
    recentChipsList.addEventListener('click', (e) => {
      const chip = e.target.closest('.recent-chip');
      if (chip) {
        const word = chip.getAttribute('data-word') || chip.querySelector('.chip-word')?.textContent;
        if (word) {
          if (searchInput) searchInput.value = word;
          fetchWordDefinition(word);
        }
      }
    });
  }

  // Popular & Trending Items -> Search
  rankedItems.forEach((item) => {
    item.addEventListener('click', () => {
      const word = item.getAttribute('data-word');
      if (word) {
        if (searchInput) searchInput.value = word;
        fetchWordDefinition(word);
      }
    });
  });

  // Clear Recent Lookups on Homepage
  if (clearRecentBtn) {
    clearRecentBtn.addEventListener('click', async () => {
      const confirmed = window.confirm('Clear recent quick lookups from the homepage?');
      if (confirmed) {
        await clearSearchHistory();
        if (recentChipsList) {
          recentChipsList.innerHTML = '<span style="color: var(--color-text-muted); font-size: 0.82rem; font-style: italic;">No recent searches to display.</span>';
          clearRecentBtn.style.display = 'none';
        }
        showToast('Recent quick lookups cleared.');
      }
    });
  }

  // Voice Search Trigger
  if (voiceSearchBtn) {
    voiceSearchBtn.addEventListener('click', () => {
      showToast('🎙 Voice search listening... (Speak now)');
    });
  }

  // Mobile Menu Toggle
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  // --------------------------------------------------------------------------
  // 18. UTILITY HELPERS
  // --------------------------------------------------------------------------
  function formatRelativeTime(timestamp) {
    if (!timestamp) return 'Just now';
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function formatClockTime(timestamp) {
    if (!timestamp) return '12:00 PM';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getDateGroupKey(timestamp) {
    if (!timestamp) return 'TODAY';
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return 'TODAY';

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isYesterday) return 'YESTERDAY';

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase();
  }

  function showToast(message, duration = 2600) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ==========================================================================
  // 19. AUTHENTICATION & USER MANAGEMENT CONTROLLER (Node/Express/MongoDB API)
  // ==========================================================================

  /**
   * Initializes user authentication state on page load from localStorage
   */
  function initAuthState() {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        if (user && user.email) {
          updateUserProfileUI(user);
          fetchUserFavorites(user.id || user._id);
          fetchUserSearchHistory(user.id || user._id);
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading stored user auth:', e);
    }
    // Default guest state if not logged in
    updateUserProfileUI(null);
    userFavoritesList = [];
    userHistoryList = [];
    updateFavoritesBadgeCount();
    syncWotdFavoriteState();
    updateRecentChipsFromHistory();
  }

  /**
   * Updates Header Profile badge and dropdown according to logged-in user or guest state
   */
  function updateUserProfileUI(user) {
    if (user && user.name) {
      if (userNameDisplay) userNameDisplay.textContent = user.name;
      if (userRoleDisplay) {
        userRoleDisplay.innerHTML = '<span class="dot-green"></span>Scholar';
      }
      if (userOnlineIndicator) {
        userOnlineIndicator.classList.remove('offline');
        userOnlineIndicator.setAttribute('aria-label', 'Online');
      }
      if (dropdownUserName) dropdownUserName.textContent = user.name;
      if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || '';
      if (dropdownAvatarCircle) {
        dropdownAvatarCircle.textContent = (user.name.charAt(0) || 'S').toUpperCase();
      }
      if (userProfileBadge) {
        userProfileBadge.setAttribute('title', `${user.name} (${user.email || 'Scholar'}) - Click to view account`);
      }
    } else {
      if (userNameDisplay) userNameDisplay.textContent = 'Sign In';
      if (userRoleDisplay) {
        userRoleDisplay.innerHTML = '<span class="dot-green" style="background-color: #94a3b8;"></span>Guest';
      }
      if (userOnlineIndicator) {
        userOnlineIndicator.classList.add('offline');
        userOnlineIndicator.setAttribute('aria-label', 'Offline');
      }
      if (dropdownUserName) dropdownUserName.textContent = 'Guest Scholar';
      if (dropdownUserEmail) dropdownUserEmail.textContent = 'Not signed in';
      if (dropdownAvatarCircle) dropdownAvatarCircle.textContent = 'G';
      if (userProfileBadge) {
        userProfileBadge.setAttribute('title', 'Sign In or Create Account');
      }
    }
  }

  /**
   * Checks if user is currently logged in
   */
  function getCurrentUser() {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      return null;
    }
    return null;
  }

  /**
   * Opens the Authentication Modal with specified tab
   */
  function openAuthModal(defaultTab = 'login') {
    if (!authModalOverlay) return;
    authModalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    switchAuthTab(defaultTab);
    clearAuthAlert('login');
    clearAuthAlert('register');
  }

  /**
   * Closes the Authentication Modal
   */
  function closeAuthModal() {
    if (!authModalOverlay) return;
    authModalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
    clearAuthAlert('login');
    clearAuthAlert('register');
  }

  /**
   * Switches between Sign In and Create Account tabs
   */
  function switchAuthTab(tab) {
    if (tab === 'login') {
      if (tabLoginBtn) {
        tabLoginBtn.classList.add('active');
        tabLoginBtn.setAttribute('aria-selected', 'true');
      }
      if (tabRegisterBtn) {
        tabRegisterBtn.classList.remove('active');
        tabRegisterBtn.setAttribute('aria-selected', 'false');
      }
      if (loginForm) loginForm.classList.remove('hidden');
      if (registerForm) registerForm.classList.add('hidden');
      if (authModalTitle) authModalTitle.textContent = 'Welcome to Smart Dictionary';
      if (authModalSubtitle) {
        authModalSubtitle.textContent = 'Sign in to synchronize your lexicon, track your search velocity, and save quiz mastery scores.';
      }
      clearAuthAlert('register');
      setTimeout(() => { if (loginEmail) loginEmail.focus(); }, 50);
    } else {
      if (tabRegisterBtn) {
        tabRegisterBtn.classList.add('active');
        tabRegisterBtn.setAttribute('aria-selected', 'true');
      }
      if (tabLoginBtn) {
        tabLoginBtn.classList.remove('active');
        tabLoginBtn.setAttribute('aria-selected', 'false');
      }
      if (registerForm) registerForm.classList.remove('hidden');
      if (loginForm) loginForm.classList.add('hidden');
      if (authModalTitle) authModalTitle.textContent = 'Create Scholar Account';
      if (authModalSubtitle) {
        authModalSubtitle.textContent = 'Join the collegiate academic lexicon to expand your vocabulary and track your mastery.';
      }
      clearAuthAlert('login');
      setTimeout(() => { if (registerName) registerName.focus(); }, 50);
    }
  }

  /**
   * Displays an inline error or success message in the Auth Modal
   */
  function showAuthAlert(formType, message, type = 'error') {
    const alertEl = formType === 'login' ? loginAlert : registerAlert;
    if (!alertEl) return;

    alertEl.className = `auth-alert alert-${type}`;
    let iconSvg = '';
    if (type === 'error') {
      iconSvg = `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><line x1="10" y1="6" x2="10" y2="10"/><line x1="10" y1="14" x2="10.01" y2="14"/></svg>`;
    } else if (type === 'success') {
      iconSvg = `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 6L8 14l-4-4"/></svg>`;
    } else {
      iconSvg = `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><line x1="10" y1="10" x2="10" y2="14"/><line x1="10" y1="6" x2="10.01" y2="6"/></svg>`;
    }

    alertEl.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    alertEl.classList.remove('hidden');
  }

  /**
   * Clears inline alert for a given form
   */
  function clearAuthAlert(formType) {
    const alertEl = formType === 'login' ? loginAlert : registerAlert;
    if (alertEl) {
      alertEl.classList.add('hidden');
      alertEl.innerHTML = '';
    }
  }

  /**
   * Sets loading state on submit buttons
   */
  function setBtnLoading(btn, isLoading, loadingText, defaultText) {
    if (!btn) return;
    btn.disabled = isLoading;
    const textSpan = btn.querySelector('.btn-text');
    const arrowIcon = btn.querySelector('.btn-arrow-icon');
    const spinner = btn.querySelector('.btn-spinner');

    if (textSpan) textSpan.textContent = isLoading ? loadingText : defaultText;
    if (arrowIcon) {
      if (isLoading) arrowIcon.classList.add('hidden');
      else arrowIcon.classList.remove('hidden');
    }
    if (spinner) {
      if (isLoading) spinner.classList.remove('hidden');
      else spinner.classList.add('hidden');
    }
  }

  /**
   * Handles User Registration API call (POST /api/auth/register)
   */
  async function handleUserRegister(e) {
    if (e) e.preventDefault();
    clearAuthAlert('register');

    const name = registerName ? registerName.value.trim() : '';
    const email = registerEmail ? registerEmail.value.trim() : '';
    const password = registerPassword ? registerPassword.value : '';

    // Validation
    if (!name || !email || !password) {
      showAuthAlert('register', 'Please fill in all required fields: name, email, and password.', 'error');
      return;
    }

    if (password.length < 6) {
      showAuthAlert('register', 'Password must be at least 6 characters long.', 'error');
      return;
    }

    setBtnLoading(registerSubmitBtn, true, 'Creating account...', 'Create Scholar Account');

    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || 'Registration failed. Please check your details and try again.';
        showAuthAlert('register', errorMsg, 'error');
        return;
      }

      // Success
      showAuthAlert('register', 'Registration successful! Switching to Sign In...', 'success');
      showToast('🎉 Scholar account created successfully! Please sign in.');
      if (registerForm) registerForm.reset();

      // Switch to Sign In tab after 1.2s and pre-fill email
      setTimeout(() => {
        switchAuthTab('login');
        if (loginEmail) {
          loginEmail.value = email;
          if (loginPassword) loginPassword.focus();
        }
        showAuthAlert('login', 'Account registered! Enter your password to sign in.', 'success');
      }, 1200);

    } catch (err) {
      console.error('Registration API Error:', err);
      showAuthAlert('register', 'Could not connect to backend server at http://localhost:5000. Please ensure the server is running.', 'error');
    } finally {
      setBtnLoading(registerSubmitBtn, false, 'Creating account...', 'Create Scholar Account');
    }
  }

  /**
   * Handles User Login API call (POST /api/auth/login)
   */
  async function handleUserLogin(e) {
    if (e) e.preventDefault();
    clearAuthAlert('login');

    const email = loginEmail ? loginEmail.value.trim() : '';
    const password = loginPassword ? loginPassword.value : '';

    // Validation
    if (!email || !password) {
      showAuthAlert('login', 'Please enter both your email address and password.', 'error');
      return;
    }

    setBtnLoading(loginSubmitBtn, true, 'Signing in...', 'Sign In to Lexicon');

    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || 'Invalid email or password. Please try again.';
        showAuthAlert('login', errorMsg, 'error');
        return;
      }

      // Success
      if (data.user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        updateUserProfileUI(data.user);
        await Promise.all([
          fetchUserFavorites(data.user.id || data.user._id),
          fetchUserSearchHistory(data.user.id || data.user._id)
        ]);
      }

      if (loginForm) loginForm.reset();
      closeAuthModal();
      showToast(`🎓 Welcome back, ${data.user?.name || 'Scholar'}!`);

    } catch (err) {
      console.error('Login API Error:', err);
      showAuthAlert('login', 'Could not connect to backend server at http://localhost:5000. Please ensure the server is running.', 'error');
    } finally {
      setBtnLoading(loginSubmitBtn, false, 'Signing in...', 'Sign In to Lexicon');
    }
  }

  /**
   * Handles User Logout
   */
  function handleUserLogout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    userFavoritesList = [];
    userHistoryList = [];
    updateUserProfileUI(null);
    updateFavoritesBadgeCount();
    syncWotdFavoriteState();
    syncWordResultFavoriteState();
    updateRecentChipsFromHistory();
    if (favoritesView && !favoritesView.classList.contains('hidden')) {
      renderFavoritesView();
    }
    if (historyView && !historyView.classList.contains('hidden')) {
      renderHistoryView();
    }
    if (userDropdownMenu) userDropdownMenu.classList.add('hidden');
    if (userProfileBadge) userProfileBadge.classList.remove('active');
    showToast('👋 You have been successfully signed out.');
  }

  /**
   * Toggles password visibility in input fields
   */
  function togglePasswordVisibility(inputEl, toggleBtn) {
    if (!inputEl) return;
    const isPassword = inputEl.type === 'password';
    inputEl.type = isPassword ? 'text' : 'password';

    if (toggleBtn) {
      if (isPassword) {
        toggleBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        `;
      } else {
        toggleBtn.innerHTML = `
          <svg class="icon-eye-open" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        `;
      }
    }
  }

  // --------------------------------------------------------------------------
  // 20. ATTACH AUTHENTICATION EVENT LISTENERS
  // --------------------------------------------------------------------------
  if (userProfileBadge) {
    userProfileBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentUser = getCurrentUser();
      if (currentUser) {
        // Toggle dropdown menu
        if (userDropdownMenu) {
          const isHidden = userDropdownMenu.classList.toggle('hidden');
          if (isHidden) {
            userProfileBadge.classList.remove('active');
          } else {
            userProfileBadge.classList.add('active');
          }
        }
      } else {
        // Not logged in -> open login modal
        openAuthModal('login');
      }
    });
  }

  if (dropdownLogoutBtn) {
    dropdownLogoutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleUserLogout();
    });
  }

  if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener('click', closeAuthModal);
  }

  if (authModalBackdrop) {
    authModalBackdrop.addEventListener('click', closeAuthModal);
  }

  if (tabLoginBtn) {
    tabLoginBtn.addEventListener('click', () => switchAuthTab('login'));
  }

  if (tabRegisterBtn) {
    tabRegisterBtn.addEventListener('click', () => switchAuthTab('register'));
  }

  if (switchToRegisterLink) {
    switchToRegisterLink.addEventListener('click', () => switchAuthTab('register'));
  }

  if (switchToLoginLink) {
    switchToLoginLink.addEventListener('click', () => switchAuthTab('login'));
  }

  if (toggleLoginPwdBtn) {
    toggleLoginPwdBtn.addEventListener('click', () => togglePasswordVisibility(loginPassword, toggleLoginPwdBtn));
  }

  if (toggleRegisterPwdBtn) {
    toggleRegisterPwdBtn.addEventListener('click', () => togglePasswordVisibility(registerPassword, toggleRegisterPwdBtn));
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleUserLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleUserRegister);
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (userDropdownMenu && !userDropdownMenu.classList.contains('hidden')) {
      if (!e.target.closest('.user-profile-wrapper')) {
        userDropdownMenu.classList.add('hidden');
        if (userProfileBadge) userProfileBadge.classList.remove('active');
      }
    }
  });

  // Close modal and dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuthModal();
      if (userDropdownMenu) {
        userDropdownMenu.classList.add('hidden');
        if (userProfileBadge) userProfileBadge.classList.remove('active');
      }
    }
  });

  // Initialize Auth State on App Startup
  initAuthState();
});