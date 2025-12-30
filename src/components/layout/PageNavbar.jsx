import { Box, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { ANIMATIONS, COLORS, GLASSMORPHISM } from '../../theme/themeConstants';

/**
 * Page-level navigation bar for sub-navigation within a domain
 * Appears below the AppBar when a domain (sidebar item) is selected
 * @param {Array} items - Array of navigation items with { text, path, icon }
 */
export default function PageNavbar({ items = [] }) {
    const theme = useTheme();
    const location = useLocation();

    if (!items || items.length === 0) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                px: 1,
                py: 1.5,
                borderRadius: '16px',
                background: theme.palette.mode === 'light'
                    ? GLASSMORPHISM.card.light
                    : GLASSMORPHISM.card.dark,
                backdropFilter: GLASSMORPHISM.card.blur,
                border: `1px solid ${theme.palette.mode === 'light'
                    ? GLASSMORPHISM.card.border.light
                    : GLASSMORPHISM.card.border.dark}`,
                boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.08)',
                flexWrap: 'wrap',
            }}
        >
            {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Button
                        key={item.path}
                        component={Link}
                        to={item.path}
                        startIcon={item.icon}
                        sx={{
                            px: 2.5,
                            py: 1,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: isActive ? 600 : 500,
                            fontSize: '0.875rem',
                            transition: `all ${ANIMATIONS.duration.normal} ${ANIMATIONS.easing.smooth}`,
                            background: isActive
                                ? `linear-gradient(135deg, ${COLORS.primaryMain} 0%, ${COLORS.secondaryMain} 100%)`
                                : 'transparent',
                            color: isActive ? 'white' : theme.palette.text.primary,
                            boxShadow: isActive
                                ? '0 6px 16px -4px rgba(139, 92, 246, 0.35)'
                                : 'none',
                            '&:hover': {
                                background: isActive
                                    ? `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.secondaryDark} 100%)`
                                    : `rgba(139, 92, 246, 0.08)`,
                                transform: 'translateY(-2px)',
                                boxShadow: isActive
                                    ? '0 8px 20px -4px rgba(139, 92, 246, 0.4)'
                                    : '0 4px 12px -4px rgba(0, 0, 0, 0.1)',
                            },
                            '& .MuiButton-startIcon': {
                                color: isActive ? 'white' : COLORS.primaryMain,
                                marginRight: 0.75,
                            },
                        }}
                    >
                        {item.text}
                    </Button>
                );
            })}
        </Box>
    );
}
