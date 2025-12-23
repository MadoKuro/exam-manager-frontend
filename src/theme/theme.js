import { createTheme } from '@mui/material/styles';
import { COLORS, GRADIENTS, LAYOUT, SHADOWS } from './themeConstants';


export const getTheme = (mode) => createTheme({
    palette: {
        mode,
        background: {
            default: mode === 'light' ? '#f8fafc' : '#0b0f19', // Clean Slate-50 / Deep Blue-Black
            paper: mode === 'light' ? '#ffffff' : '#111827', // Pure White / Cool Gray 900
        },
        primary: {
            main: COLORS.primaryMain,
            light: COLORS.primaryLight,
            dark: COLORS.primaryDark,
            contrastText: '#ffffff',
        },
        secondary: {
            main: COLORS.secondaryMain,
            light: COLORS.secondaryLight,
            dark: COLORS.secondaryDark,
            contrastText: '#ffffff',
        },
        text: {
            primary: mode === 'light' ? '#0f172a' : '#f3f4f6', // Slate 900 / Gray 100
            secondary: mode === 'light' ? '#64748b' : '#9ca3af', // Slate 500 / Gray 400
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: mode === 'light' ? '#0f172a' : '#f3f4f6',
        },
        h2: {
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: mode === 'light' ? '#1e293b' : '#e2e8f0',
        },
        h3: { fontWeight: 700, letterSpacing: '-0.02em' },
        h4: { fontWeight: 700, letterSpacing: '-0.02em' },
        h5: { fontWeight: 700, letterSpacing: '-0.01em' },
        h6: { fontWeight: 600, letterSpacing: '0.01em' },
        subtitle1: {
            fontWeight: 600,
            letterSpacing: '0.01em',
            color: mode === 'light' ? '#64748b' : '#94a3b8', // Distinct subtext color
        },
        subtitle2: {
            fontWeight: 600,
            fontSize: '0.875rem',
            letterSpacing: '0.02em',
            color: mode === 'light' ? '#94a3b8' : '#64748b',
            textTransform: 'uppercase', // Styled "Kicker" text
        },
        body1: {
            fontWeight: 500, // Medium weight for better readability
            lineHeight: 1.6,
            color: mode === 'light' ? '#334155' : '#cbd5e1', // Softer than pure black
        },
        body2: {
            fontWeight: 500,
            lineHeight: 1.5,
            color: mode === 'light' ? '#64748b' : '#94a3b8',
        },
        button: {
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: '0.02em',
        },
    },
    shape: {
        borderRadius: LAYOUT.borderRadius.large,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: mode === 'light' ? '#f8fafc' : '#0b0f19', // Solid clean background
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
                    color: mode === 'light' ? '#0f172a' : '#f3f4f6',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: mode === 'light' ? '#ffffff' : '#111827', // Solid Paper
                    borderRight: '1px solid',
                    borderColor: mode === 'light' ? '#e2e8f0' : '#1f2937', // Subtle border
                    boxShadow: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    backgroundColor: mode === 'light' ? '#ffffff' : '#1f2937',
                    border: '1px solid',
                    borderColor: mode === 'light' ? '#e2e8f0' : '#374151',
                    boxShadow: mode === 'light'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' // Subtle shadow
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: LAYOUT.borderRadius.medium,
                    boxShadow: 'none',
                    textTransform: 'none',
                    padding: '10px 24px',
                },
                contained: {
                    background: GRADIENTS.brand,
                    color: 'white',
                    boxShadow: SHADOWS.glow.button,
                    ':hover': {
                        background: GRADIENTS.brandHover,
                        boxShadow: SHADOWS.glow.buttonHover,
                        transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                text: {
                    color: COLORS.primaryMain,
                    ':hover': {
                        backgroundColor: 'rgba(0, 204, 136, 0.08)',
                    }
                },
                outlined: {
                    borderColor: COLORS.primaryMain,
                    color: COLORS.primaryMain,
                    borderWidth: '2px',
                    ':hover': {
                        borderWidth: '2px',
                        borderColor: COLORS.primaryDark,
                        backgroundColor: 'rgba(0, 204, 136, 0.04)',
                    }
                }
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 40,
                    color: mode === 'light' ? '#64748b' : '#9ca3af', // Neutral by default
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: LAYOUT.borderRadius.medium,
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(0, 204, 136, 0.12)',
                        color: COLORS.primaryDark,
                        '& .MuiListItemIcon-root': {
                            color: COLORS.primaryMain,
                        },
                        ':hover': {
                            backgroundColor: 'rgba(0, 204, 136, 0.18)',
                        }
                    },
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: LAYOUT.borderRadius.medium,
                        backgroundColor: mode === 'light' ? '#f8fafc' : '#111827',
                        '& fieldset': {
                            borderColor: mode === 'light' ? '#e2e8f0' : '#374151',
                        },
                        '&:hover fieldset': {
                            borderColor: '#cbd5e1',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: COLORS.primaryMain,
                            borderWidth: '2px',
                        },
                    }
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: LAYOUT.borderRadius.small,
                }
            }
        }
    },
});
