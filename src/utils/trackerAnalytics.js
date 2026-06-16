import {
  format,
  parseISO,
  isBefore,
  startOfDay,
  subDays,
  eachDayOfInterval,
  isSameDay,
  addDays,
} from 'date-fns';
import { QUESTIONS } from '../data/seedQuestions';

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

/** Flatten Localbase topics into a list for analytics */
export function flattenArchive(topics) {
  if (!topics?.length) {
    return QUESTIONS.map((q) => ({
      ...q,
      topic: q.topic,
      topicName: q.topic,
      name: q.q,
      link: q.links?.[0] || '',
      status: 'pending',
      review: false,
      notes: '',
      solvedAt: null,
      nextReviewDate: null,
      reviewLevel: 0,
    }));
  }

  return topics.flatMap((topic) =>
    topic.questions.map((q) => ({
      ...q,
      topic: topic.topicName,
      topicName: topic.topicName,
      name: q.q,
      link: q.links?.[0] || '',
      links: q.links || [],
      difficulty: 'Medium',
    }))
  );
}

export function computeTrackerStats(flat) {
  const total = flat.length;
  const done = flat.filter((q) => q.status === 'done').length;
  const revise = flat.filter((q) => q.status === 'revise').length;
  const pending = flat.filter((q) => q.status === 'pending').length;
  const flagged = flat.filter((q) => q.review).length;
  const overdue = flat.filter((q) => isReviewDue(q) && q.status !== 'pending').length;
  const completionPct = total > 0 ? Math.round(((done + revise) / total) * 100) : 0;

  return { total, done, revise, pending, inProgress: revise, revision: revise, flagged, overdue, favorites: flagged, completionPct };
}

export function isReviewDue(q) {
  if (q.status === 'revise') return true;
  if (q.review && q.status !== 'pending') return true;
  if (!q.nextReviewDate) return false;
  try {
    const due = startOfDay(parseISO(q.nextReviewDate));
    return isBefore(due, startOfDay(new Date())) || isSameDay(due, new Date());
  } catch {
    return false;
  }
}

export function getTrackerRevisionQueue(flat) {
  return flat
    .filter((q) => isReviewDue(q) || q.review)
    .sort((a, b) => {
      const aRevise = a.status === 'revise' ? 1 : 0;
      const bRevise = b.status === 'revise' ? 1 : 0;
      if (aRevise !== bRevise) return bRevise - aRevise;
      return (a.nextReviewDate || '') > (b.nextReviewDate || '') ? 1 : -1;
    });
}

export function computeTrackerStreak(flat) {
  const solvedDates = flat
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

export function computeTrackerDailySolved(flat, days = 30) {
  const end = new Date();
  const start = subDays(end, days - 1);
  const interval = eachDayOfInterval({ start, end });

  return interval.map((day) => {
    const count = flat.filter((q) => q.solvedAt && isSameDay(parseISO(q.solvedAt), day)).length;
    return { date: format(day, 'yyyy-MM-dd'), label: format(day, 'MMM d'), count };
  });
}

export function computeTrackerPeriodStats(flat) {
  const now = new Date();
  const weekStart = subDays(now, 7);
  const monthStart = subDays(now, 30);

  const weekly = flat.filter((q) => q.solvedAt && parseISO(q.solvedAt) >= weekStart).length;
  const monthly = flat.filter((q) => q.solvedAt && parseISO(q.solvedAt) >= monthStart).length;

  return { weekly, monthly };
}

export function computeTrackerTopicSections(topics) {
  return topics.map((t) => ({
    key: t.topicName,
    group: t.topicName,
    groupType: 'topic',
    total: t.questions.length,
    done: t.doneQuestions,
    pct: t.questions.length ? Math.round((t.doneQuestions / t.questions.length) * 100) : 0,
  }));
}

export function getWeakestTrackerTopics(topics, limit = 5) {
  return computeTrackerTopicSections(topics)
    .filter((s) => s.total > 0 && s.pct < 100)
    .sort((a, b) => a.pct - b.pct || b.total - a.total)
    .slice(0, limit);
}

export function computeTrackerStatusDistribution(flat) {
  const counts = { Pending: 0, Done: 0, 'Done + Revise': 0, Flagged: 0 };
  flat.forEach((q) => {
    if (q.status === 'pending') counts.Pending++;
    else if (q.status === 'done') counts.Done++;
    else if (q.status === 'revise') counts['Done + Revise']++;
    if (q.review) counts.Flagged++;
  });
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
}

export function computeTrackerPlatformStats(flat) {
  const counts = { LeetCode: 0, GFG: 0, Other: 0 };
  flat.forEach((q) => {
    const links = q.links || [];
    if (links.some((l) => l.includes('leetcode.com'))) counts.LeetCode++;
    else if (links.some((l) => l.includes('geeksforgeeks.org'))) counts.GFG++;
    else counts.Other++;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function getRecentlySolved(flat, limit = 5) {
  return flat
    .filter((q) => q.solvedAt)
    .sort((a, b) => (b.solvedAt > a.solvedAt ? 1 : -1))
    .slice(0, limit);
}

export function pickRandomTrackerQuestion(flat, { topic = null, status = 'pending' } = {}) {
  let pool = flat;
  if (topic) pool = pool.filter((q) => q.topic === topic);
  if (status) pool = pool.filter((q) => q.status === status);
  if (!pool.length) pool = flat.filter((q) => q.status === 'pending');
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function computeTrackerInsights(stats, streak, periodStats, sections) {
  const insights = [];
  if (stats.completionPct >= 50) insights.push({ type: 'success', text: `${stats.completionPct}% of the sheet complete — great momentum.` });
  else if (stats.total > 0) insights.push({ type: 'info', text: `${stats.total - stats.done - stats.revise} problems left on the sheet.` });

  if (streak.current >= 3) insights.push({ type: 'success', text: `${streak.current}-day solve streak — keep it up!` });
  if (stats.overdue > 0) insights.push({ type: 'warning', text: `${stats.overdue} problem(s) due for review.` });
  if (periodStats.weekly === 0) insights.push({ type: 'info', text: 'No solves this week — start with a quick warm-up.' });
  else insights.push({ type: 'info', text: `${periodStats.weekly} solved in the last 7 days.` });

  const weakest = sections[0];
  if (weakest && weakest.pct < 40) {
    insights.push({ type: 'warning', text: `"${weakest.group}" is at ${weakest.pct}% — good focus area.` });
  }
  return insights.slice(0, 4);
}

export function scheduleNextReview(reviewLevel = 0) {
  const days = REVIEW_INTERVALS[Math.min(reviewLevel, REVIEW_INTERVALS.length - 1)];
  return format(addDays(new Date(), days), 'yyyy-MM-dd');
}

export function enrichQuestionPatch(current, patch) {
  const next = { ...current, ...patch };
  const now = new Date().toISOString();

  if (patch.status && patch.status !== current.status) {
    if (patch.status === 'done') {
      next.solvedAt = now;
      next.reviewLevel = current.reviewLevel || 0;
      next.nextReviewDate = next.review ? scheduleNextReview(0) : null;
    } else if (patch.status === 'revise') {
      next.solvedAt = current.solvedAt || now;
      next.nextReviewDate = format(new Date(), 'yyyy-MM-dd');
    } else if (patch.status === 'pending') {
      next.solvedAt = null;
      next.nextReviewDate = null;
      next.reviewLevel = 0;
    }
  }

  if (patch.review === true && next.status !== 'pending' && !next.nextReviewDate) {
    next.nextReviewDate = scheduleNextReview(next.reviewLevel || 0);
  }

  return next;
}
