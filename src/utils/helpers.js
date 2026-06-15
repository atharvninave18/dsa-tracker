import { format, parseISO, isBefore, startOfDay, subDays, eachDayOfInterval, isSameDay, getDay, addDays, isAfter } from 'date-fns';
import { DIFFICULTY_ORDER, STATUS_ORDER, STATUSES, DIFFICULTIES, PLATFORMS } from '../constants';

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy h:mm a');
  } catch {
    return dateStr;
  }
}

export function isOverdue(reviewDate) {
  if (!reviewDate) return false;
  try {
    return isBefore(parseISO(reviewDate), startOfDay(new Date()));
  } catch {
    return false;
  }
}

export function createEmptyQuestion(overrides = {}) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: '',
    link: '',
    status: 'Pending',
    reviewDate: '',
    notes: '',
    difficulty: 'Medium',
    tags: [],
    platform: 'LeetCode',
    group: '',
    groupType: 'topic',
    groupOrder: 9999,
    dateAdded: now,
    lastUpdated: now,
    isFavorite: false,
    priority: 0,
    solvedAt: null,
    ...overrides,
  };
}

/** Ensure question has all required fields (fixes legacy/imported data) */
export function normalizeQuestion(q) {
  if (!q || typeof q !== 'object') return null;

  const tags = Array.isArray(q.tags) ? q.tags : [];
  const base = createEmptyQuestion();

  return {
    ...base,
    ...q,
    id: q.id || crypto.randomUUID(),
    name: q.name || 'Untitled',
    link: q.link || '',
    notes: q.notes || '',
    tags,
    status: STATUSES.includes(q.status) ? q.status : 'Pending',
    difficulty: DIFFICULTIES.includes(q.difficulty) ? q.difficulty : 'Medium',
    platform: PLATFORMS.includes(q.platform) ? q.platform : 'LeetCode',
    group: q.group || tags[0] || 'Uncategorized',
    groupType: q.groupType === 'pattern' ? 'pattern' : 'topic',
    groupOrder: typeof q.groupOrder === 'number' ? q.groupOrder : 9999,
    isFavorite: Boolean(q.isFavorite),
    priority: typeof q.priority === 'number' ? q.priority : 0,
    reviewDate: q.reviewDate || '',
    solvedAt: q.solvedAt || null,
    dateAdded: q.dateAdded || base.dateAdded,
    lastUpdated: q.lastUpdated || base.lastUpdated,
  };
}

export function normalizeQuestions(questions) {
  if (!Array.isArray(questions)) return [];
  return questions.map(normalizeQuestion).filter(Boolean);
}

/** Parse spreadsheet category into group name and type */
export function parseCategoryInfo(category) {
  if (!category?.trim()) {
    return { group: 'Uncategorized', groupType: 'topic', tags: [] };
  }
  const isPattern = /pattern\s*:/i.test(category);
  const group = category
    .replace(/^\d+\.\s*/, '')
    .replace(/^pattern:\s*/i, '')
    .trim();
  const tags = parseTagsFromCategory(category);
  return {
    group: group || 'Uncategorized',
    groupType: isPattern ? 'pattern' : 'topic',
    tags,
  };
}

function parseTagsFromCategory(category) {
  if (!category) return [];
  let tag = category
    .replace(/^\d+\.\s*/, '')
    .replace(/^pattern:\s*/i, '')
    .trim();
  if (!tag) return [];
  const map = {
    graph: 'Graph',
    trees: 'Tree',
    tree: 'Tree',
    'dynamic programming': 'DP',
    dp: 'DP',
    'hash maps': 'Hash Map',
    'hash map': 'Hash Map',
    stack: 'Stack',
    'binary search': 'Binary Search',
    'two pointers': 'Two Pointers',
    'sliding window': 'Sliding Window',
    'linked list': 'Linked List',
    'merge intervals': 'Merge Intervals',
    'prefix sum': 'Prefix Sum',
    'fast & slow pointers': 'Fast & Slow Pointers',
    "kadane's algorithm": "Kadane's Algorithm",
    heap: 'Heap',
    bfs: 'BFS',
    dfs: 'DFS',
    recursion: 'Recursion',
  };
  return [map[tag.toLowerCase()] || tag];
}

