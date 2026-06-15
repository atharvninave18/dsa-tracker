import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

export default function NotesModal({ open, onClose, onSave, question }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Notes</DialogTitle>
      {open && question && (
        <NotesForm
          key={question.id}
          initialNotes={question.notes || ''}
          onSave={onSave}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}

function NotesForm({ initialNotes, onSave, onClose }) {
  const [notes, setNotes] = useState(initialNotes);

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  return (
    <>
      <DialogContent dividers sx={{ pt: 2 }}>
        <TextField
          fullWidth
          multiline
          minRows={8}
          autoFocus
          placeholder="Write your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { alignItems: 'flex-start' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </>
  );
}
