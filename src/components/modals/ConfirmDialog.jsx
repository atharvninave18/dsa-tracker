import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Delete', confirmColor = 'error' }) {
  return (
    <Dialog open={Boolean(open)} onClose={onCancel ?? (() => {})} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel ?? (() => {})} color="inherit">Cancel</Button>
        <Button onClick={onConfirm ?? (() => {})} color={confirmColor} variant="contained">{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
