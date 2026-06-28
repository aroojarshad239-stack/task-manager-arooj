// ===== UI.JS =====
// Modal management, dark mode toggle, confirm dialog, tags input

/** Currently editing tags list in the modal */
let currentTags = [];

/** ID of the task pending deletion (used by confirm dialog) */
let pendingDeleteId = null;

// ─── MODAL OPEN / CLOSE ───────────────────────────────────────────

/**
 * Open the task modal in "Add" mode.
 * Optionally pre-selects a column (for per-column add buttons).
 */
function openAddModal(column = 'todo') {
  document.getElementById('modalTitle').textContent = 'Add New Task';
  document.getElementById('modalSave').textContent = 'Add Task';
  document.getElementById('taskId').value = '';
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskPriority').value = 'medium';
  document.getElementById('taskDueDate').value = '';
  document.getElementById('taskColumn').value = column;
  clearTagsUI();
  clearFormErrors();
  setMinDueDate();
  showModal('modalOverlay');
  document.getElementById('taskTitle').focus();
}

/**
 * Open the task modal in "Edit" mode, pre-filling all fields.
 */
function openEditModal(id) {
  const task = getTaskById(id);
  if (!task) return;

  document.getElementById('modalTitle').textContent = 'Edit Task';
  document.getElementById('modalSave').textContent = 'Save Changes';
  document.getElementById('taskId').value = task.id;
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDesc').value = task.description;
  document.getElementById('taskPriority').value = task.priority;
  document.getElementById('taskDueDate').value = task.dueDate;
  document.getElementById('taskColumn').value = task.column;

  // Pre-fill tags
  currentTags = [...task.tags];
  renderTagsUI();
  clearFormErrors();
  setMinDueDate();
  showModal('modalOverlay');
  document.getElementById('taskTitle').focus();
}

/** Show a modal overlay by ID */
function showModal(overlayId) {
  document.getElementById(overlayId).classList.add('open');
}

/** Hide a modal overlay by ID */
function closeModal(overlayId) {
  document.getElementById(overlayId).classList.remove('open');
}

// ─── FORM VALIDATION ──────────────────────────────────────────────

/**
 * Validate the task form.
 * Returns true if valid, false if errors found.
 * Shows inline error messages below invalid fields.
 */
function validateForm() {
  let valid = true;
  clearFormErrors();

  const title = document.getElementById('taskTitle').value.trim();
  if (title.length < 3) {
    showError('titleError', 'Title must be at least 3 characters.');
    valid = false;
  }

  const dueDate = document.getElementById('taskDueDate').value;
  if (!dueDate) {
    showError('dueDateError', 'Please pick a due date.');
    valid = false;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(dueDate + 'T00:00:00') < today) {
      showError('dueDateError', 'Due date cannot be in the past.');
      valid = false;
    }
  }

  return valid;
}

/** Show an inline error message */
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

/** Clear all inline error messages */
function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
}

/**
 * Set the minimum date on the due date input to today.
 * Prevents users from picking past dates.
 */
function setMinDueDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('taskDueDate').min = today;
}

// ─── FORM SAVE ────────────────────────────────────────────────────

/**
 * Handle the Save / Add Task button click in the modal.
 * Validates, then creates or updates the task.
 */
function handleModalSave() {
  if (!validateForm()) return;

  const idVal = document.getElementById('taskId').value;
  const taskData = {
    title: document.getElementById('taskTitle').value.trim(),
    description: document.getElementById('taskDesc').value.trim(),
    priority: document.getElementById('taskPriority').value,
    dueDate: document.getElementById('taskDueDate').value,
    column: document.getElementById('taskColumn').value,
    tags: [...currentTags]
  };

  if (idVal) {
    // Edit existing task
    updateTask(Number(idVal), taskData);
  } else {
    // Create new task
    createTask(taskData);
  }

  closeModal('modalOverlay');
  renderBoard();
}

// ─── CONFIRM DELETE DIALOG ───────────────────────────────────────

/**
 * Show the custom confirmation dialog before deleting a task.
 * Does NOT use browser confirm() — custom UI only.
 */
function openConfirmDialog(id) {
  const task = getTaskById(id);
  if (!task) return;
  pendingDeleteId = id;
  document.getElementById('confirmTaskName').textContent = task.title;
  showModal('confirmOverlay');
}

/**
 * Confirm and execute the deletion.
 */
function confirmDeleteTask() {
  if (pendingDeleteId === null) return;
  deleteTask(pendingDeleteId);
  pendingDeleteId = null;
  closeModal('confirmOverlay');
  renderBoard();
}

// ─── TAGS INPUT ───────────────────────────────────────────────────

/**
 * Add a new tag to currentTags if not already present.
 * Renders the updated tags UI.
 */
function addTag(value) {
  const tag = value.trim();
  if (!tag || currentTags.includes(tag)) return;
  currentTags.push(tag);
  renderTagsUI();
}

/**
 * Remove a tag by its value.
 */
function removeTag(value) {
  currentTags = currentTags.filter(t => t !== value);
  renderTagsUI();
}

/**
 * Render tag pills inside the tags input area.
 */
function renderTagsUI() {
  const pillsContainer = document.getElementById('tagsPills');
  if (!pillsContainer) return;

  pillsContainer.innerHTML = currentTags.map(tag => `
    <span class="tag-pill-input">
      ${escapeHtml(tag)}
      <button class="tag-remove" data-tag="${escapeHtml(tag)}" type="button">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </span>
  `).join('');

  // Attach remove handlers
  pillsContainer.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', () => removeTag(btn.dataset.tag));
  });
}

/** Reset tags state and UI */
function clearTagsUI() {
  currentTags = [];
  const pillsContainer = document.getElementById('tagsPills');
  if (pillsContainer) pillsContainer.innerHTML = '';
}

// ─── DARK MODE ────────────────────────────────────────────────────

/**
 * Apply the saved theme immediately on page load (no flash).
 */
function applyThemeOnLoad() {
  const theme = loadTheme();
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

/**
 * Toggle between dark and light mode.
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  saveTheme(next);
  updateThemeIcon(next);
}

/**
 * Update the theme toggle icon to match the current theme.
 */
function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// ─── COLUMN TABS (Mobile/Tablet) ─────────────────────────────────

/**
 * Activate a specific column tab and show only that column.
 * Used on tablet/mobile viewports.
 */
function activateTab(colName) {
  document.querySelectorAll('.col-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.col === colName);
  });
  document.querySelectorAll('.column').forEach(col => {
    col.classList.toggle('active-col', col.dataset.column === colName);
  });
}

/**
 * Initialise column tabs to show 'todo' on mobile by default.
 * On desktop, all columns are shown via CSS (grid layout).
 */
function initTabs() {
  activateTab('todo');
}
