import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { AuthProvider } from './context/AuthContext';
import { ColorModeProvider, useColorMode } from './context/ThemeContext';
import { ExamRequestProvider } from './context/ExamRequestContext';
import { NotificationProvider } from './context/NotificationContext';
import { AdminDataProvider } from './context/AdminDataContext';
import AppRoutes from './routes/AppRoutes';
import { getTheme } from './theme/theme';
import { ExamRequestProvider } from './context/ExamRequestContext';
import { NotificationProvider } from './context/NotificationContext';

import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const { mode } = useColorMode();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
<<<<<<< HEAD
      <ErrorBoundary>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ':root': {
              '--primary-main': theme.palette.primary.main,
              '--primary-light': theme.palette.primary.light,
              '--primary-dark': theme.palette.primary.dark,
              '--bg-default': theme.palette.background.default,
              '--bg-paper': theme.palette.background.paper,
              '--text-primary': theme.palette.text.primary,
            },
          }}
        />
        <BrowserRouter>
          <AuthProvider>
=======
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--primary-main': theme.palette.primary.main,
            '--primary-light': theme.palette.primary.light,
            '--primary-dark': theme.palette.primary.dark,
            '--bg-default': theme.palette.background.default,
            '--bg-paper': theme.palette.background.paper,
            '--text-primary': theme.palette.text.primary,
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <AdminDataProvider>
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
            <ExamRequestProvider>
              <NotificationProvider>
                <AppRoutes />
              </NotificationProvider>
            </ExamRequestProvider>
<<<<<<< HEAD
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
=======
          </AdminDataProvider>
        </AuthProvider>
      </BrowserRouter>
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ColorModeProvider>
      <AppContent />
    </ColorModeProvider>
  );
}
