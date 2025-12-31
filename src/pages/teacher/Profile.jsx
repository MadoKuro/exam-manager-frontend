import { Box, Typography, Paper, Avatar, Grid, Card, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { GLASSMORPHISM } from '../../theme/themeConstants';

export default function TeacherProfile() {
    const { user } = useAuth();
    const { teachers, modules, students } = useAdminData();
    const theme = useTheme();

    // Find current teacher from context
    const currentTeacher = teachers.find(t => t.id === user?.id);

    // Filter modules assigned to this teacher
    const myModules = modules
        .filter(m => m.teacherId === user?.id)
        .map(m => ({
            id: m.code || `M${m.id}`,
            name: m.name,
            // Count students in groups that have this module (simplified)
            students: students.filter(s => s.levelId).length || 0
        }));


    return (
        <Box maxWidth="lg" sx={{ mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>My Profile</Typography>

            <Grid container spacing={4}>
                {/* Left Column: Personal Info */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: '20px',
                        background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                        backdropFilter: GLASSMORPHISM.card.blur,
                        border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                    }}>
                        <Avatar
                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '3rem' }}
                        >
                            {user?.name ? user.name[0] : 'T'}
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {currentTeacher?.name || user?.name || 'Teacher Name'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            Computer Science Department
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
                            <EmailIcon fontSize="small" />
                            <Typography variant="body2">{currentTeacher?.email || user?.email || 'teacher@university.edu'}</Typography>
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
                                <Card sx={{
                                    borderRadius: '16px',
                                    height: '100%',
                                    background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                                    backdropFilter: GLASSMORPHISM.card.blur,
                                    border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                                }} variant="outlined">
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
