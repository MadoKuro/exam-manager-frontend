import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Grow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import { useExamRequests } from '../../context/ExamRequestContext';
import { useAuth } from '../../context/AuthContext';
import { GLASSMORPHISM, ANIMATIONS, COLORS } from '../../theme/themeConstants';

export default function TeacherSchedule() {
    const { requests } = useExamRequests();
    const { user } = useAuth();
    const theme = useTheme();

    // Filter only Approved exams for this teacher
    const schedule = requests.filter(
        req => req.status === 'Approved' && req.teacherId === user?.id
    );

    // Sort by date/time
    schedule.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h3" fontWeight="900" sx={{ color: theme.palette.text.primary, letterSpacing: '-1px' }}>
                    Exam Schedule
                </Typography>
                <Typography variant="h6" sx={{ color: COLORS.primaryMain, opacity: 0.8 }}>
                    Your confirmed upcoming sessions.
                </Typography>
            </Box>

            {schedule.length > 0 ? (
                <Grid container spacing={4}>
                    {schedule.map((exam, index) => (
                        <Grid item xs={12} key={exam.id}>
                            <Grow in={true} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
                                <Card sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    borderRadius: '24px',
                                    border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                                    background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                                    backdropFilter: GLASSMORPHISM.card.blur,
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                    overflow: 'hidden',
                                    transition: `transform ${ANIMATIONS.duration.normal}, box-shadow ${ANIMATIONS.duration.normal}`,
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(139, 92, 246, 0.1)',
                                        borderColor: COLORS.secondaryMain
                                    }
                                }}>
                                    {/* Left Stripe */}
                                    <Box sx={{
                                        width: { xs: '100%', sm: '8px' },
                                        height: { xs: '8px', sm: 'auto' },
                                        background: `linear-gradient(to bottom, ${COLORS.primaryMain}, ${COLORS.secondaryMain})`
                                    }} />

                                    {/* Date Block */}
                                    <Box sx={{
                                        p: 3,
                                        minWidth: 120,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: `${COLORS.primaryMain}0D`,
                                        borderRight: { sm: `1px dashed ${COLORS.primaryMain}33` }
                                    }}>
                                        <Typography variant="h4" fontWeight="800" color={COLORS.primaryMain}>
                                            {new Date(exam.date).getDate()}
                                        </Typography>
                                        <Typography variant="subtitle2" fontWeight="bold" color={COLORS.primaryMain} textTransform="uppercase">
                                            {new Date(exam.date).toLocaleString('default', { month: 'short' })}
                                        </Typography>
                                    </Box>

                                    {/* Details */}
                                    <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h5" fontWeight="800" color={theme.palette.text.primary}>
                                                {exam.module}
                                            </Typography>
                                            <Chip label="Confirmed" color="success" size="small" sx={{ borderRadius: 1, fontWeight: 700 }} />
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.secondary }}>
                                                    <AccessTimeIcon fontSize="small" sx={{ color: COLORS.primaryMain }} />
                                                    <Typography fontWeight="500">{exam.time} ({exam.duration}m)</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.secondary }}>
                                                    <RoomIcon fontSize="small" sx={{ color: COLORS.primaryMain }} />
                                                    <Typography fontWeight="500">Room: {exam.room}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grow>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: '24px',
                    background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                    border: `1px dashed ${theme.palette.divider}`
                }}>
                    <CalendarTodayIcon sx={{ fontSize: 60, color: theme.palette.action.disabled, mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No upcoming exams scheduled.</Typography>
                    <Typography variant="body2" color="text.secondary">check back later or create a request.</Typography>
                </Paper>
            )}
        </Box>
    );
}
