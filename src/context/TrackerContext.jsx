import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  archiveToProgressMap,
  findQuestionInArchive,
} from '../db/buildArchive';
import {
  countDoneQuestions,
  isTopicStarted,
  topicKey,
} from '../db/helpers';
import {
  exportDBData,
  getData,
  importDBData,
  resetDBData,
  updateDBData,
} from '../db/archive';
import {
  computeTrackerDailySolved,
  computeTrackerInsights,
  computeTrackerPeriodStats,
  computeTrackerPlatformStats,
  computeTrackerStats,
  computeTrackerStatusDistribution,
  computeTrackerStreak,
  computeTrackerTopicSections,
  enrichQuestionPatch,
  flattenArchive,
  getRecentlySolved,
  getTrackerRevisionQueue,
  getWeakestTrackerTopics,
  pickRandomTrackerQuestion,
} from '../utils/trackerAnalytics';
import { loadTrackerGoals, saveTrackerGoals } from '../utils/trackerGoals';

const TrackerContext = createContext(null);

function defaultEntry() {
  return {
    status: 'pending',
    review: false,
    notes: '',
    solvedAt: null,
    nextReviewDate: null,
    reviewLevel: 0,
  };
}

export function TrackerProvider({ children }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goals, setGoalsState] = useState(loadTrackerGoals);
  const saveTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;

    getData()
      .then((data) => {
        if (!cancelled) {
          setTopics(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load tracker data');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setGoals = useCallback((patch) => {
    setGoalsState((prev) => {
      const next = { ...prev, ...patch };
      saveTrackerGoals(next);
      return next;
    });
  }, []);

  const flushTopicSave = useCallback((topic) => {
    const key = topicKey(topic.topicName);
    return updateDBData(key, {
      started: topic.started,
      doneQuestions: topic.doneQuestions,
      questions: topic.questions,
    });
  }, []);

  const scheduleTopicSave = useCallback(
    (topic) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        flushTopicSave(topic).catch((err) => {
          console.error('Failed to save topic:', err);
        });
      }, 400);
    },
    [flushTopicSave]
  );

  const updateQuestion = useCallback(
    (questionId, patch) => {
      setTopics((prev) => {
        const found = findQuestionInArchive(prev, questionId);
        if (!found) return prev;

        const { topic, index } = found;
        const questions = [...topic.questions];
        const current = questions[index];
        questions[index] = enrichQuestionPatch(current, patch);

        const updatedTopic = {
          ...topic,
          questions,
          started: isTopicStarted(questions),
          doneQuestions: countDoneQuestions(questions),
        };

        const next = prev.map((t) =>
          topicKey(t.topicName) === topicKey(topic.topicName) ? updatedTopic : t
        );

        scheduleTopicSave(updatedTopic);
        return next;
      });
    },
    [scheduleTopicSave]
  );

  const getQ = useCallback(
    (id) => {
      const map = archiveToProgressMap(topics);
      return map[id] || defaultEntry();
    },
    [topics]
  );

  const exportArchive = useCallback(() => exportDBData(), []);

  const importArchive = useCallback(async (data) => {
    const imported = await importDBData(data);
    setTopics(imported);
    return imported;
  }, []);

  const resetArchive = useCallback(async () => {
    const fresh = await resetDBData();
    setTopics(fresh);
    return fresh;
  }, []);

  const progress = useMemo(() => archiveToProgressMap(topics), [topics]);
  const questions = useMemo(() => flattenArchive(topics), [topics]);
  const stats = useMemo(() => computeTrackerStats(questions), [questions]);
  const streak = useMemo(() => computeTrackerStreak(questions), [questions]);
  const dailySolved = useMemo(() => computeTrackerDailySolved(questions), [questions]);
  const periodStats = useMemo(() => computeTrackerPeriodStats(questions), [questions]);
  const revisionQueue = useMemo(() => getTrackerRevisionQueue(questions), [questions]);
  const groupedSectionsAll = useMemo(() => computeTrackerTopicSections(topics), [topics]);
  const weakestSections = useMemo(() => getWeakestTrackerTopics(topics), [topics]);
  const recentlySolved = useMemo(() => getRecentlySolved(questions), [questions]);
  const statusDistribution = useMemo(() => computeTrackerStatusDistribution(questions), [questions]);
  const platformStats = useMemo(() => computeTrackerPlatformStats(questions), [questions]);
  const insights = useMemo(
    () => computeTrackerInsights(stats, streak, periodStats, weakestSections),
    [stats, streak, periodStats, weakestSections]
  );

  const pickRandom = useCallback(
    (opts) => pickRandomTrackerQuestion(questions, opts),
    [questions]
  );

  const value = useMemo(
    () => ({
      topics,
      questions,
      progress,
      loading,
      error,
      goals,
      stats,
      streak,
      dailySolved,
      periodStats,
      revisionQueue,
      groupedSectionsAll,
      weakestSections,
      recentlySolved,
      statusDistribution,
      platformStats,
      insights,
      getQ,
      updateQuestion,
      setGoals,
      pickRandom,
      exportArchive,
      importArchive,
      resetArchive,
    }),
    [
      topics,
      questions,
      progress,
      loading,
      error,
      goals,
      stats,
      streak,
      dailySolved,
      periodStats,
      revisionQueue,
      groupedSectionsAll,
      weakestSections,
      recentlySolved,
      statusDistribution,
      platformStats,
      insights,
      getQ,
      updateQuestion,
      setGoals,
      pickRandom,
      exportArchive,
      importArchive,
      resetArchive,
    ]
  );

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider');
  return ctx;
}
