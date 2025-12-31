import { useMemo } from 'react';
import { Box, Typography, Grid, CardContent, Avatar, IconButton, Grow, List, ListItem, ListItemText, ListItemAvatar, Chip, Divider, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { COLORS } from '../../theme/themeConstants';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { useExamRequests } from '../../context/ExamRequestContext';
import { useUserNotifications, NOTIFICATION_TYPES } from '../../context/UserNotificationsContext';
import { GlassmorphicCard } from '../../components/admin';

export default function TeacherDashboard() {
    const theme = useTheme();
    const { user } = useAuth();
    const { modules } = useAdminData();
    const { requests } = useExamRequests();
    const { getNotificationsForUser } = useUserNotifications();

    // Filter data by current teacher
    const teacherId = user?.id;

    // Get notifications for this teacher
    const teacherNotifications = getNotificationsForUser('teacher', teacherId).slice(0, 5);

    // Compute stats from real data
    const stats = useMemo(() => {
        const myModules = modules.filter(m => m.teacherId === teacherId);
        const myRequests = requests.filter(r => r.teacherId === teacherId);
        const pendingRequests = myRequests.filter(r => r.status === 'Pending');
        const upcomingExams = myRequests.filter(r => r.status === 'Approved');

        return [
            { title: 'My Modules', value: String(myModules.length), icon: <GroupIcon />, color: COLORS.primaryMain },
            { title: 'Pending Requests', value: String(pendingRequests.length), icon: <EventNoteIcon />, color: COLORS.warningMain },
            { title: 'Upcoming Exams', value: String(upcomingExams.length), icon: <AccessTimeIcon />, color: COLORS.secondaryMain },
        ];
    }, [modules, requests, teacherId]);

    // Get display name from user context
    const displayName = user?.name?.split(' ')[0] || 'Teacher';

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h3" fontWeight="900" gutterBottom sx={{
                    color: theme.palette.text.primary,
                    letterSpacing: '-1px'
                }}>
                    Welcome back, {displayName}!
                </Typography>
                <Typography variant="h6" sx={{ color: COLORS.primaryMain, opacity: 0.8 }}>
                    Your academic command center.
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 5 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Grow in={true} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
                            <GlassmorphicCard
                                hoverEffect="lift"
                                sx={{
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, textAlign: 'center' }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: `${stat.color}15`,
                                            color: stat.color,
                                            width: 70,
                                            height: 70,
                                            mb: 2,
                                            boxShadow: 'none',
                                            border: `1px solid ${stat.color}30`
                                        }}
                                    >
                                        {stat.icon}
                                    </Avatar>
                                    <Typography variant="h2" fontWeight="800" sx={{ mb: 0, color: theme.palette.text.primary }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>
                                        {stat.title}
                                    </Typography>
                                </CardContent>
                            </GlassmorphicCard>
                        </Grow>
                    </Grid>
                ))}
            </Grid>

            <Grow in={true} timeout={1000} style={{ transitionDelay: '800ms' }}>
                <GlassmorphicCard sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 4, height: 24, background: `linear-gradient(to bottom, ${COLORS.primaryMain}, ${COLORS.secondaryMain})`, borderRadius: 2 }} />
                            <Typography variant="h5" fontWeight="bold" color={theme.palette.text.primary}>Recent Activity</Typography>
                        </Box>
                        <Button
                            component={Link}
                            to="/teacher/notifications"
                            endIcon={<ArrowForwardIcon />}
                            size="small"
                        >
                            View All
                        </Button>
                    </Box>
                    {teacherNotifications.length > 0 ? (
                        <List disablePadding>
                            {teacherNotifications.map((notif, index) => (
                                <Box key={notif.id}>
                                    <ListItem alignItems="flex-start" disablePadding sx={{ py: 1.5 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{
                                                bgcolor: notif.type === NOTIFICATION_TYPES.REQUEST_APPROVED ? 'success.light' :
                                                    notif.type === NOTIFICATION_TYPES.REQUEST_REFUSED ? 'error.light' : 'info.light',
                                                color: notif.type === NOTIFICATION_TYPES.REQUEST_APPROVED ? 'success.main' :
                                                    notif.type === NOTIFICATION_TYPES.REQUEST_REFUSED ? 'error.main' : 'info.main'
                                            }}>
                                                {notif.type === NOTIFICATION_TYPES.REQUEST_APPROVED ? <CheckCircleIcon /> :
                                                    notif.type === NOTIFICATION_TYPES.REQUEST_REFUSED ? <CancelIcon /> : <EventNoteIcon />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight={notif.read ? 500 : 700}>
                                                        {notif.title}
                                                    </Typography>
                                                    {!notif.read && <Chip label="New" size="small" color="error" sx={{ height: 18, fontSize: '0.6rem' }} />}
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        {notif.message}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.disabled">
                                                        {new Date(notif.date).toLocaleDateString()}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < teacherNotifications.length - 1 && <Divider component="li" />}
                                </Box>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{
                            p: 6,
                            bgcolor: theme.palette.action.hover,
                            borderRadius: 4,
                            border: `2px dashed ${theme.palette.divider}`,
                            textAlign: 'center',
                            color: theme.palette.text.secondary
                        }}>
                            <Typography fontWeight="500">No recent notifications to display.</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>You'll see updates here when your exam requests are processed.</Typography>
                        </Box>
                    )}
                </GlassmorphicCard>
            </Grow>
        </Box>
    );
}
