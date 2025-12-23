import { Box, Typography, Grid, Card, CardContent, Avatar, Paper, IconButton, Grow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GroupIcon from '@mui/icons-material/Group';
import { GLASSMORPHISM, ANIMATIONS, COLORS } from '../../theme/themeConstants';

const stats = [
    { title: 'Total Classes', value: '4', icon: <GroupIcon />, color: COLORS.primaryMain },
    { title: 'Pending Requests', value: '2', icon: <EventNoteIcon />, color: COLORS.warningMain },
    { title: 'Upcoming Exams', value: '3', icon: <AccessTimeIcon />, color: COLORS.secondaryMain },
];

export default function TeacherDashboard() {
    const theme = useTheme();

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h3" fontWeight="900" gutterBottom sx={{
                    color: theme.palette.text.primary,
                    letterSpacing: '-1px'
                }}>
                    Welcome back, Teacher!
                </Typography>
                <Typography variant="h6" sx={{ color: COLORS.primaryMain, opacity: 0.8 }}>
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
                                    }
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
                        background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                        backdropFilter: GLASSMORPHISM.card.blur,
                        border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 4, height: 24, background: `linear-gradient(to bottom, ${COLORS.primaryMain}, ${COLORS.secondaryMain})`, borderRadius: 2 }} />
                            <Typography variant="h5" fontWeight="bold" color={theme.palette.text.primary}>Recent Activity</Typography>
                        </Box>
                        <IconButton size="small"><MoreVertIcon /></IconButton>
                    </Box>
                    <Box sx={{
                        p: 6,
                        bgcolor: theme.palette.action.hover,
                        borderRadius: 4,
                        border: `2px dashed ${theme.palette.divider}`,
                        textAlign: 'center',
                        color: theme.palette.text.secondary
                    }}>
                        <Typography fontWeight="500">No recent notifications to display.</Typography>
                    </Box>
                </Paper>
            </Grow>
        </Box>
    );
}
