import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { DsaProvider } from './context/DsaContext';
import { createAppTheme } from './theme/theme';
import AppLayout from './components/layout/AppLayout';

function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = createAppTheme(mode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <DsaProvider>
          <AppLayout />
        </DsaProvider>
      </ToastProvider>
    </MuiThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
