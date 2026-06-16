import { useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import ImportExportModal from '../modals/ImportExportModal';
import PomodoroTimer from '../modals/PomodoroTimer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useThemeMode } from '../../context/ThemeContext';

export default function AppShell() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { toggleMode } = useThemeMode();
  const [importOpen, setImportOpen] = useState(false);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);

  useKeyboardShortcuts({
    onQuickAdd: () => navigate('/questions'),
    onSearch: () => {
      navigate('/questions');
      requestAnimationFrame(() => searchRef.current?.focus());
    },
    onToggleTheme: toggleMode,
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Header
        onImportExport={() => setImportOpen(true)}
        onPomodoro={() => setPomodoroOpen(true)}
      />

      <Box component="main" sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Outlet context={{ searchRef }} />
      </Box>

      <ImportExportModal open={importOpen} onClose={() => setImportOpen(false)} />
      <PomodoroTimer open={pomodoroOpen} onClose={() => setPomodoroOpen(false)} />
    </Box>
  );
}
