# Kanban Task Manager

A fully-featured Kanban-style task management board built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no libraries. Tasks persist across page reloads using localStorage.

## Live Demo

> Deploy to GitHub Pages / Netlify / Vercel and paste link here.
> Example: https://your-name.github.io/task-manager-your-name

## Features

- **3-column board** — To Do, In Progress, Done
- **Task creation** with title, description, priority, due date, tags, and column selection
- **Inline form validation** — no popups, all errors shown below fields
- **Priority badges** — colour-coded High (red), Medium (yellow), Low (green)
- **Overdue detection** — red badge + red left border; runs on page load too
- **Due in X days countdown** on upcoming tasks
- **Edit tasks** — pre-filled modal with all existing data including tags
- **Delete tasks** — custom confirmation dialog (no browser `confirm()`)
- **Move tasks** — left/right arrow buttons on each card
- **Done treatment** — strikethrough title, greyed card, checkmark
- **Search** — filters across all 3 columns simultaneously
- **Priority filter** — All / High / Medium / Low buttons
- **Sort** — by Due Date, Priority, or Date Created
- **All three filters work together simultaneously**
- **Clear Filters** button resets all filters and sort
- **Statistics bar** — Total, In Progress, Completed, Overdue, Completion %
- **Real-time stats** — updates instantly on every change
- **LocalStorage persistence** — full board restored on page reload
- **Dark / Light mode** — toggle button in header; no flash on load
- **Responsive** — 3 columns on desktop, tab-based on tablet/mobile
- **Drag & Drop** — drag cards between columns (bonus)
- **Keyboard shortcuts** — N (new task), Esc (close modal), / (search)
- **Export to JSON** — downloads all tasks as a .json file

## Screenshots

> Add at least 3 screenshots here:
![Desktop](screenshots/desktop.jpg)
![Mobile](screenshots/Mobile.jpg)
![Model](screenshots/Model.jpg)

## Technologies Used

- HTML5
- CSS3 (CSS Variables, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Google Fonts (Inter, Space Grotesk)
- Font Awesome 6 (icons)
- HTML5 Drag and Drop API
- localStorage API

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-manager-your-name.git
   ```
2. Navigate to the project folder:
   ```bash
   cd task-manager-your-name
   ```
3. Open `index.html` in any modern browser — no build step needed.
4. Or use VS Code Live Server for the best experience.

## Task Data Structure

```javascript
// Array of task objects stored in localStorage under key 'kanban_tasks'
const tasks = [
  {
    id: 1703001234567,        // Date.now() at creation time — unique ID
    title: 'Build the login page',
    description: 'Create a responsive login form with validation',
    priority: 'high',         // 'high' | 'medium' | 'low'
    column: 'inprogress',     // 'todo' | 'inprogress' | 'done'
    dueDate: '2025-12-25',    // ISO date string YYYY-MM-DD
    tags: ['HTML', 'CSS', 'JS'],
    createdAt: 1703001234567  // Date.now() at creation time
  }
];

// Save:  localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
// Load:  JSON.parse(localStorage.getItem('kanban_tasks')) || [];
```

## What I Learned

Building this project taught me how important it is to separate concerns clearly — keeping data logic, rendering, filters, and UI interactions in different files made the codebase much easier to debug and extend. The trickiest parts were making all three filters (search + priority + sort) work together simultaneously without bugs, and ensuring the overdue check runs correctly both on page load and after every task move. Managing the `currentTags` array in the modal separately from the tasks array, and syncing them correctly on edit vs add, was also a good challenge. I also learned how to implement HTML5 Drag and Drop from scratch without any library.

## Video Walkthrough

> Upload a 3–5 minute screen recording to YouTube (unlisted) or Google Drive and paste the link here.
> Link: https://youtube.com/your-video-link
