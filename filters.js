// ===== FILTERS.JS =====
// Search, priority filter, and sort logic
// All three work simultaneously

/** Active filter state */
let activeFilters = {
  search: '',
  priority: 'all',
  sort: 'createdAt'
};

/**
 * Apply all active filters and sort to a given tasks array.
 * Returns a new filtered+sorted array (does NOT mutate original).
 */
function applyFilters(taskArray) {
  let result = [...taskArray];

  // 1. Search filter — checks title, description, and tags
  if (activeFilters.search.trim()) {
    const query = activeFilters.search.toLowerCase().trim();
    result = result.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // 2. Priority filter
  if (activeFilters.priority !== 'all') {
    result = result.filter(t => t.priority === activeFilters.priority);
  }

  // 3. Sort
  result = sortTasks(result, activeFilters.sort);

  return result;
}

/**
 * Sort tasks array by the given criteria.
 * Mutates a copy — never mutates the original array.
 */
function sortTasks(taskArray, sortBy) {
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  return [...taskArray].sort((a, b) => {
    if (sortBy === 'dueDate') {
      // Tasks without due date go to end
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Default: sort by createdAt descending (newest first)
    return b.createdAt - a.createdAt;
  });
}

/**
 * Update the search query in active filters.
 */
function setSearchFilter(query) {
  activeFilters.search = query;
}

/**
 * Update the priority filter.
 */
function setPriorityFilter(priority) {
  activeFilters.priority = priority;
}

/**
 * Update the sort option.
 */
function setSortFilter(sortBy) {
  activeFilters.sort = sortBy;
}

/**
 * Reset all filters and sort back to defaults.
 */
function clearAllFilters() {
  activeFilters = { search: '', priority: 'all', sort: 'createdAt' };

  // Reset UI elements
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = 'createdAt';

  // Reset priority filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.priority === 'all');
  });
}

/**
 * Get the current active filters (used by board for re-render).
 */
function getActiveFilters() {
  return { ...activeFilters };
}
