// ===== STORAGE.JS =====
// All localStorage read/write logic lives here

const STORAGE_KEY = 'kanban_tasks';
const THEME_KEY = 'kanban_theme';

/**
 * Load all tasks from localStorage.
 * Returns empty array if nothing saved yet.
 */
function loadTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/**
 * Save the full tasks array to localStorage.
 * Always stringifies the array — never stores raw HTML.
 */
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Load saved theme preference ('dark' or 'light').
 * Defaults to 'light' if nothing saved.
 */
function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

/**
 * Save theme preference to localStorage.
 */
function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
