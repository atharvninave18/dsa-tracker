import { Box, Typography } from '@mui/material';

const GAP = 2.5;

/** Full-width row — use when a single panel spans the page */
export function PageFull({ children, sx }) {
  return (
    <Box sx={{ mb: GAP, minWidth: 0, ...sx }}>
      {children}
    </Box>
  );
}

/** Two equal columns on md+; stacks on mobile */
export function PageSplit({ left, right, sx }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: GAP,
        mb: GAP,
        alignItems: 'stretch',
        ...sx,
      }}
    >
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', '& > *': { flex: 1 } }}>
        {left}
      </Box>
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', '& > *': { flex: 1 } }}>
        {right}
      </Box>
    </Box>
  );
}

/** Optional section label above a group of rows */
export function PageSectionTitle({ title, subtitle }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} letterSpacing="-0.01em">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" mt={0.25}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
