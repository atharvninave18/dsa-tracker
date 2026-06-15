import { useEffect } from 'react';
import { useDsa } from '../context/DsaContext';
import { useToast } from '../context/ToastContext';

export function useKeyboardShortcuts({ onQuickAdd, onSearch, onToggleTheme }) {
  const { selectedIds, bulkUpdate, dispatch } = useDsa();
  const { showToast } = useToast();

  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable;

      // Ctrl/Cmd + K — focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onSearch?.();
        return;
      }

      // Ctrl/Cmd + N — quick add
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onQuickAdd?.();
        return;
      }

      // Ctrl/Cmd + D — toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        onToggleTheme?.();
        return;
      }

      if (isInput) return;

      // Escape — clear selection
      if (e.key === 'Escape' && selectedIds.length > 0) {
        dispatch({ type: 'SET_SELECTED', payload: [] });
        showToast('Selection cleared');
      }

      // D — mark selected as Done
      if (e.key === 'd' && selectedIds.length > 0) {
        bulkUpdate({ status: 'Done', solvedAt: new Date().toISOString() });
        showToast(`Marked ${selectedIds.length} question(s) as Done`);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedIds, bulkUpdate, dispatch, showToast, onQuickAdd, onSearch, onToggleTheme]);
}
