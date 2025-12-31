import { useMemo } from 'react';
import { Box, Typography, Grid, CardContent, Button, List, ListItem, ListItemText, Chip, Divider, Grow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ClassIcon from '@mui/icons-material/Class';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { COLORS } from '../../theme/themeConstants';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { useUserNotifications } from '../../context/UserNotificationsContext';
import { GlassmorphicCard } from '../../components/admin';

export default function StudentDashboard() {
    const theme = useTheme();
    const { user } = useAuth();
    const { exams, modules, teachers, rooms } = useAdminData();
    const { getNotificationsForUser } = useUserNotifications();

    // Get notifications from context for this student (latest 3)
    const notifications = getNotificationsForUser('student', user?.id).slice(0, 3);

    // Get display name from user context
    const displayName = user?.name?.split(' ')[0] || 'Student';

    // Helpers for lookups
    const getModuleName = (moduleId) => modules.find(m => m.id === moduleId)?.name || 'Unknown';
    const getTeacherName = (moduleId) => {
        const mod = modules.find(m => m.id === moduleId);
        return teachers.find(t => t.id === mod?.teacherId)?.name || 'TBD';
    };
    const getRoomName = (roomIds) => roomIds?.length ? rooms.find(r => r.id === roomIds[0])?.name : 'TBD';

    // Compute next upcoming exam from context
    const nextExam = useMemo(() => {
        const today = new Date();
        const upcoming = exams
            .filter(e => new Date(e.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

        if (!upcoming) return null;

        const endTime = (() => {
            const [h, m] = upcoming.startTime.split(':').map(Number);
            const total = h * 60 + m + upcoming.duration;
            return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
        })();

        return {
            module: getModuleName(upcoming.moduleId),
            date: new Date(upcoming.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: `${upcoming.startTime} - ${endTime}`,
            room: getRoomName(upcoming.roomIds),
            teacher: getTeacherName(upcoming.moduleId),
        };
    }, [exams, modules, teachers, rooms]);

    // Module list for display
    const moduleList = useMemo(() => modules.slice(0, 4).map(m => ({
        name: m.name,
        teacher: getTeacherName(m.id)
    })), [modules, teachers]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grow in={true} timeout={500}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                    Welcome back, {displayName}
                </Typography>
            </Grow>

            <Grid container spacing={3}>
                {/* (A) Next Exam */}
                <Grid item xs={12} md={6} lg={4}>
                    <Grow in={true} timeout={800}>
                        <GlassmorphicCard
                            hoverEffect="lift"
                            sx={{
                                height: '100%',
                                position: 'relative',
                                overflow: 'visible',
                            }}
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: -10,
                                right: 20,
                                background: `linear-gradient(135deg, ${COLORS.primaryMain} 0%, ${COLORS.secondaryMain} 100%)`,
                                borderRadius: '50%',
                                width: 50,
                                height: 50,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
                            }}>
                                <EventIcon sx={{ color: 'white' }} />
                            </Box>
                            <CardContent sx={{ pt: 3 }}>
                                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                                    Upcoming Exam
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
                                    {nextExam?.module || 'No upcoming exams'}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EventIcon fontSize="small" sx={{ color: COLORS.primaryMain }} />
                                        <Typography variant="body2">{nextExam?.date || '-'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon fontSize="small" sx={{ color: COLORS.primaryMain }} />
                                        <Typography variant="body2">{nextExam?.time || '-'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOnIcon fontSize="small" sx={{ color: COLORS.primaryMain }} />
                                        <Typography variant="body2">{nextExam?.room || '-'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon fontSize="small" sx={{ color: COLORS.primaryMain }} />
                                        <Typography variant="body2">{nextExam?.teacher || '-'}</Typography>
                                    </Box>
                                </Box>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mt: 3, borderRadius: '12px', borderColor: 'divider', color: 'text.primary' }}
                                    component={Link}
                                    to="/student/schedule"
                                >
                                    View Full Schedule
                                </Button>
                            </CardContent>
                        </GlassmorphicCard>
                    </Grow>
                </Grid>

                {/* (B) Latest Notifications */}
                <Grid item xs={12} md={6} lg={4}>
                    <Grow in={true} timeout={1200}>
                        <GlassmorphicCard hoverEffect="lift" sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                    <NotificationsActiveIcon sx={{ color: COLORS.warningMain }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        Latest Updates
                                    </Typography>
                                </Box>
                                <List disablePadding>
                                    {notifications.map((notif, index) => (
                                        <Box key={notif.id}>
                                            <ListItem alignItems="flex-start" disablePadding sx={{ py: 1 }}>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                {notif.title}
                                                            </Typography>
                                                            {!notif.read && <Chip label="New" size="small" color="error" sx={{ height: 20, fontSize: '0.65rem' }} />}
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'block', my: 0.5 }}>
                                                                {notif.message}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.disabled">
                                                                {new Date(notif.date).toLocaleDateString()}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            {index < notifications.length - 1 && <Divider component="li" />}
                                        </Box>
                                    ))}
                                </List>
                                <Button
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ mt: 2 }}
                                    component={Link}
                                    to="/student/notifications"
                                >
                                    View All
                                </Button>
                            </CardContent>
                        </GlassmorphicCard>
                    </Grow>
                </Grid>

                {/* (C) Semester Modules */}
                <Grid item xs={12} md={12} lg={4}>
                    <Grow in={true} timeout={1600}>
                        <GlassmorphicCard hoverEffect="lift" sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                    <ClassIcon color="info" />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        My Modules
                                    </Typography>
                                </Box>
                                <List>
                                    {moduleList.map((mod) => (
                                        <ListItem key={mod.name} disablePadding sx={{ py: 1 }}>
                                            <Grid container alignItems="center">
                                                <Grid item xs={8}>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{mod.name}</Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography variant="body2" color="text.secondary" align="right">{mod.teacher}</Typography>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </GlassmorphicCard>
                    </Grow>
                </Grid>
            </Grid>
        </Box>
    );
}
