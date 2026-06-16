import { createTheme, alpha } from '@mui/material/styles';
import { getTrackerColors } from './colors';

export function createAppTheme(mode) {
  const c = getTrackerColors(mode);
  const isDark = mode === 'dark';

  const palette = {
    mode: isDark ? 'dark' : 'light',
    primary: { main: c.accent, light: c.accentLight, dark: '#5a52e0', contrastText: '#ffffff' },
    secondary: { main: c.textSecondary },
    success: { main: c.green },
    warning: { main: c.amber },
    error: { main: c.red },
    info: { main: c.blue },
    background: { default: c.bg, paper: c.bg2 },
    text: { primary: c.text, secondary: c.textSecondary, disabled: c.textMuted },
    divider: c.borderSolid,
    action: {
      hover: alpha(c.accent, isDark ? 0.08 : 0.06),
      selected: alpha(c.accent, isDark ? 0.15 : 0.1),
    },
  };

  return createTheme({
    palette,
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h4: { fontWeight: 600, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 600, fontSize: '0.8125rem' },
      body2: { fontSize: '0.875rem' },
      caption: { fontSize: '0.75rem', color: palette.text.secondary },
    },
    shape: { borderRadius: c.radius },
    shadows: Array(25).fill('none'),
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            letterSpacing: '-0.01em',
            backgroundColor: c.bg,
            color: c.text,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: c.radiusSm,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          contained: {
            bgcolor: c.accent,
            color: '#fff',
            '&:hover': { bgcolor: c.accentLight },
          },
          outlined: {
            borderColor: c.borderSolid,
            color: palette.text.primary,
            '&:hover': {
              borderColor: c.accent,
              bgcolor: alpha(c.accent, isDark ? 0.1 : 0.06),
            },
          },
          text: { color: palette.text.secondary },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: c.radiusSm,
            color: palette.text.secondary,
            '&:hover': { bgcolor: alpha(c.accent, isDark ? 0.1 : 0.06), color: c.accentLight },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500, borderRadius: c.radiusSm },
          outlined: { borderColor: c.borderSolid },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: c.borderSolid, py: 1.5 },
          head: {
            fontWeight: 500,
            fontSize: '0.75rem',
            color: palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            bgcolor: c.bg3,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:last-child td': { borderBottom: 0 },
            '&:hover': { bgcolor: alpha(c.bg3, 0.6) },
            '&.Mui-selected': { bgcolor: alpha(c.accent, 0.08) },
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: c.radiusSm,
              bgcolor: c.bg3,
              '& fieldset': { borderColor: c.borderSolid },
              '&:hover fieldset': { borderColor: c.border2 },
              '&.Mui-focused fieldset': { borderColor: c.accent },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: { borderRadius: c.radiusSm },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
            border: `1px solid ${c.borderSolid}`,
            bgcolor: c.bg2,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: c.radius, border: `1px solid ${c.borderSolid}`, bgcolor: c.bg2 },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 3, height: 5, bgcolor: c.bg4 },
          bar: {
            borderRadius: 3,
            background: `linear-gradient(90deg, ${c.accent}, ${c.accentLight})`,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: c.textMuted,
            '&.Mui-checked': { color: c.accent },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { backgroundColor: c.accent },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 36,
            fontSize: '0.875rem',
            borderRadius: c.radiusSm,
            color: palette.text.secondary,
            '&.Mui-selected': { color: c.accentLight },
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              bgcolor: alpha(c.accent, isDark ? 0.15 : 0.1),
              color: c.accentLight,
              '&:hover': { bgcolor: alpha(c.accent, isDark ? 0.2 : 0.14) },
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            bgcolor: c.bg3,
            color: c.text,
            border: `1px solid ${c.borderSolid}`,
            fontSize: '0.75rem',
          },
        },
      },
    },
  });
}
