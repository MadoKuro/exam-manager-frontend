<<<<<<< HEAD
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
=======
import { Box, Typography, Grid, Card, CardContent, Avatar, Paper, IconButton, Grow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupIcon from '@mui/icons-material/Group';
<<<<<<< HEAD
import Avatar from '@mui/material/Avatar';
import Grow from '@mui/material/Grow';

const stats = [
    { title: 'Total Classes', value: '4', icon: <GroupIcon />, color: '#10b981' },
    { title: 'Pending Requests', value: '2', icon: <EventNoteIcon />, color: '#f59e0b' },
    { title: 'Upcoming Exams', value: '3', icon: <AccessTimeIcon />, color: '#3b82f6' },
];

export default function TeacherDashboard() {
=======
import { GLASSMORPHISM, ANIMATIONS, COLORS } from '../../theme/themeConstants';

const stats = [
    { title: 'Total Classes', value: '4', icon: <GroupIcon />, color: COLORS.primaryMain },
    { title: 'Pending Requests', value: '2', icon: <EventNoteIcon />, color: COLORS.warningMain },
    { title: 'Upcoming Exams', value: '3', icon: <AccessTimeIcon />, color: COLORS.secondaryMain },
];

export default function TeacherDashboard() {
    const theme = useTheme();
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h3" fontWeight="900" gutterBottom sx={{
<<<<<<< HEAD
                    color: '#064e3b', // Deep Dark Green
=======
                    color: theme.palette.text.primary,
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
                    letterSpacing: '-1px'
                }}>
                    Welcome back, Teacher!
                </Typography>
<<<<<<< HEAD
                <Typography variant="h6" sx={{ color: '#059669', opacity: 0.8 }}>
=======
                <Typography variant="h6" sx={{ color: COLORS.primaryMain, opacity: 0.8 }}>
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
                    Your academic command center.
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 5 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Grow in={true} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
                            <Card
                                sx={{
                                    borderRadius: '24px',
<<<<<<< HEAD
                                    background: 'rgba(255, 255, 255, 0.7)', // White Glass
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    color: '#1f2937',
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.27), box-shadow 0.4s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)', // Greenish shadow
                                        borderColor: '#10b981'
=======
                                    background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                                    backdropFilter: GLASSMORPHISM.card.blur,
                                    border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    color: theme.palette.text.primary,
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: `transform ${ANIMATIONS.duration.slow} ${ANIMATIONS.easing.springy}, box-shadow ${ANIMATIONS.duration.slow}`,
                                    '&:hover': {
                                        transform: ANIMATIONS.hover.translateY,
                                        boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)',
                                        borderColor: COLORS.secondaryMain
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
                                    }
                                }}
                            >
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, textAlign: 'center' }}>
                                    <Avatar
                                        sx={{
<<<<<<< HEAD
                                            bgcolor: `${stat.color}15`, // Very light background of the color 
=======
                                            bgcolor: `${stat.color}15`,
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
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
<<<<<<< HEAD
                                    <Typography variant="h2" fontWeight="800" sx={{ mb: 0, color: '#111827' }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>
=======
                                    <Typography variant="h2" fontWeight="800" sx={{ mb: 0, color: theme.palette.text.primary }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
                                        {stat.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grow>
                    </Grid>
                ))}
            </Grid>

            <Grow in={true} timeout={1000} style={{ transitionDelay: '800ms' }}>
                <Paper
                    sx={{
                        p: 4,
                        borderRadius: '24px',
<<<<<<< HEAD
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
=======
                        background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                        backdropFilter: GLASSMORPHISM.card.blur,
                        border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
<<<<<<< HEAD
                            <Box sx={{ width: 4, height: 24, bgcolor: '#10b981', borderRadius: 2 }} />
                            <Typography variant="h5" fontWeight="bold" color="#111827">Recent Activity</Typography>
=======
                            <Box sx={{ width: 4, height: 24, background: `linear-gradient(to bottom, ${COLORS.primaryMain}, ${COLORS.secondaryMain})`, borderRadius: 2 }} />
                            <Typography variant="h5" fontWeight="bold" color={theme.palette.text.primary}>Recent Activity</Typography>
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
                        </Box>
                        <IconButton size="small"><MoreVertIcon /></IconButton>
                    </Box>
                    <Box sx={{
                        p: 6,
<<<<<<< HEAD
                        bgcolor: '#f9fafb',
                        borderRadius: 4,
                        border: '2px dashed #e5e7eb',
                        textAlign: 'center',
                        color: '#9ca3af'
=======
                        bgcolor: theme.palette.action.hover,
                        borderRadius: 4,
                        border: `2px dashed ${theme.palette.divider}`,
                        textAlign: 'center',
                        color: theme.palette.text.secondary
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
                    }}>
                        <Typography fontWeight="500">No recent notifications to display.</Typography>
                    </Box>
                </Paper>
            </Grow>
        </Box>
    );
}
