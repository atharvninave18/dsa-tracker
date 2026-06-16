const WEEKLY_GOAL_KEY = 'dsa-tracker-weekly-goal';

const DEFAULT = { weeklyTarget: 15, sheetTarget: 200 };

export function loadTrackerGoals() {
  try {
    const raw = localStorage.getItem(WEEKLY_GOAL_KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveTrackerGoals(goals) {
  localStorage.setItem(WEEKLY_GOAL_KEY, JSON.stringify(goals));
}