/** Group questions into ordered topic/pattern sections */
export function groupQuestionsBySection(questions) {
  const sections = [];
  const sectionMap = new Map();

  questions.forEach((q, index) => {
    const group = q.group || q.tags?.[0] || 'Uncategorized';
    const groupType = q.groupType || 'topic';
    const groupOrder = q.groupOrder ?? index;
    const key = `${groupType}::${group}`;

    if (!sectionMap.has(key)) {
      const section = { key, group, groupType, groupOrder, questions: [] };
      sectionMap.set(key, section);
      sections.push(section);
    }
    sectionMap.get(key).questions.push(q);
  });

  sections.sort((a, b) => a.groupOrder - b.groupOrder || a.group.localeCompare(b.group));

  sections.forEach((s) => {
    s.done = s.questions.filter((q) => q.status === 'Done').length;
    s.total = s.questions.length;
  });

  return sections;
}

/** Recently solved questions */
export function getRecentlySolved(questions, limit = 5) {
  return questions
    .filter((q) => q.solvedAt)
    .sort((a, b) => b.solvedAt.localeCompare(a.solvedAt))
    .slice(0, limit);
}

/** Questions currently in progress */
export function getInProgressQuestions(questions, limit = 5) {
  return questions
    .filter((q) => q.status === 'In Progress')
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, limit);
}

/** Sections sorted by lowest completion first */
export function getWeakestSections(questions, limit = 6) {
  return groupQuestionsBySection(questions)
    .filter((s) => s.total > 0)
    .map((s) => ({ ...s, pct: Math.round((s.done / s.total) * 100) }))
    .sort((a, b) => a.pct - b.pct || b.total - a.total)
    .slice(0, limit);
}

