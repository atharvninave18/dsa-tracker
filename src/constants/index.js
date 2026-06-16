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

/** Status badge colors aligned with tracker palette */
export const STATUS_COLORS = {
  Pending: { dot: '#6b7280', bg: 'rgba(107,114,128,0.12)', color: '#9ba3b8', darkBg: '#1e2535', darkColor: '#9ba3b8' },
  'In Progress': { dot: '#3b82f6', bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', darkBg: '#1e2535', darkColor: '#60a5fa' },
  Done: { dot: '#22c55e', bg: 'rgba(34,197,94,0.12)', color: '#22c55e', darkBg: '#1e2535', darkColor: '#4ade80' },
  'Revision Required': { dot: '#f59e0b', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', darkBg: '#1e2535', darkColor: '#fbbf24' },
};

export const DIFFICULTY_COLORS = {
  Easy: { dot: '#22c55e', bg: 'rgba(34,197,94,0.12)', color: '#22c55e', darkBg: '#1e2535', darkColor: '#4ade80' },
  Medium: { dot: '#f59e0b', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', darkBg: '#1e2535', darkColor: '#fbbf24' },
  Hard: { dot: '#ef4444', bg: 'rgba(239,68,68,0.1)', color: '#ef4444', darkBg: '#1e2535', darkColor: '#f87171' },
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
