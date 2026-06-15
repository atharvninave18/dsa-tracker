import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import {
  loadQuestions,
  saveQuestions,
  loadSettings,
  saveSettings,
  loadGoals,
  saveGoals,
  restoreBackup,
} from '../utils/storage';
import {
  filterQuestions,
  sortQuestions,
  computeStats,
  computeStreak,
  computeDailySolved,
  computePeriodStats,
  computeTopicStats,
  computeStatusDistribution,
  computeDifficultyDistribution,
  computePlatformStats,
  computeHeatmapData,
  getRevisionQueue,
  createEmptyQuestion,
  groupQuestionsBySection,
  getRecentlySolved,
  getInProgressQuestions,
  getWeakestSections,
  computeInsights,
  normalizeQuestion,
  normalizeQuestions,
} from '../utils/helpers';

const DsaContext = createContext(null);

const initialFilters = {
  search: '',
  status: [],
  difficulty: [],
  platform: [],
  tags: [],
  favoritesOnly: false,
};

function initState() {
  let questions = loadQuestions();

  const settings = loadSettings();
  return {
    questions,
    settings,
    goals: loadGoals(),
    filters: initialFilters,
    sortBy: settings.defaultSort || 'dateAdded',
    sortOrder: settings.defaultSortOrder || 'desc',
    selectedIds: [],
    page: 0,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    case 'ADD_QUESTION':
      return { ...state, questions: [action.payload, ...state.questions] };
    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.payload.id ? { ...q, ...action.payload, lastUpdated: new Date().toISOString() } : q
        ),
      };
    case 'DELETE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== action.payload),
        selectedIds: state.selectedIds.filter((id) => id !== action.payload),
      };
    case 'BULK_UPDATE':
      return {
        ...state,
        questions: state.questions.map((q) =>
          state.selectedIds.includes(q.id)
            ? { ...q, ...action.payload, lastUpdated: new Date().toISOString() }
            : q
        ),
        selectedIds: [],
      };
    case 'BULK_DELETE':
      return {
        ...state,
        questions: state.questions.filter((q) => !state.selectedIds.includes(q.id)),
        selectedIds: [],
      };
    case 'REORDER':
      return { ...state, questions: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload }, page: 0 };
    case 'RESET_FILTERS':
      return { ...state, filters: initialFilters, page: 0 };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder };
    case 'SET_SELECTED':
      return { ...state, selectedIds: action.payload };
    case 'TOGGLE_SELECT':
      return {
        ...state,
        selectedIds: state.selectedIds.includes(action.payload)
          ? state.selectedIds.filter((id) => id !== action.payload)
          : [...state.selectedIds, action.payload],
      };
    case 'SELECT_ALL':
      return { ...state, selectedIds: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_GOALS':
      return { ...state, goals: { ...state.goals, ...action.payload } };
    case 'IMPORT_DATA':
      return {
        ...state,
        questions: action.payload.questions,
        settings: action.payload.settings ? { ...state.settings, ...action.payload.settings } : state.settings,
        goals: action.payload.goals ? { ...state.goals, ...action.payload.goals } : state.goals,
        selectedIds: [],
        page: 0,
      };
    default:
      return state;
  }
}

