import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../../context/AuthContext';

const myModules = [
    { id: 'CS101', name: 'Intro to Computer Science', students: 120 },
    { id: 'DB201', name: 'Database Systems', students: 85 },
    { id: 'ALG102', name: 'Algorithms & Data Structures', students: 90 },
];

export default function TeacherProfile() {
    const { user } = useAuth();

    return (
        <Box maxWidth="lg" sx={{ mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>My Profile</Typography>

            <Grid container spacing={4}>
                {/* Left Column: Personal Info */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                        <Avatar
                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '3rem' }}
                        >
                            {user?.name ? user.name[0] : 'T'}
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {user?.name || 'Teacher Name'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            Computer Science Department
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
                            <EmailIcon fontSize="small" />
                            <Typography variant="body2">teacher@university.edu</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Column: Modules */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">My Modules</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Modules you are responsible for.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {myModules.map((module) => (
                            <Grid item xs={12} sm={6} key={module.id}>
                                <Card sx={{ borderRadius: 3, height: '100%' }} variant="outlined">
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}>
                                                <SchoolIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">{module.id}</Typography>
                                                <Typography variant="caption" color="text.secondary">CODE</Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h6" gutterBottom>{module.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {module.students} Students Enrolled
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
