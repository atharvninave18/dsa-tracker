import { Box, Typography } from '@mui/material';
import { QUESTION_ROW_GRID } from './questionRowLayout';

export default function QuestionRowHeader() {
  return (
    <Box
      sx={{
        ...QUESTION_ROW_GRID,
        py: 1.25,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
        position: 'sticky',
        top: 0,
        zIndex: 2,
      }}
    >
      <Box />
      <Box />
      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Question
      </Typography>
      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Status
      </Typography>
      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Difficulty
      </Typography>
      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Review
      </Typography>
      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Actions
      </Typography>
    </Box>
  );
}
