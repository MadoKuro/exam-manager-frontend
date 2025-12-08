import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grow from '@mui/material/Grow';

import EventIcon from '@mui/icons-material/Event';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ClassIcon from '@mui/icons-material/Class';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
    // Mock Data
    const nextExam = {
        module: 'Algorithmics 2',
        date: '12 Jan 2026',
        time: '10:00 - 12:00',
        room: 'Room 23',
        teacher: 'Mr. X',
    };

    const notifications = [
        { id: 1, title: 'Room Change', message: 'Algo 2 exam moved to Room 23', date: '2 hrs ago', type: 'warning' },
        { id: 2, title: 'New Exam Added', message: 'Database final exam scheduled', date: '1 day ago', type: 'info' },
    ];

    const modules = [
        { name: 'Algorithmics 2', teacher: 'Mr. X' },
        { name: 'Web Development', teacher: 'Mrs. Y' },
        { name: 'Databases', teacher: 'Mr. Z' },
        { name: 'Mathematics', teacher: 'Mrs. A' },
    ];

    const cardHoverStyle = {
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)'
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grow in={true} timeout={500}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                    Welcome back, Student
                </Typography>
            </Grow>

            <Grid container spacing={3}>
                {/* (A) Next Exam */}
                <Grid item xs={12} md={6} lg={4}>
                    <Grow in={true} timeout={800}>
                        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible', ...cardHoverStyle }}>
                            <Box sx={{
                                position: 'absolute',
                                top: -10,
                                right: 20,
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                borderRadius: '50%',
                                width: 50,
                                height: 50,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                            }}>
                                <EventIcon sx={{ color: 'white' }} />
                            </Box>
                            <CardContent sx={{ pt: 3 }}>
                                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                                    Upcoming Exam
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
                                    {nextExam.module}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EventIcon fontSize="small" color="primary" />
                                        <Typography variant="body2">{nextExam.date}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon fontSize="small" color="primary" />
                                        <Typography variant="body2">{nextExam.time}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOnIcon fontSize="small" color="primary" />
                                        <Typography variant="body2">{nextExam.room}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon fontSize="small" color="primary" />
                                        <Typography variant="body2">{nextExam.teacher}</Typography>
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
                        </Card>
                    </Grow>
                </Grid>

                {/* (B) Latest Notifications */}
                <Grid item xs={12} md={6} lg={4}>
                    <Grow in={true} timeout={1200}>
                        <Card sx={{ height: '100%', ...cardHoverStyle }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                    <NotificationsActiveIcon color="warning" />
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
                                                            {index === 0 && <Chip label="New" size="small" color="error" sx={{ height: 20, fontSize: '0.65rem' }} />}
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'block', my: 0.5 }}>
                                                                {notif.message}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.disabled">
                                                                {notif.date}
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
                        </Card>
                    </Grow>
                </Grid>

                {/* (C) Semester Modules */}
                <Grid item xs={12} md={12} lg={4}>
                    <Grow in={true} timeout={1600}>
                        <Card sx={{ height: '100%', ...cardHoverStyle }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                    <ClassIcon color="info" />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        My Modules
                                    </Typography>
                                </Box>
                                <List>
                                    {modules.map((mod) => (
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
                        </Card>
                    </Grow>
                </Grid>
            </Grid>
        </Box>
    );
}
