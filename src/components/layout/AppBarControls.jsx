import { Box, IconButton, Badge, Tooltip, Avatar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useColorMode } from '../../context/ThemeContext';
import { COLORS } from '../../theme/themeConstants';

/**
 * Shared AppBar controls component
 * @param {Object} user - Current user object with name property
 * @param {string} notificationPath - Path for notifications link (optional)
 * @param {number} notificationCount - Number of unread notifications (optional)
 * @param {boolean} showUserInfo - Whether to show user avatar and name
 */
export default function AppBarControls({
    user,
    notificationPath,
    notificationCount = 0,
    showUserInfo = true,
    defaultInitial = 'U'
}) {
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '4px 8px',
            border: `1px solid ${theme.palette.divider}`
        }}>
            {/* Notification Bell (optional) */}
            {notificationPath && (
                <>
                    <Tooltip title="Notifications" arrow>
                        <IconButton
                            component={Link}
                            to={notificationPath}
                            size="small"
                            sx={{
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)',
                                    color: COLORS.primaryMain
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <Badge
                                badgeContent={notificationCount}
                                color="error"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        fontSize: '0.65rem',
                                        height: '16px',
                                        minWidth: '16px',
                                        padding: '0 4px'
                                    }
                                }}
                            >
                                <NotificationsIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Box sx={{ width: '1px', height: '24px', bgcolor: 'divider', mx: 0.5 }} />
                </>
            )}

            {/* User Info (optional) */}
            {showUserInfo && (
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1, gap: 1 }}>
                        <Avatar sx={{
                            width: 28,
                            height: 28,
                            bgcolor: `${COLORS.primaryMain}15`,
                            color: COLORS.primaryMain,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            border: `1.5px solid ${COLORS.primaryMain}30`
                        }}>
                            {user?.name?.charAt(0) || defaultInitial}
                        </Avatar>
                        <Typography variant="body2" sx={{
                            fontWeight: 500,
                            fontSize: '0.813rem',
                            color: theme.palette.text.primary
                        }}>
                            {user?.name || 'User'}
                        </Typography>
                    </Box>
                    <Box sx={{ width: '1px', height: '24px', bgcolor: 'divider', mx: 0.5 }} />
                </>
            )}

            {/* Dark Mode Toggle */}
            <Tooltip title={theme.palette.mode === 'dark' ? 'Light mode' : 'Dark mode'} arrow>
                <IconButton
                    onClick={toggleColorMode}
                    size="small"
                    sx={{
                        color: COLORS.primaryMain,
                        '&:hover': {
                            bgcolor: `${COLORS.primaryMain}15`,
                            transform: 'rotate(180deg)'
                        },
                        transition: 'all 0.3s'
                    }}
                >
                    {theme.palette.mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                </IconButton>
            </Tooltip>
        </Box>
    );
}
