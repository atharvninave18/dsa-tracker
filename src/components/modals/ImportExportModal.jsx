import { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BackupIcon from '@mui/icons-material/Backup';
import RestoreIcon from '@mui/icons-material/Restore';
import { useDsa } from '../../context/DsaContext';
import { useTracker } from '../../context/TrackerContext';
import { useToast } from '../../context/ToastContext';
import { exportToCSV, exportToJSON, importFromCSV, importFromJSON, downloadFile } from '../../utils/exportImport';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import ConfirmDialog from './ConfirmDialog';

export default function ImportExportModal({ open, onClose }) {
  const { questions, settings, goals, importData, restoreFromBackup } = useDsa();
  const { exportArchive, importArchive, resetArchive } = useTracker();
  const { showToast } = useToast();
  const { confirm, dialogProps } = useConfirmDialog();
  const [tab, setTab] = useState(0);
  const [importText, setImportText] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(true);
  const fileRef = useRef(null);

  const handleExportJSON = () => {
    const json = exportToJSON(questions, settings, goals);
    downloadFile(json, `dsa-tracker-backup-${Date.now()}.json`, 'application/json');
    showToast('JSON backup downloaded');
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(questions);
    downloadFile(csv, `dsa-tracker-${Date.now()}.csv`, 'text/csv');
    showToast('CSV exported');
  };

  const handleImport = () => {
    try {
      if (tab === 0) {
        const data = importFromJSON(importText);
        importData(data);
        showToast(`Imported ${data.questions.length} questions from JSON`);
      } else {
        const imported = importFromCSV(importText);
        if (imported.length === 0) throw new Error('No valid questions found in CSV');
        const merged = replaceExisting ? imported : [...questions, ...imported];
        importData({ questions: merged });
        showToast(`Imported ${imported.length} questions from CSV`);
      }
      setImportText('');
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImportText(ev.target.result);
      setTab(file.name.endsWith('.csv') ? 1 : 0);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleRestore = () => {
    try {
      const data = importFromJSON(importText);
      restoreFromBackup({ ...data, version: 1, exportedAt: new Date().toISOString() });
      showToast('Backup restored successfully');
      setImportText('');
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleExportArchive = async () => {
    try {
      const data = await exportArchive();
      downloadFile(JSON.stringify(data, null, 2), `dsa-question-bank-${Date.now()}.json`, 'application/json');
      showToast('Question bank exported');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleImportArchive = async () => {
    try {
      const data = JSON.parse(importText);
      const imported = await importArchive(data);
      const count = imported.reduce((n, t) => n + t.questions.length, 0);
      showToast(`Imported ${count} questions across ${imported.length} topics`);
      setImportText('');
      onClose();
    } catch (err) {
      showToast(err.message || 'Invalid archive JSON', 'error');
    }
  };

  const handleResetArchive = async () => {
    const ok = await confirm({
      title: 'Reset question bank?',
      message: 'All progress, notes, and review flags will be cleared. This cannot be undone.',
    });
    if (!ok) return;
    try {
      await resetArchive();
      showToast('Question bank reset');
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import / Export</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Question bank (IndexedDB)</Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              Your progress on the Questions tab — status, notes, and review flags.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button startIcon={<FileDownloadIcon />} variant="outlined" onClick={handleExportArchive}>
                Export bank
              </Button>
              <Button startIcon={<RestoreIcon />} variant="outlined" color="warning" onClick={handleResetArchive}>
                Reset bank
              </Button>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>Overview data</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button startIcon={<FileDownloadIcon />} variant="outlined" onClick={handleExportJSON}>
                JSON backup
              </Button>
              <Button startIcon={<FileDownloadIcon />} variant="outlined" onClick={handleExportCSV}>
                CSV
              </Button>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>Import</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 1 }}>
              <Tab label="JSON" />
              <Tab label="CSV" />
              <Tab label="Bank JSON" />
            </Tabs>
            {tab === 1 && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={replaceExisting}
                    onChange={(e) => setReplaceExisting(e.target.checked)}
                    size="small"
                  />
                }
                label="Replace existing questions"
                sx={{ mb: 1, display: 'block' }}
              />
            )}
            {tab === 1 && (
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                Supports spreadsheet format: Category, Question, Link columns. Difficulty is parsed from (easy/medium/hard) in the title.
              </Typography>
            )}
            <input ref={fileRef} type="file" accept=".json,.csv" hidden onChange={handleFileUpload} />
            <Button startIcon={<FileUploadIcon />} variant="outlined" onClick={() => fileRef.current?.click()} sx={{ mb: 1 }}>
              Upload file
            </Button>
            <TextField
              fullWidth
              multiline
              minRows={6}
              placeholder={
                tab === 0 ? 'Paste JSON backup...' : tab === 1 ? 'Paste CSV data...' : 'Paste question bank JSON...'
              }
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Close</Button>
        {importText && (
          <>
            {tab === 0 && (
              <Button startIcon={<RestoreIcon />} onClick={handleRestore} color="warning">
                Restore backup
              </Button>
            )}
            {tab === 2 ? (
              <Button startIcon={<BackupIcon />} onClick={handleImportArchive} variant="contained">
                Import bank
              </Button>
            ) : (
              <Button startIcon={<BackupIcon />} onClick={handleImport} variant="contained">
                Import
              </Button>
            )}
          </>
        )}
      </DialogActions>
      <ConfirmDialog {...dialogProps} />
    </Dialog>
  );
}
