import { Box, Typography } from '@mui/material';

/** Minimal bordered surface — no shadow, consistent padding */
export default function Panel({ title, subtitle, action, children, sx, noPadding }) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: sx?.height ?? 'auto',
        ...sx,
      }}
    >
      {(title || action) && (
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: title || subtitle ? 1 : 0,
            borderColor: 'divider',
          }}
        >
          <Box>
            {title && (
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
      )}
      <Box sx={{ p: noPadding ? 0 : 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</Box>
    </Box>
  );
}
