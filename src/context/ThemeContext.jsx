import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const setMode = useCallback((newMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEYS.THEME, newMode);
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
