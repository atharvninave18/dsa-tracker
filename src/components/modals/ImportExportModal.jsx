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
import { useToast } from '../../context/ToastContext';
import { exportToCSV, exportToJSON, importFromCSV, importFromJSON, downloadFile } from '../../utils/exportImport';

export default function ImportExportModal({ open, onClose }) {
  const { questions, settings, goals, importData, restoreFromBackup } = useDsa();
  const { showToast } = useToast();
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import / Export</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Export</Typography>
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
              placeholder={tab === 0 ? 'Paste JSON backup...' : 'Paste CSV data...'}
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
            <Button startIcon={<BackupIcon />} onClick={handleImport} variant="contained">
              Import
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
