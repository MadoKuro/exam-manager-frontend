import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import Grow from '@mui/material/Grow';
import { useExamRequests } from '../../context/ExamRequestContext';

export default function TeacherSchedule() {
    const { requests } = useExamRequests();

    // Filter only Approved exams
    const schedule = requests.filter(req => req.status === 'Approved');

    // Sort by date/time
    schedule.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h3" fontWeight="900" sx={{ color: '#064e3b', letterSpacing: '-1px' }}>
                    Exam Schedule
                </Typography>
                <Typography variant="h6" sx={{ color: '#059669', opacity: 0.8 }}>
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
                                    border: '1px solid rgba(255,255,255,0.8)',
                                    background: 'rgba(255, 255, 255, 0.7)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(16, 185, 129, 0.1)',
                                        borderColor: '#10b981'
                                    }
                                }}>
                                    {/* Left Stripe */}
                                    <Box sx={{
                                        width: { xs: '100%', sm: '8px' },
                                        height: { xs: '8px', sm: 'auto' },
                                        bgcolor: '#10b981'
                                    }} />

                                    {/* Date Block */}
                                    <Box sx={{
                                        p: 3,
                                        minWidth: 120,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(16, 185, 129, 0.05)',
                                        borderRight: { sm: '1px dashed rgba(16, 185, 129, 0.2)' }
                                    }}>
                                        <Typography variant="h4" fontWeight="800" color="#059669">
                                            {new Date(exam.date).getDate()}
                                        </Typography>
                                        <Typography variant="subtitle2" fontWeight="bold" color="#059669" textTransform="uppercase">
                                            {new Date(exam.date).toLocaleString('default', { month: 'short' })}
                                        </Typography>
                                    </Box>

                                    {/* Details */}
                                    <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h5" fontWeight="800" color="#1f2937">
                                                {exam.module}
                                            </Typography>
                                            <Chip label="Confirmed" color="success" size="small" sx={{ borderRadius: 1, fontWeight: 700 }} />
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4b5563' }}>
                                                    <AccessTimeIcon fontSize="small" sx={{ color: '#10b981' }} />
                                                    <Typography fontWeight="500">{exam.time} ({exam.duration}m)</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4b5563' }}>
                                                    <RoomIcon fontSize="small" sx={{ color: '#10b981' }} />
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
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px dashed rgba(0,0,0,0.1)'
                }}>
                    <CalendarTodayIcon sx={{ fontSize: 60, color: '#d1fae5', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No upcoming exams scheduled.</Typography>
                    <Typography variant="body2" color="text.secondary">check back later or create a request.</Typography>
                </Paper>
            )}
        </Box>
    );
}
