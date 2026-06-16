import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { DsaProvider } from './context/DsaContext';
import { TrackerProvider } from './context/TrackerContext';
import { createAppTheme } from './theme/theme';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import QuestionsPage from './pages/QuestionsPage';

function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = createAppTheme(mode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <DsaProvider>
          <TrackerProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppShell />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="questions" element={<QuestionsPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TrackerProvider>
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
