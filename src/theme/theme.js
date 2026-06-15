import { createTheme, alpha } from '@mui/material/styles';

export function createAppTheme(mode) {
  const isDark = mode === 'dark';

  const palette = isDark
    ? {
        mode: 'dark',
        primary: { main: '#fafafa', dark: '#e4e4e7', light: '#ffffff' },
        secondary: { main: '#a1a1aa' },
        success: { main: '#4ade80' },
        warning: { main: '#fbbf24' },
        error: { main: '#f87171' },
        info: { main: '#60a5fa' },
        background: { default: '#09090b', paper: '#18181b' },
        text: { primary: '#fafafa', secondary: '#a1a1aa' },
        divider: '#27272a',
      }
    : {
        mode: 'light',
        primary: { main: '#18181b', dark: '#09090b', light: '#3f3f46' },
        secondary: { main: '#71717a' },
        success: { main: '#16a34a' },
        warning: { main: '#d97706' },
        error: { main: '#dc2626' },
        info: { main: '#2563eb' },
        background: { default: '#fafafa', paper: '#ffffff' },
        text: { primary: '#18181b', secondary: '#71717a' },
        divider: '#e4e4e7',
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
    shape: { borderRadius: 8 },
    shadows: Array(25).fill('none'),
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { letterSpacing: '-0.01em' },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          contained: {
            bgcolor: isDark ? '#fafafa' : '#18181b',
            color: isDark ? '#18181b' : '#fafafa',
            '&:hover': { bgcolor: isDark ? '#e4e4e7' : '#27272a' },
          },
          outlined: {
            borderColor: palette.divider,
            color: palette.text.primary,
            '&:hover': { borderColor: palette.text.secondary, bgcolor: alpha(palette.text.primary, 0.04) },
          },
          text: { color: palette.text.secondary },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            color: palette.text.secondary,
            '&:hover': { bgcolor: alpha(palette.text.primary, 0.06) },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500, borderRadius: 6 },
          outlined: { borderColor: palette.divider },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: palette.divider, py: 1.5 },
          head: {
            fontWeight: 500,
            fontSize: '0.75rem',
            color: palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            bgcolor: isDark ? '#18181b' : '#fafafa',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:last-child td': { borderBottom: 0 },
            '&.Mui-selected': { bgcolor: alpha(isDark ? '#fff' : '#000', 0.04) },
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              bgcolor: isDark ? '#09090b' : '#fafafa',
              '& fieldset': { borderColor: palette.divider },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none', boxShadow: 'none', border: `1px solid ${palette.divider}` },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 12, border: `1px solid ${palette.divider}` },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 4, height: 4, bgcolor: alpha(palette.text.primary, 0.08) },
          bar: { borderRadius: 4, bgcolor: isDark ? '#fafafa' : '#18181b' },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: { color: palette.divider },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { display: 'none' },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 36,
            fontSize: '0.875rem',
            borderRadius: 8,
            color: palette.text.secondary,
            '&.Mui-selected': { color: palette.text.primary },
          },
        },
      },
    },
  });
}
