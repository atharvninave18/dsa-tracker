export const STATUSES = ['Pending', 'In Progress', 'Done', 'Revision Required'];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const PLATFORMS = ['LeetCode', 'Codeforces', 'GFG', 'HackerRank', 'Custom'];

export const TAGS = [
  'Array', 'Two Pointers', 'Fast & Slow Pointers', 'Sliding Window',
  "Kadane's Algorithm", 'Prefix Sum', 'Merge Intervals', 'Linked List',
  'Stack', 'Hash Map', 'Binary Search', 'Heap', 'Tree', 'Graph', 'DP',
  'Backtracking', 'Greedy', 'Trie', 'Bit Manipulation', 'Math', 'Sorting',
  'Recursion', 'BFS', 'DFS', 'String', 'Union Find', 'Topological Sort', 'Dijkstra',
];

/** Muted, professional badge colors */
export const STATUS_COLORS = {
  Pending: { dot: '#a1a1aa', bg: '#f4f4f5', color: '#52525b', darkBg: '#27272a', darkColor: '#d4d4d8' },
  'In Progress': { dot: '#2563eb', bg: '#eff6ff', color: '#1d4ed8', darkBg: '#1e3a5f', darkColor: '#93c5fd' },
  Done: { dot: '#16a34a', bg: '#f0fdf4', color: '#15803d', darkBg: '#14532d', darkColor: '#86efac' },
  'Revision Required': { dot: '#dc2626', bg: '#fef2f2', color: '#b91c1c', darkBg: '#450a0a', darkColor: '#fca5a5' },
};

export const DIFFICULTY_COLORS = {
  Easy: { dot: '#16a34a', bg: '#f0fdf4', color: '#15803d', darkBg: '#14532d', darkColor: '#86efac' },
  Medium: { dot: '#d97706', bg: '#fffbeb', color: '#b45309', darkBg: '#451a03', darkColor: '#fcd34d' },
  Hard: { dot: '#dc2626', bg: '#fef2f2', color: '#b91c1c', darkBg: '#450a0a', darkColor: '#fca5a5' },
};

export const STORAGE_KEYS = {
  QUESTIONS: 'dsa-tracker-questions',
  SETTINGS: 'dsa-tracker-settings',
  GOALS: 'dsa-tracker-goals',
  THEME: 'dsa-tracker-theme',
  POMODORO: 'dsa-tracker-pomodoro',
};

export const DEFAULT_SETTINGS = {
  pageSize: 25,
  defaultSort: 'dateAdded',
  defaultSortOrder: 'desc',
  showFavoritesOnly: false,
};

export const DEFAULT_GOAL = { target: 300, platform: 'LeetCode' };

export const SORT_OPTIONS = [
  { value: 'reviewDate', label: 'Review Date' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'dateAdded', label: 'Date Added' },
  { value: 'status', label: 'Status' },
  { value: 'name', label: 'Name' },
  { value: 'lastUpdated', label: 'Last Updated' },
  { value: 'priority', label: 'Priority' },
];

export const DIFFICULTY_ORDER = { Easy: 0, Medium: 1, Hard: 2 };
export const STATUS_ORDER = { Pending: 0, 'In Progress': 1, 'Revision Required': 2, Done: 3 };

export const POMODORO_DEFAULTS = {
  workMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
};
