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

function AppContent() {
  const { mode } = useColorMode();

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
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
            <ExamRequestProvider>
              <NotificationProvider>
                <AppRoutes />
              </NotificationProvider>
            </ExamRequestProvider>
          </AdminDataProvider>
        </AuthProvider>
      </BrowserRouter>
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
