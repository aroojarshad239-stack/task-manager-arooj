// ===== APP.JS =====
// Main entry point — initialises app and wires up all event listeners

/**
 * Initialise the entire application.
 * Called once on DOMContentLoaded.
 */
function initApp() {
  // 1. Apply saved theme BEFORE rendering to avoid flash of wrong theme
  applyThemeOnLoad();

  // 2. Load tasks from localStorage
  initTasks();

  // 3. Set up column tabs for mobile
  initTabs();

  // 4. Render the board with all tasks
  renderBoard();

  // 5. Wire up all event listeners
  bindEvents();
}

/**
 * Bind all event listeners.
 * Kept in one place for clarity — no loose event listeners in global scope.
 */
function bindEvents() {
  // ── HEADER ──────────────────────────────────────────
  // Dark/Light mode toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Global "Add Task" button
  document.getElementById('globalAddBtn').addEventListener('click', () => openAddModal());

  // ── MODAL ───────────────────────────────────────────
  // Close modal via X button
  document.getElementById('modalClose').addEventListener('click', () => closeModal('modalOverlay'));

  // Close modal via Cancel button
  document.getElementById('modalCancel').addEventListener('click', () => closeModal('modalOverlay'));

  // Save task (add or edit)
  document.getElementById('modalSave').addEventListener('click', handleModalSave);

  // Close modal when clicking the backdrop (outside the modal box)
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) {
      closeModal('modalOverlay');
    }
  });

  // ── CONFIRM DIALOG ──────────────────────────────────
  document.getElementById('confirmCancel').addEventListener('click', () => closeModal('confirmOverlay'));
  document.getElementById('confirmDelete').addEventListener('click', confirmDeleteTask);

  // ── TAGS INPUT ──────────────────────────────────────
  // Add tag when user presses Enter in the tag input field
  document.getElementById('tagInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(document.getElementById('tagInput').value);
      document.getElementById('tagInput').value = '';
    }
  });

  // Also add tag on comma key for convenience
  document.getElementById('tagInput').addEventListener('keyup', (e) => {
    if (e.key === ',') {
      const val = document.getElementById('tagInput').value.replace(',', '');
      addTag(val);
      document.getElementById('tagInput').value = '';
    }
  });

  // ── SEARCH ──────────────────────────────────────────
  document.getElementById('searchInput').addEventListener('input', (e) => {
    setSearchFilter(e.target.value);
    renderBoard();
  });

  // ── PRIORITY FILTER BUTTONS ─────────────────────────
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setPriorityFilter(btn.dataset.priority);
      renderBoard();
    });
  });

  // ── SORT ────────────────────────────────────────────
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    setSortFilter(e.target.value);
    renderBoard();
  });

  // ── CLEAR FILTERS ───────────────────────────────────
  document.getElementById('clearFilters').addEventListener('click', () => {
    clearAllFilters();
    renderBoard();
  });

  // ── COLUMN TABS (mobile/tablet) ──────────────────────
  document.querySelectorAll('.col-tab').forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.col));
  });

  // ── KEYBOARD SHORTCUTS ──────────────────────────────
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Keyboard shortcuts:
 * N   → Open new task modal
 * Esc → Close any open modal
 * /   → Focus search bar
 */
function handleKeyboardShortcuts(e) {
  // Don't trigger shortcuts when user is typing in an input
  const activeTag = document.activeElement.tagName;
  const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag);

  if (e.key === 'Escape') {
    closeModal('modalOverlay');
    closeModal('confirmOverlay');
    return;
  }

  if (isTyping) return; // Stop here if user is typing

  if (e.key === 'n' || e.key === 'N') {
    e.preventDefault();
    openAddModal();
  }

  if (e.key === '/') {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  }
}

// ─── BOOT ────────────────────────────────────────────────────────
// Start the app once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
