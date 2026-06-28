// ===== BOARD.JS =====
// Renders the three columns and all task cards
// Called after any data change or filter change

const COLUMNS = ['todo', 'inprogress', 'done'];

/**
 * Main render function.
 * Applies filters, renders each column, updates stats.
 */
function renderBoard() {
  const filteredByColumn = {};

  COLUMNS.forEach(col => {
    const colTasks = tasks.filter(t => t.column === col);
    const filtered = applyFilters(colTasks);
    filteredByColumn[col] = filtered.length;
    renderColumn(col, filtered);
  });

  updateStats(filteredByColumn);
  setupDragDrop();
}

/**
 * Render all cards inside a single column container.
 * Shows empty state if no tasks match.
 */
function renderColumn(column, filteredTasks) {
  const container = document.getElementById('cards-' + column);
  if (!container) return;

  container.innerHTML = '';

  if (filteredTasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-clipboard"></i>
        <p>No tasks here yet</p>
      </div>`;
    return;
  }

  filteredTasks.forEach(task => {
    const card = buildCard(task);
    container.appendChild(card);
  });
}

/**
 * Build a single task card DOM element.
 * Returns the card element (does not append it).
 */
function buildCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.dataset.id = task.id;
  card.draggable = true;

  const overdue = isOverdue(task);
  const isDone = task.column === 'done';

  if (overdue) card.classList.add('overdue');
  if (isDone) card.classList.add('done-card');

  // Description preview — max 60 chars
  const descPreview = task.description
    ? (task.description.length > 60 ? task.description.slice(0, 60) + '...' : task.description)
    : '';

  // Tags HTML
  const tagsHtml = task.tags.length > 0
    ? `<div class="card-tags">${task.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}</div>`
    : '';

  // Overdue or done badge
  let statusHtml = '';
  if (isDone) {
    statusHtml = `<span class="done-check"><i class="fa-solid fa-check"></i> Done</span>`;
  } else if (overdue) {
    statusHtml = `<span class="overdue-badge">Overdue</span>`;
  } else {
    // Countdown label for upcoming tasks
    const days = getDaysUntilDue(task);
    if (days !== null && days >= 0 && days <= 7) {
      const label = days === 0 ? 'Due today!' : `Due in ${days} day${days === 1 ? '' : 's'}`;
      statusHtml = `<span class="countdown-label"><i class="fa-regular fa-clock"></i> ${label}</span>`;
    }
  }

  // Move buttons — hidden if at boundaries
  const leftHidden = task.column === 'todo' ? 'style="visibility:hidden"' : '';
  const rightHidden = task.column === 'done' ? 'style="visibility:hidden"' : '';

  card.innerHTML = `
    <div class="card-top">
      <span class="card-title${isDone ? ' strikethrough' : ''}">${escapeHtml(task.title)}</span>
      <span class="priority-badge ${task.priority}">${task.priority}</span>
    </div>
    ${descPreview ? `<p class="card-desc">${escapeHtml(descPreview)}</p>` : ''}
    ${tagsHtml}
    <div class="card-footer">
      <div class="card-meta">
        ${task.dueDate ? `<span class="card-date"><i class="fa-regular fa-calendar"></i> ${formatDate(task.dueDate)}</span>` : ''}
        ${statusHtml}
      </div>
      <div class="card-actions">
        <button class="card-btn move" ${leftHidden} data-action="left" data-id="${task.id}" title="Move Left">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <button class="card-btn move" ${rightHidden} data-action="right" data-id="${task.id}" title="Move Right">
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        <button class="card-btn edit" data-action="edit" data-id="${task.id}" title="Edit Task">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="card-btn delete" data-action="delete" data-id="${task.id}" title="Delete Task">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `;

  // Card-level click delegation
  card.addEventListener('click', handleCardAction);

  return card;
}

/**
 * Handle all card button clicks via event delegation.
 */
function handleCardAction(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;

  if (action === 'left') {
    moveTask(id, -1);
    renderBoard();
  } else if (action === 'right') {
    moveTask(id, +1);
    renderBoard();
  } else if (action === 'edit') {
    openEditModal(id);
  } else if (action === 'delete') {
    openConfirmDialog(id);
  }
}

/**
 * Escape HTML to prevent XSS when inserting user content.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * Setup HTML5 Drag and Drop on cards and columns.
 * Bonus feature: drag cards between columns and reorder within column.
 */
function setupDragDrop() {
  let draggedId = null;

  // Drag start on cards
  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedId = Number(card.dataset.id);
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
    });
  });

  // Drop zones: columns
  document.querySelectorAll('.column').forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', () => {
      col.classList.remove('drag-over');
    });
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      if (draggedId === null) return;
      const newColumn = col.dataset.column;
      updateTask(draggedId, { column: newColumn });
      draggedId = null;
      renderBoard();
    });
  });
}
