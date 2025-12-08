import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import RoomIcon from '@mui/icons-material/Room';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function StudentNotifications() {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Room Change', message: 'Algorithmics 2 exam moved to Room 23', date: '2025-12-08 10:00', type: 'warning', read: false },
        { id: 2, title: 'New Exam Added', message: 'Database Systems Final Exam schedule released', date: '2025-12-07 15:30', type: 'info', read: false },
        { id: 3, title: 'Schedule Update', message: 'Mathematics mid-term time changed to 14:00', date: '2025-12-05 09:00', type: 'warning', read: true },
        { id: 4, title: 'Announcement', message: 'End of semester party details', date: '2025-12-01 12:00', type: 'general', read: true },
    ]);

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <RoomIcon />;
            case 'info': return <NotificationsActiveIcon />;
            case 'general': return <EventBusyIcon />;
            default: return <NotificationsActiveIcon />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'warning': return 'error.main';
            case 'info': return 'info.main';
            case 'general': return 'text.secondary';
            default: return 'primary.main';
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'warning': return 'error.light';
            case 'info': return 'info.light';
            case 'general': return 'grey.200';
            default: return 'primary.light';
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Notifications
                </Typography>
                <Button
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={handleMarkAllRead}
                    disabled={notifications.every(n => n.read)}
                >
                    Mark all as read
                </Button>
            </Box>

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
                            bgcolor: notif.read ? 'transparent' : (theme) => theme.palette.mode === 'light' ? 'rgba(16, 185, 129, 0.04)' : 'rgba(16, 185, 129, 0.1)',
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
                                            {notif.date}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>
        </Box>
    );
}
