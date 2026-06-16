import { QUESTIONS, TOPICS, PROGRESS_STORAGE_KEY } from '../data/seedQuestions';
import { countDoneQuestions, isTopicStarted, topicKey } from './helpers';

function defaultQuestionState(seed) {
  return {
    id: seed.id,
    q: seed.q,
    links: seed.links,
    status: 'pending',
    review: false,
    notes: '',
    solvedAt: null,
    nextReviewDate: null,
    reviewLevel: 0,
  };
}

/** Load legacy flat progress map from localStorage (pre-Localbase) */
export function loadLegacyProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Build topic documents from seed, optionally merging existing archive rows */
export function buildSeedArchive(existingTopics = []) {
  const existingByKey = Object.fromEntries(
    existingTopics.map((t) => [topicKey(t.topicName), t])
  );

  return TOPICS.map((topicName, position) => {
    const existing = existingByKey[topicKey(topicName)];
    const existingQuestions = existing?.questions || [];

    const questions = QUESTIONS.filter((q) => q.topic === topicName).map((seed, index) => {
      const base = defaultQuestionState(seed);
      const old = existingQuestions[index];
      if (!old) return base;
      return {
        ...base,
        status: old.status ?? base.status,
        review: old.review ?? base.review,
        notes: old.notes ?? base.notes,
        solvedAt: old.solvedAt ?? base.solvedAt,
        nextReviewDate: old.nextReviewDate ?? base.nextReviewDate,
        reviewLevel: typeof old.reviewLevel === 'number' ? old.reviewLevel : base.reviewLevel,
      };
    });

    return {
      topicName,
      position,
      started: existing?.started ?? isTopicStarted(questions),
      doneQuestions: countDoneQuestions(questions),
      questions,
    };
  });
}

/** Apply legacy localStorage progress onto a fresh archive */
export function applyLegacyProgress(archive, legacy) {
  return archive.map((topic) => {
    const questions = topic.questions.map((q) => {
      const p = legacy[q.id];
      if (!p) return q;
      return {
        ...q,
        status: p.status ?? q.status,
        review: p.review ?? q.review,
        notes: p.notes ?? q.notes,
        solvedAt: p.solvedAt ?? q.solvedAt,
        nextReviewDate: p.nextReviewDate ?? q.nextReviewDate,
        reviewLevel: p.reviewLevel ?? q.reviewLevel,
      };
    });
    return {
      ...topic,
      questions,
      started: isTopicStarted(questions),
      doneQuestions: countDoneQuestions(questions),
    };
  });
}

/** Flat progress map keyed by question id (for UI helpers) */
export function archiveToProgressMap(topics) {
  const progress = {};
  topics.forEach((topic) => {
    topic.questions.forEach((q) => {
      progress[q.id] = {
        status: q.status,
        review: q.review,
        notes: q.notes,
        solvedAt: q.solvedAt,
        nextReviewDate: q.nextReviewDate,
        reviewLevel: q.reviewLevel,
      };
    });
  });
  return progress;
}

export function findQuestionInArchive(topics, questionId) {
  for (const topic of topics) {
    const index = topic.questions.findIndex((q) => q.id === questionId);
    if (index >= 0) return { topic, index };
  }
  return null;
}
