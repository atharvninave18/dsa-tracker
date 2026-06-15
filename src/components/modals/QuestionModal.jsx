import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { STATUSES, DIFFICULTIES, PLATFORMS, TAGS } from '../../constants';

const EMPTY_FORM = {
  name: '',
  link: '',
  status: 'Pending',
  reviewDate: '',
  notes: '',
  difficulty: 'Medium',
  tags: [],
  platform: 'LeetCode',
  isFavorite: false,
};

export default function QuestionModal({ open, onClose, onSave, question, title }) {
  const isEdit = Boolean(question?.id);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title || (isEdit ? 'Edit Question' : 'Add Question')}</DialogTitle>
      {open && (
        <QuestionForm
          key={question?.id || 'new'}
          question={question}
          isEdit={isEdit}
          onSave={onSave}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}

function QuestionForm({ question, isEdit, onSave, onClose }) {
  const [form, setForm] = useState(() => (question ? { ...question } : { ...EMPTY_FORM }));
  const [notesTab, setNotesTab] = useState(0);

  const set = (field) => (e) => {
    const val = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleSave = () => {
    if (!form.name?.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField label="Question Name" fullWidth required value={form.name || ''} onChange={set('name')} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Platform</InputLabel>
              <Select label="Platform" value={form.platform || 'LeetCode'} onChange={set('platform')}>
                {PLATFORMS.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <TextField label="Question Link" fullWidth value={form.link || ''} onChange={set('link')} placeholder="https://leetcode.com/problems/..." />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={form.status || 'Pending'} onChange={set('status')}>
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select label="Difficulty" value={form.difficulty || 'Medium'} onChange={set('difficulty')}>
                {DIFFICULTIES.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Review Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.reviewDate ? form.reviewDate.slice(0, 10) : ''}
              onChange={(e) => set('reviewDate')(e.target.value ? new Date(e.target.value).toISOString() : '')}
            />
          </Grid>
          <Grid size={12}>
            <Autocomplete
              multiple
              options={TAGS}
              value={form.tags || []}
              onChange={(_, val) => set('tags')(val)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} size="small" {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => <TextField {...params} label="Tags" placeholder="Select tags" />}
            />
          </Grid>
          <Grid size={12}>
            <Tabs value={notesTab} onChange={(_, v) => setNotesTab(v)} sx={{ mb: 1 }}>
              <Tab label="Edit Notes" />
              <Tab label="Preview" />
            </Tabs>
            {notesTab === 0 ? (
              <TextField
                label="Notes (Markdown supported)"
                fullWidth
                multiline
                minRows={4}
                value={form.notes || ''}
                onChange={set('notes')}
              />
            ) : (
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, minHeight: 120, '& pre': { overflow: 'auto' } }}>
                {form.notes ? <ReactMarkdown>{form.notes}</ReactMarkdown> : <Box color="text.secondary" fontStyle="italic">No notes yet</Box>}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!form.name?.trim()}>
          {isEdit ? 'Save Changes' : 'Add Question'}
        </Button>
      </DialogActions>
    </>
  );
}