/** Generate quick insight strings for the dashboard */
export function computeInsights(stats, streak, periodStats, sections) {
  const insights = [];

  if (stats.total === 0) {
    insights.push('Import your CSV to start tracking progress.');
    return insights;
  }

  if (stats.overdue > 0) {
    insights.push(`${stats.overdue} question${stats.overdue > 1 ? 's' : ''} overdue for revision.`);
  }

  if (streak.current > 0) {
    insights.push(`On a ${streak.current}-day solving streak — keep it going.`);
  } else if (periodStats.weekly === 0 && stats.pending > 0) {
    insights.push('No problems solved this week. Pick one to restart your streak.');
  }

  if (periodStats.weekly > 0) {
    insights.push(`Solved ${periodStats.weekly} this week, ${periodStats.monthly} this month.`);
  }

  const weakest = sections.find((s) => s.pct < 100 && s.total >= 2);
  if (weakest) {
    insights.push(`Focus on ${weakest.group} (${weakest.done}/${weakest.total} done).`);
  }

  if (stats.inProgress > 0) {
    insights.push(`${stats.inProgress} question${stats.inProgress > 1 ? 's' : ''} in progress — finish one today.`);
  }

  if (insights.length === 0 && stats.completionPct === 100) {
    insights.push('All questions completed. Great work!');
  }

  return insights.slice(0, 4);
}
export function filterQuestions(questions, { search, status, difficulty, platform, tags, favoritesOnly }) {
  const q = search.trim().toLowerCase();

  return questions.filter((item) => {
    const itemTags = Array.isArray(item.tags) ? item.tags : [];

    if (favoritesOnly && !item.isFavorite) return false;
    if (status.length && !status.includes(item.status)) return false;
    if (difficulty.length && !difficulty.includes(item.difficulty)) return false;
    if (platform.length && !platform.includes(item.platform)) return false;
    if (tags.length && !tags.some((t) => itemTags.includes(t))) return false;

    if (q) {
      const haystack = [item.name, item.notes, item.platform, ...itemTags]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

/** Sort questions by field */
export function sortQuestions(questions, sortBy, sortOrder) {
  const dir = sortOrder === 'asc' ? 1 : -1;

  return [...questions].sort((a, b) => {
    let cmp = 0;

    switch (sortBy) {
      case 'name':
        cmp = a.name.localeCompare(b.name);
        break;
      case 'difficulty':
        cmp = (DIFFICULTY_ORDER[a.difficulty] ?? 0) - (DIFFICULTY_ORDER[b.difficulty] ?? 0);
        break;
      case 'status':
        cmp = (STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0);
        break;
      case 'reviewDate':
        cmp = (a.reviewDate || '9999') > (b.reviewDate || '9999') ? 1 : -1;
        break;
      case 'dateAdded':
        cmp = a.dateAdded > b.dateAdded ? 1 : -1;
        break;
      case 'lastUpdated':
        cmp = a.lastUpdated > b.lastUpdated ? 1 : -1;
        break;
      case 'priority':
        cmp = (a.priority ?? 0) - (b.priority ?? 0);
        break;
    }

    return cmp * dir;
  });
}

/** Compute dashboard statistics */
export function computeStats(questions) {
  const total = questions.length;
  const done = questions.filter((q) => q.status === 'Done').length;
  const pending = questions.filter((q) => q.status === 'Pending').length;
  const inProgress = questions.filter((q) => q.status === 'In Progress').length;
  const revision = questions.filter((q) => q.status === 'Revision Required').length;
  const overdue = questions.filter((q) => isOverdue(q.reviewDate) && q.status !== 'Done').length;
  const favorites = questions.filter((q) => q.isFavorite).length;
  const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;

  return { total, done, pending, inProgress, revision, overdue, favorites, completionPct };
}

/** Calculate current streak of consecutive days with solved questions */
export function computeStreak(questions) {
  const solvedDates = questions
    .filter((q) => q.solvedAt)
    .map((q) => startOfDay(parseISO(q.solvedAt)).getTime());

  const uniqueDays = [...new Set(solvedDates)].sort((a, b) => b - a);
  if (uniqueDays.length === 0) return { current: 0, longest: 0 };

  let current = 0;
  const today = startOfDay(new Date()).getTime();
  const yesterday = subDays(new Date(), 1).getTime();

  if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
    current = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const expected = subDays(new Date(uniqueDays[i - 1]), 1).getTime();
      if (uniqueDays[i] === expected) current++;
      else break;
    }
  }

  let longest = 1;
  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const expected = subDays(new Date(uniqueDays[i - 1]), 1).getTime();
    if (uniqueDays[i] === expected) {
      streak++;
      longest = Math.max(longest, streak);
    } else {
      streak = 1;
    }
  }

  return { current, longest: Math.max(longest, current) };
}

/** Daily solved counts for the last N days */
export function computeDailySolved(questions, days = 30) {
  const end = new Date();
  const start = subDays(end, days - 1);
  const interval = eachDayOfInterval({ start, end });

  return interval.map((day) => {
    const count = questions.filter(
      (q) => q.solvedAt && isSameDay(parseISO(q.solvedAt), day)
    ).length;
    return {
      date: format(day, 'yyyy-MM-dd'),
      label: format(day, 'MMM d'),
      count,
    };
  });
}

/** Weekly and monthly solved counts */
export function computePeriodStats(questions) {
  const now = new Date();
  const weekStart = subDays(now, 7);
  const monthStart = subDays(now, 30);

  const weekly = questions.filter(
    (q) => q.solvedAt && parseISO(q.solvedAt) >= weekStart
  ).length;

  const monthly = questions.filter(
    (q) => q.solvedAt && parseISO(q.solvedAt) >= monthStart
  ).length;

  return { weekly, monthly };
}

/** Topic-wise progress breakdown */
export function computeTopicStats(questions) {
  const map = {};

  questions.forEach((q) => {
    (Array.isArray(q.tags) ? q.tags : []).forEach((tag) => {
      if (!map[tag]) map[tag] = { total: 0, done: 0 };
      map[tag].total++;
      if (q.status === 'Done') map[tag].done++;
    });
  });

  return Object.entries(map)
    .map(([tag, { total, done }]) => ({
      tag,
      total,
      done,
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

/** Status distribution for pie chart */
export function computeStatusDistribution(questions) {
  const counts = {};
  questions.forEach((q) => {
    counts[q.status] = (counts[q.status] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

/** Difficulty distribution */
export function computeDifficultyDistribution(questions) {
  const counts = {};
  questions.forEach((q) => {
    counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

/** Platform distribution */
export function computePlatformStats(questions) {
  const counts = {};
  questions.forEach((q) => {
    counts[q.platform] = (counts[q.platform] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

/** Generate revision queue — overdue + due today + revision required */
export function getRevisionQueue(questions) {
  const today = startOfDay(new Date());

  return questions
    .filter((q) => {
      if (q.status === 'Revision Required') return true;
      if (!q.reviewDate || q.status === 'Done') return false;
      try {
        const date = startOfDay(parseISO(q.reviewDate));
        return isBefore(date, today) || isSameDay(date, today);
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      const aOverdue = isOverdue(a.reviewDate);
      const bOverdue = isOverdue(b.reviewDate);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return (a.reviewDate || '') > (b.reviewDate || '') ? 1 : -1;
    });
}

/** Daily solved counts keyed by yyyy-MM-dd */
export function computeHeatmapData(questions) {
  const end = startOfDay(new Date());
  const start = subDays(end, 364);
  const interval = eachDayOfInterval({ start, end });

  return interval.map((day) => {
    const count = questions.filter(
      (q) => q.solvedAt && isSameDay(parseISO(q.solvedAt), day)
    ).length;
    return { date: format(day, 'yyyy-MM-dd'), count };
  });
}

/**
 * Build GitHub-style contribution grid: weeks as columns, Sun–Sat as rows.
 * Aligns to the Sunday on or before (today − 364 days).
 */
export function buildHeatmapGrid(questions) {
  const end = startOfDay(new Date());
  const rangeStart = subDays(end, 364);
  const gridStart = subDays(rangeStart, getDay(rangeStart)); // previous Sunday

  const countByDate = new Map();
  questions.forEach((q) => {
    if (!q.solvedAt) return;
    const key = format(startOfDay(parseISO(q.solvedAt)), 'yyyy-MM-dd');
    countByDate.set(key, (countByDate.get(key) || 0) + 1);
  });

  const weeks = [];
  const monthLabels = [];
  let cursor = gridStart;

  while (!isAfter(cursor, end)) {
    const week = [];
    let weekHasData = false;

    for (let dow = 0; dow < 7; dow++) {
      const day = addDays(cursor, dow);
      if (isBefore(day, rangeStart) || isAfter(day, end)) {
        week.push(null);
      } else {
        const dateKey = format(day, 'yyyy-MM-dd');
        const count = countByDate.get(dateKey) || 0;
        week.push({ date: dateKey, count });
        weekHasData = true;
      }
    }

    if (weekHasData || weeks.length === 0) {
      const labelDay = week.find((d) => d?.date);
      if (labelDay) {
        const d = parseISO(labelDay.date);
        const isFirstWeekOfMonth = week.some(
          (cell) => cell?.date && parseISO(cell.date).getDate() === 1
        );
        if (isFirstWeekOfMonth || weeks.length === 0) {
          monthLabels.push(format(d, 'MMM'));
        } else {
          monthLabels.push(null);
        }
      } else {
        monthLabels.push(null);
      }
      weeks.push(week);
    }

    cursor = addDays(cursor, 7);
  }

  const total = [...countByDate.values()].reduce((s, n) => s + n, 0);

  return { weeks, monthLabels, total, rangeStart, end };
}

/** Pick a random unsolved question */
export function pickRandomQuestion(questions, filters = {}) {
  const pool = filterQuestions(questions, {
    search: '',
    status: filters.status || [],
    difficulty: filters.difficulty || [],
    platform: filters.platform || [],
    tags: filters.tags || [],
    favoritesOnly: false,
  }).filter((q) => q.status !== 'Done');

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
