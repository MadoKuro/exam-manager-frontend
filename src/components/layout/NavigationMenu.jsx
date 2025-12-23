import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { ANIMATIONS, COLORS } from '../../theme/themeConstants';

/**
 * Shared navigation menu component
 * @param {Array} items - Array of menu items with { text, path, icon }
 */
export default function NavigationMenu({ items }) {
    const theme = useTheme();
    const location = useLocation();

    return (
        <List>
            {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.75 }}>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            sx={{
                                borderRadius: '10px',
                                transition: `all ${ANIMATIONS.duration.normal} ${ANIMATIONS.easing.smooth}`,
                                background: isActive
                                    ? `linear-gradient(135deg, ${COLORS.primaryMain} 0%, ${COLORS.secondaryMain} 100%)`
                                    : 'transparent',
                                color: isActive ? 'white' : theme.palette.text.primary,
                                boxShadow: isActive ? '0 8px 20px -5px rgba(139, 92, 246, 0.4)' : 'none',
                                '&:hover': {
                                    background: isActive
                                        ? `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.secondaryDark} 100%)`
                                        : `rgba(139, 92, 246, 0.08)`,
                                    transform: ANIMATIONS.hover.translateX
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: isActive ? 'white' : COLORS.primaryMain, minWidth: 36 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        color: isActive ? 'white' : 'inherit'
                                    }
                                }}
                                primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: '0.875rem' }}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}
