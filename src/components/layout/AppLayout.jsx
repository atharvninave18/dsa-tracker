import { useState, useRef, useCallback, useTransition, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Header from './Header';
import Dashboard from '../dashboard/Dashboard';
import FilterBar from '../filters/FilterBar';
import QuestionTable from '../table/QuestionTable';
import ImportExportModal from '../modals/ImportExportModal';
import PomodoroTimer from '../modals/PomodoroTimer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useThemeMode } from '../../context/ThemeContext';

export default function AppLayout() {
  const [tab, setTab] = useState('dashboard');
  const [questionsMounted, setQuestionsMounted] = useState(false);
  const [, startTransition] = useTransition();
  const [importOpen, setImportOpen] = useState(false);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const searchRef = useRef(null);
  const quickAddRef = useRef(null);
  const { toggleMode } = useThemeMode();

  const goToQuestions = useCallback(() => {
    setQuestionsMounted(true);
    startTransition(() => setTab('questions'));
  }, []);

  // Preload Questions tab in idle time so first navigation feels instant
  useEffect(() => {
    const preload = () => setQuestionsMounted(true);
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(preload, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 1200);
    return () => clearTimeout(id);
  }, []);

  useKeyboardShortcuts({
    onQuickAdd: () => {
      goToQuestions();
      requestAnimationFrame(() => quickAddRef.current?.openAdd?.());
    },
    onSearch: () => {
      goToQuestions();
      requestAnimationFrame(() => searchRef.current?.focus());
    },
    onToggleTheme: toggleMode,
  });

  const handleTabChange = (newTab) => {
    if (newTab === 'questions') {
      goToQuestions();
      return;
    }
    startTransition(() => setTab(newTab));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header
        tab={tab}
        onTabChange={handleTabChange}
        onImportExport={() => setImportOpen(true)}
        onPomodoro={() => setPomodoroOpen(true)}
      />

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 2.5, sm: 4 } }}>
        <Box sx={{ display: tab === 'dashboard' ? 'block' : 'none' }}>
          <Dashboard />
        </Box>

        {questionsMounted && (
          <Box sx={{ display: tab === 'questions' ? 'block' : 'none' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>Questions</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage and track your practice problems
              </Typography>
            </Box>
            <FilterBar searchRef={searchRef} />
            <QuestionTable ref={quickAddRef} />
          </Box>
        )}
      </Box>

      <ImportExportModal open={importOpen} onClose={() => setImportOpen(false)} />
      <PomodoroTimer open={pomodoroOpen} onClose={() => setPomodoroOpen(false)} />
    </Box>
  );
}
