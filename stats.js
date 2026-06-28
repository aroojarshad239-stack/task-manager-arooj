// ===== STATS.JS =====
// All statistics bar update logic
// Called after every add, edit, move, or delete operation

/**
 * Update all 5 statistics in the stats bar.
 * Reads from the global `tasks` array (from tasks.js).
 * Also updates column count badges.
 * Also updates filtered column counts if filters are active.
 */
function updateStats(filteredByColumn) {
  const total = tasks.length;
  const inProgress = tasks.filter(t => t.column === 'inprogress').length;
  const done = tasks.filter(t => t.column === 'done').length;
  const overdueCount = tasks.filter(t => isOverdue(t)).length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  // Update stat values with pulse animation
  setStatValue('statTotal', total);
  setStatValue('statInProgress', inProgress);
  setStatValue('statDone', done);
  setStatValue('statOverdue', overdueCount);
  setStatValue('statPercent', percent + '%');

  // Overdue count shown in red only if > 0
  const overdueEl = document.getElementById('statOverdue');
  if (overdueEl) {
    overdueEl.style.color = overdueCount > 0 ? 'var(--danger)' : '';
  }

  // Progress bar fill width
  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    progressFill.style.width = percent + '%';
  }

  // Update column count badges (shows filtered count if filters active, else total)
  const columns = ['todo', 'inprogress', 'done'];
  columns.forEach(col => {
    const badge = document.getElementById('count-' + col);
    if (!badge) return;

    if (filteredByColumn && filteredByColumn[col] !== undefined) {
      // Show filtered count when filters are active
      badge.textContent = filteredByColumn[col];
    } else {
      // Show total count per column
      badge.textContent = tasks.filter(t => t.column === col).length;
    }
  });
}

/**
 * Set a stat value element with a pulse animation on change.
 */
function setStatValue(id, newValue) {
  const el = document.getElementById(id);
  if (!el) return;
  const strVal = String(newValue);
  if (el.textContent !== strVal) {
    el.textContent = strVal;
    // Trigger pulse animation
    el.classList.remove('updated');
    void el.offsetWidth; // force reflow to restart animation
    el.classList.add('updated');
    setTimeout(() => el.classList.remove('updated'), 400);
  }
}
