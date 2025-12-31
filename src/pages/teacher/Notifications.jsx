import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Paper, Button, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../../context/AuthContext';
import { useUserNotifications, NOTIFICATION_TYPES } from '../../context/UserNotificationsContext';
import { COLORS } from '../../theme/themeConstants';

export default function TeacherNotifications() {
    const theme = useTheme();
    const { user } = useAuth();
    const { getNotificationsForUser, markAsRead, markAllAsRead } = useUserNotifications();

    // Get notifications for this teacher
    const notifications = getNotificationsForUser('teacher', user?.id);

    const handleMarkAsRead = (id) => markAsRead(id);
    const handleMarkAllRead = () => markAllAsRead('teacher');

    const getIcon = (type) => {
        switch (type) {
            case NOTIFICATION_TYPES.REQUEST_APPROVED:
                return <CheckCircleIcon />;
            case NOTIFICATION_TYPES.REQUEST_REFUSED:
                return <CancelIcon />;
            case NOTIFICATION_TYPES.ANNOUNCEMENT:
                return <NotificationsActiveIcon />;
            default:
                return <EventNoteIcon />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case NOTIFICATION_TYPES.REQUEST_APPROVED:
                return 'success.main';
            case NOTIFICATION_TYPES.REQUEST_REFUSED:
                return 'error.main';
            case NOTIFICATION_TYPES.ANNOUNCEMENT:
                return 'info.main';
            default:
                return 'primary.main';
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case NOTIFICATION_TYPES.REQUEST_APPROVED:
                return 'success.light';
            case NOTIFICATION_TYPES.REQUEST_REFUSED:
                return 'error.light';
            case NOTIFICATION_TYPES.ANNOUNCEMENT:
                return 'info.light';
            default:
                return 'primary.light';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Stay updated on your exam request statuses and announcements.
                    </Typography>
                </Box>
                <Button
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={handleMarkAllRead}
                    disabled={notifications.every(n => n.read)}
                >
                    Mark all as read
                </Button>
            </Box>

            {notifications.length > 0 ? (
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {notifications.map((notif) => (
                        <Paper
                            key={notif.id}
                            elevation={0}
                            sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 4,
                                bgcolor: notif.read ? 'transparent' : `${COLORS.primaryMain}0A`,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    borderColor: 'primary.main'
                                }
                            }}
                        >
                            <ListItem alignItems="flex-start" disablePadding
                                secondaryAction={
                                    !notif.read && (
                                        <IconButton edge="end" aria-label="mark as read" onClick={() => handleMarkAsRead(notif.id)} color="primary">
                                            <CheckCircleIcon />
                                        </IconButton>
                                    )
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: getBgColor(notif.type), color: getColor(notif.type) }}>
                                        {getIcon(notif.type)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Typography variant="h6" sx={{ fontWeight: notif.read ? 600 : 700, fontSize: '1rem' }}>
                                                {notif.title}
                                            </Typography>
                                            {!notif.read && <Chip label="New" size="small" color="error" sx={{ height: 20, fontSize: '0.65rem' }} />}
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                                sx={{ display: 'block', mb: 1 }}
                                            >
                                                {notif.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(notif.date)}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        </Paper>
                    ))}
                </List>
            ) : (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: theme.palette.action.hover }}>
                    <NotificationsActiveIcon sx={{ fontSize: 60, color: theme.palette.action.disabled, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No notifications yet</Typography>
                    <Typography variant="body2" color="text.secondary">
                        You'll see notifications here when your exam requests are approved or refused.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
