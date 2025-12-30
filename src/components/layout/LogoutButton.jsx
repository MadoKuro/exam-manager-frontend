import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme/themeConstants';

/**
 * Shared logout button component
 */
export default function LogoutButton() {
    const { logout } = useAuth();
    const theme = useTheme();

    return (
        <Box sx={{ p: 2 }}>
            <ListItemButton
                onClick={logout}
                sx={{
                    borderRadius: '16px',
                    color: theme.palette.error.main,
                    '&:hover': {
                        bgcolor: theme.palette.mode === 'light' ? COLORS.errorLight : `${COLORS.errorMain}15`
                    }
                }}
            >
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
        </Box>
    );
}
