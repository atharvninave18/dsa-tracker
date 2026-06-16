import { Box } from '@mui/material';

/** Page padding wrapper — fullWidth removes the max-width cap */
export default function PageContainer({ children, fullWidth = false, sx }) {
  return (
    <Box
      sx={{
        width: '100%',
        ...(fullWidth
          ? { px: { xs: 2, sm: 3 }, py: { xs: 2.5, sm: 3 } }
          : { maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 2.5, sm: 4 } }),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