export function DsaProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, initState);

  // Auto-save questions to localStorage (debounced to avoid blocking UI)
  useEffect(() => {
    const id = setTimeout(() => saveQuestions(state.questions), 400);
    return () => clearTimeout(id);
  }, [state.questions]);

  useEffect(() => {
    saveSettings(state.settings);
  }, [state.settings]);

  useEffect(() => {
    saveGoals(state.goals);
  }, [state.goals]);

  const addQuestion = useCallback((data) => {
    const question = normalizeQuestion(createEmptyQuestion(data));
    dispatch({ type: 'ADD_QUESTION', payload: question });
    return question;
  }, []);

  const updateQuestion = useCallback((id, updates) => {
    const payload = { id, ...updates };
    if (updates.status === 'Done' && !updates.solvedAt) {
      payload.solvedAt = new Date().toISOString();
    }
    dispatch({ type: 'UPDATE_QUESTION', payload });
  }, []);

  const deleteQuestion = useCallback((id) => {
    dispatch({ type: 'DELETE_QUESTION', payload: id });
  }, []);

  const bulkUpdate = useCallback((updates) => {
    dispatch({ type: 'BULK_UPDATE', payload: updates });
  }, []);

  const bulkDelete = useCallback(() => {
    dispatch({ type: 'BULK_DELETE' });
  }, []);

  const reorderQuestions = useCallback((questions) => {
    const withPriority = questions.map((q, i) => ({ ...q, priority: i }));
    dispatch({ type: 'REORDER', payload: withPriority });
  }, []);

  const importData = useCallback((data) => {
    dispatch({
      type: 'IMPORT_DATA',
      payload: {
        ...data,
        questions: normalizeQuestions(data.questions || []),
      },
    });
  }, []);

  const restoreFromBackup = useCallback((backup) => {
    const questions = restoreBackup(backup);
    dispatch({ type: 'IMPORT_DATA', payload: { questions, settings: backup.settings, goals: backup.goals } });
  }, []);

  const filteredQuestions = useMemo(
    () => sortQuestions(filterQuestions(state.questions, state.filters), state.sortBy, state.sortOrder),
    [state.questions, state.filters, state.sortBy, state.sortOrder]
  );

  const groupedSections = useMemo(
    () => groupQuestionsBySection(filteredQuestions),
    [filteredQuestions]
  );

  const groupedSectionsAll = useMemo(
    () => groupQuestionsBySection(state.questions),
    [state.questions]
  );

  const stats = useMemo(() => computeStats(state.questions), [state.questions]);
  const streak = useMemo(() => computeStreak(state.questions), [state.questions]);
  const dailySolved = useMemo(() => computeDailySolved(state.questions), [state.questions]);
  const periodStats = useMemo(() => computePeriodStats(state.questions), [state.questions]);
  const topicStats = useMemo(() => computeTopicStats(state.questions), [state.questions]);
  const statusDistribution = useMemo(() => computeStatusDistribution(state.questions), [state.questions]);
  const difficultyDistribution = useMemo(() => computeDifficultyDistribution(state.questions), [state.questions]);
  const platformStats = useMemo(() => computePlatformStats(state.questions), [state.questions]);
  const heatmapData = useMemo(() => computeHeatmapData(state.questions), [state.questions]);
  const revisionQueue = useMemo(() => getRevisionQueue(state.questions), [state.questions]);

  const recentlySolved = useMemo(() => getRecentlySolved(state.questions), [state.questions]);
  const inProgressQuestions = useMemo(() => getInProgressQuestions(state.questions), [state.questions]);
  const weakestSections = useMemo(() => getWeakestSections(state.questions), [state.questions]);
  const insights = useMemo(
    () => computeInsights(
      stats,
      streak,
      periodStats,
      groupedSectionsAll.map((s) => ({
        ...s,
        pct: s.total > 0 ? Math.round((s.done / s.total) * 100) : 0,
      }))
    ),
    [stats, streak, periodStats, groupedSectionsAll]
  );

  const value = useMemo(
    () => ({
      ...state,
      filteredQuestions,
      groupedSections,
      groupedSectionsAll,
      recentlySolved,
      inProgressQuestions,
      weakestSections,
      insights,
      totalFiltered: filteredQuestions.length,
      stats,
      streak,
      dailySolved,
      periodStats,
      topicStats,
      statusDistribution,
      difficultyDistribution,
      platformStats,
      heatmapData,
      revisionQueue,
      dispatch,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      bulkUpdate,
      bulkDelete,
      reorderQuestions,
      importData,
      restoreFromBackup,
    }),
    [
      state,
      filteredQuestions,
      groupedSections,
      groupedSectionsAll,
      recentlySolved,
      inProgressQuestions,
      weakestSections,
      insights,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      bulkUpdate,
      bulkDelete,
      reorderQuestions,
      importData,
      restoreFromBackup,
    ]
  );

  return <DsaContext.Provider value={value}>{children}</DsaContext.Provider>;
}

export function useDsa() {
  const ctx = useContext(DsaContext);
  if (!ctx) throw new Error('useDsa must be used within DsaProvider');
  return ctx;
}
