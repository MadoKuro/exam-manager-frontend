import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
    palette: {
        mode,
        background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a', // Slate-50 / Slate-900
            paper: mode === 'light' ? '#ffffff' : '#1e293b', // White / Slate-800
        },
        primary: {
            main: '#10b981', // Emerald 500
            light: '#34d399', // Emerald 400
            dark: '#059669', // Emerald 600
        },
        text: {
            primary: mode === 'light' ? '#0f172a' : '#f8fafc', // Slate 900 / Slate 50
            secondary: mode === 'light' ? '#475569' : '#94a3b8', // Slate 600 / Slate 400
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', // More modern font stack
        h1: { fontWeight: 800, letterSpacing: '-0.025em' },
        h2: { fontWeight: 800, letterSpacing: '-0.025em' },
        h3: { fontWeight: 700, letterSpacing: '-0.025em' },
        h4: { fontWeight: 700, letterSpacing: '-0.025em' },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        body1: { fontWeight: 400, lineHeight: 1.6 },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: mode === 'light'
                        ? 'radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), radial-gradient(at 50% 0%, rgba(203, 213, 225, 0.15) 0%, transparent 50%), radial-gradient(at 100% 0%, rgba(56, 189, 248, 0.08) 0%, transparent 50%), #f8fafc' // Very subtle Emerald/Slate/Sky
                        : 'radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(at 50% 100%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), #0f172a', // Deep Slate with Emerald/Indigo glow
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    backdropFilter: 'none',
                    borderBottom: 'none',
                    boxShadow: 'none',
                    color: mode === 'light' ? '#0f172a' : '#f8fafc',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(16px)',
                    borderRight: '1px solid',
                    borderColor: mode === 'light' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    boxShadow: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: mode === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                    boxShadow: mode === 'light'
                        ? '0 10px 40px -10px rgba(0,0,0,0.08)' // Soft, refined shadow
                        : '0 10px 40px -10px rgba(0,0,0,0.4)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: 'none',
                    textTransform: 'none',
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                    ':hover': {
                        boxShadow: 'none',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald Gradient
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    ':hover': {
                        boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
                    }
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 40,
                }
            }
        }
    },
});
