import { Box, Typography } from '@mui/material';

/** Compact stat chip — matches Questions page header stats */
export default function StatPill({ label, value, color = 'text.secondary', strongColor = 'text.primary' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        bgcolor: 'background.default',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        px: 1.25,
        py: 0.5,
        fontSize: '0.75rem',
        color,
      }}
    >
      <Typography component="span" variant="caption" sx={{ color: strongColor, fontWeight: 600 }}>
        {value}
      </Typography>
      <Typography component="span" variant="caption" sx={{ color: 'inherit' }}>
        {label}
      </Typography>
    </Box>
  );
}
