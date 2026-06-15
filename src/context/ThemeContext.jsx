import { createContext, useContext, useCallback, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    return localStorage.getItem('dsa-tracker-theme') || 'light';
  });

  const setMode = useCallback((newMode) => {
    setModeState(newMode);
    localStorage.setItem('dsa-tracker-theme', newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const value = useMemo(
    () => ({ mode, setMode, toggleMode, isDark: mode === 'dark' }),
    [mode, setMode, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return ctx;
}
