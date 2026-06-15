import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  Menu,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

export default function TableToolbar({
  selectedCount,
  totalFiltered,
  onAdd,
  onBulkDone,
  onBulkDelete,
  onBulkReviewDate,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [reviewDate, setReviewDate] = useState('');

  const handleSetReviewDate = () => {
    if (reviewDate) {
      onBulkReviewDate(new Date(reviewDate).toISOString());
      setReviewDate('');
      setAnchorEl(null);
    }
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {totalFiltered} question{totalFiltered !== 1 ? 's' : ''}
        {selectedCount > 0 && ` · ${selectedCount} selected`}
      </Typography>

      <Stack direction="row" spacing={1}>
        {selectedCount > 0 && (
          <>
            <Button size="small" variant="outlined" onClick={onBulkDone}>Mark done</Button>
            <Button size="small" variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)}>
              Review date
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
                <TextField
                  type="date"
                  size="small"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                />
                <Button size="small" variant="contained" onClick={handleSetReviewDate}>Apply</Button>
              </Box>
            </Menu>
            <Button size="small" variant="outlined" color="error" onClick={onBulkDelete}>Delete</Button>
          </>
        )}
        <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
          Add
        </Button>
      </Stack>
    </Box>
  );
}
