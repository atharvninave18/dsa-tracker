import { STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_GOAL } from '../constants';
import { normalizeQuestions } from './helpers';

/** Safely parse JSON from localStorage */
function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Persist JSON to localStorage */
function safeSave(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);
    return false;
  }
}

export function loadQuestions() {
  return normalizeQuestions(safeParse(STORAGE_KEYS.QUESTIONS, []));
}

export function saveQuestions(questions) {
  return safeSave(STORAGE_KEYS.QUESTIONS, questions);
}

export function loadSettings() {
  return { ...DEFAULT_SETTINGS, ...safeParse(STORAGE_KEYS.SETTINGS, {}) };
}

export function saveSettings(settings) {
  return safeSave(STORAGE_KEYS.SETTINGS, settings);
}

export function loadGoals() {
  return { ...DEFAULT_GOAL, ...safeParse(STORAGE_KEYS.GOALS, {}) };
}

export function saveGoals(goals) {
  return safeSave(STORAGE_KEYS.GOALS, goals);
}

export function loadTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
}

export function saveTheme(mode) {
  localStorage.setItem(STORAGE_KEYS.THEME, mode);
}

export function loadPomodoroSettings() {
  return safeParse(STORAGE_KEYS.POMODORO, null);
}

export function savePomodoroSettings(settings) {
  return safeSave(STORAGE_KEYS.POMODORO, settings);
}

/** Full backup snapshot */
export function createBackup(questions, settings, goals) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    questions,
    settings,
    goals,
  };
}

export function restoreBackup(data) {
  if (!data || !Array.isArray(data.questions)) {
    throw new Error('Invalid backup format');
  }
  saveQuestions(data.questions);
  if (data.settings) saveSettings(data.settings);
  if (data.goals) saveGoals(data.goals);
  return data.questions;
}
