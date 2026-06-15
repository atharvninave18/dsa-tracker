import { Box } from '@mui/material';
import { STATUS_COLORS } from '../../constants';
import { useThemeMode } from '../../context/ThemeContext';

export default function StatusBadge({ status, size = 'small' }) {
  const { isDark } = useThemeMode();
  const c = STATUS_COLORS[status] || STATUS_COLORS.Pending;

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: size === 'small' ? 1 : 1.25,
        py: size === 'small' ? 0.25 : 0.5,
        borderRadius: 1,
        fontSize: '0.75rem',
        fontWeight: 500,
        bgcolor: isDark ? c.darkBg : c.bg,
        color: isDark ? c.darkColor : c.color,
        whiteSpace: 'nowrap',
      }}
    >
      <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: c.dot }} />
      {status}
    </Box>
  );
}
