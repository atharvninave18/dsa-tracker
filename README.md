# DSA Tracker

A modern, responsive web app to track your Data Structures & Algorithms practice progress. No authentication required — all data is stored in your browser's LocalStorage.

## Features

- **Question Management** — Add, edit, delete DSA questions with inline editing
- **Rich Metadata** — Status, difficulty, platform, tags, review dates, markdown notes
- **Progress Dashboard** — Stats, charts, streak tracker, activity heatmap
- **Smart Filtering** — Search, filter by status/difficulty/platform/tags, sort options
- **Bulk Actions** — Mark done, delete, set review dates for multiple questions
- **Revision System** — Overdue highlighting, revision queue
- **Import/Export** — JSON backup and CSV export/import
- **Dark/Light Mode** — Persisted theme preference
- **PWA Support** — Works offline after first load
- **Bonus Tools** — Pomodoro timer, goal tracking, random question picker, drag-and-drop prioritization

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Quick add question |
| `Ctrl/Cmd + K` | Focus search |
| `Ctrl/Cmd + D` | Toggle dark/light mode |
| `D` | Mark selected as Done |
| `Escape` | Clear selection |

## Tech Stack

- React 19 + Vite
- Material UI 9
- Recharts
- Context API for state management
- LocalStorage persistence

## Data Storage

All data is stored locally in your browser. Use **Import/Export** to back up your progress as JSON or CSV.
