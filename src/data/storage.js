/**
 * storage.js — localStorage-based data persistence layer for EduPathAI
 * Stores user session data: exam scores, preferences, suggestions, guidance, chat history.
 * On refresh, screen always resets to 0 (landing). Only data is persisted, NOT screen position.
 */

const KEYS = {
  EXAM_SCORES: 'edupath_exam_scores',
  PREFERENCES: 'edupath_preferences',
  SUGGESTIONS: 'edupath_suggestions',
  SELECTED_COLLEGES: 'edupath_selected_colleges',
  GUIDANCE: 'edupath_guidance',
  CHAT_HISTORY: 'edupath_chat_history',
  SEARCH_HISTORY: 'edupath_search_history',
  LAST_SAVED: 'edupath_last_saved',
  CURRENT_SCREEN: 'edupath_current_screen',
};

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[EduPathAI Storage] Failed to save:', key, e);
  }
}

function safeGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('[EduPathAI Storage] Failed to read:', key, e);
    return fallback;
  }
}

/** Save the full current user session (data and screen number) */
export function saveSession({ examScores, preferences, suggestions, selectedColleges, guidance, currentScreen }) {
  if (examScores !== undefined) safeSet(KEYS.EXAM_SCORES, examScores);
  if (preferences !== undefined) safeSet(KEYS.PREFERENCES, preferences);
  if (suggestions !== undefined) safeSet(KEYS.SUGGESTIONS, suggestions);
  if (selectedColleges !== undefined) safeSet(KEYS.SELECTED_COLLEGES, selectedColleges);
  if (guidance !== undefined) safeSet(KEYS.GUIDANCE, guidance);
  if (currentScreen !== undefined) safeSet(KEYS.CURRENT_SCREEN, currentScreen);
  safeSet(KEYS.LAST_SAVED, new Date().toISOString());
}

/** Load saved session data (including screen position) */
export function loadSession() {
  return {
    examScores: safeGet(KEYS.EXAM_SCORES),
    preferences: safeGet(KEYS.PREFERENCES),
    suggestions: safeGet(KEYS.SUGGESTIONS, []),
    selectedColleges: safeGet(KEYS.SELECTED_COLLEGES, []),
    guidance: safeGet(KEYS.GUIDANCE),
    currentScreen: safeGet(KEYS.CURRENT_SCREEN, 0),
    lastSaved: safeGet(KEYS.LAST_SAVED),
  };
}

/** Clear all stored session data */
export function clearSession() {
  Object.values(KEYS).forEach((key) => {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  });
}

/** Save chatbot message history */
export function saveChatHistory(messages) {
  safeSet(KEYS.CHAT_HISTORY, messages.slice(-50)); // keep last 50 messages
}

/** Load chatbot message history */
export function loadChatHistory() {
  return safeGet(KEYS.CHAT_HISTORY, []);
}

/** Append a search result summary to search history (for future reference) */
export function saveToSearchHistory(examScores, preferences, suggestionCount) {
  const history = safeGet(KEYS.SEARCH_HISTORY, []);
  history.unshift({
    timestamp: new Date().toISOString(),
    exams: examScores.map((e) => `${e.exam}: ${e.score}`).join(', '),
    branch: preferences?.branch,
    location: preferences?.location,
    resultsCount: suggestionCount,
  });
  safeSet(KEYS.SEARCH_HISTORY, history.slice(0, 10)); // keep last 10 searches
}

/** Get all past searches */
export function getSearchHistory() {
  return safeGet(KEYS.SEARCH_HISTORY, []);
}

/** Export all stored data as a JSON string (for download/sharing) */
export function exportData() {
  const data = {};
  Object.entries(KEYS).forEach(([name, key]) => {
    const val = safeGet(key);
    if (val !== null) data[name] = val;
  });
  return JSON.stringify(data, null, 2);
}

/** Check if any session data exists */
export function hasStoredSession() {
  return safeGet(KEYS.EXAM_SCORES) !== null;
}
