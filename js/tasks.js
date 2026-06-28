// ===== TASKS.JS =====
// All task CRUD operations (Create, Read, Update, Delete)

/**
 * In-memory tasks array. This is the single source of truth.
 * Synced to localStorage on every change.
 */
let tasks = [];

/**
 * Initialise tasks from localStorage on app start.
 */
function initTasks() {
  tasks = loadTasks();
}

/**
 * Create a new task object and add it to the array.
 * Uses Date.now() as unique ID — never uses DOM position.
 */
function createTask({ title, description, priority, column, dueDate, tags }) {
  const newTask = {
    id: Date.now(),
    title: title.trim(),
    description: description.trim(),
    priority,           // 'high' | 'medium' | 'low'
    column,             // 'todo' | 'inprogress' | 'done'
    dueDate,            // ISO string 'YYYY-MM-DD'
    tags,               // array of strings
    createdAt: Date.now()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

/**
 * Find a task by its unique ID.
 */
function getTaskById(id) {
  return tasks.find(t => t.id === id);
}

/**
 * Update an existing task. Merges the updates into the existing object.
 */
function updateTask(id, updates) {
  tasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
  saveTasks(tasks);
}

/**
 * Delete a task by ID.
 */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
}

/**
 * Move a task to a different column.
 * 'todo' → 'inprogress' → 'done' (and back)
 */
function moveTask(id, direction) {
  const columnOrder = ['todo', 'inprogress', 'done'];
  const task = getTaskById(id);
  if (!task) return;

  const currentIndex = columnOrder.indexOf(task.column);
  const newIndex = currentIndex + direction; // direction: +1 (right) or -1 (left)

  // Guard: don't move past boundaries
  if (newIndex < 0 || newIndex >= columnOrder.length) return;

  updateTask(id, { column: columnOrder[newIndex] });
}

/**
 * Get all tasks for a specific column.
 */
function getTasksByColumn(column) {
  return tasks.filter(t => t.column === column);
}

/**
 * Check if a task is overdue:
 * - Has a due date
 * - Due date is in the past
 * - Task is NOT in 'done' column
 */
function isOverdue(task) {
  if (!task.dueDate || task.column === 'done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate);
  return due < today;
}

/**
 * Calculate how many days until (or since) due date.
 * Returns null if no due date.
 */
function getDaysUntilDue(task) {
  if (!task.dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate);
  const diffMs = due - today;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format a due date string (YYYY-MM-DD) into readable format.
 * e.g. '2025-12-25' → 'Dec 25, 2025'
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  // Add T00:00:00 to avoid timezone shift
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
