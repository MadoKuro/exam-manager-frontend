import { useState, useMemo } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Card, CardContent, Chip, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { useExamRequests } from '../../context/ExamRequestContext';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import AutocompleteSelect from '../../components/AutocompleteSelect';
import { GLASSMORPHISM, COLORS } from '../../theme/themeConstants';

export default function TeacherRequests() {
    const { requests, addRequest } = useExamRequests();
    const { notify } = useNotification();
    const { user } = useAuth();
    const { modules, loading: dataLoading } = useAdminData();
    const theme = useTheme();

    const [formData, setFormData] = useState({
        module: null,
        date: '',
        time: '',
        duration: '',
        room: ''
    });

    // Filter modules to only show those assigned to this teacher
    const teacherModules = useMemo(() => {
        if (!user?.teacher_id) return modules; // Show all if no teacher_id
        return modules.filter(m => m.teacher_id === user.teacher_id || m.teacherId === user.teacher_id);
    }, [modules, user?.teacher_id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.module || !formData.date || !formData.time || !formData.duration || !formData.room) {
            notify('Please fill in all fields', 'error');
            return;
        }

        // Use actual teacher ID and name from auth context
        // Send module name for display, module_id for backend
        addRequest({
            module: `${formData.module.code} - ${formData.module.name}`,
            moduleId: formData.module.id,
            date: formData.date,
            time: formData.time,
            duration: formData.duration,
            room: formData.room,
            teacherId: user?.id,
            teacherName: user?.name || 'Teacher'
        });

        notify('Exam request submitted successfully!', 'success');

        // Reset form
        setFormData({
            module: null,
            date: '',
            time: '',
            duration: '',
            room: ''
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Get teacher's requests only using actual user ID
    const myRequests = requests.filter(req => req.teacherId === user?.id);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Approved': return 'success';
            case 'Refused': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h3" fontWeight="900" sx={{ color: theme.palette.text.primary, letterSpacing: '-1px' }}>
                    Exam Requests
                </Typography>
                <Typography variant="h6" sx={{ color: COLORS.primaryMain, opacity: 0.8 }}>
                    Submit and manage your exam scheduling requests.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Request Form */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{
                        p: 4,
                        borderRadius: '24px',
                        background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                        backdropFilter: GLASSMORPHISM.card.blur,
                        border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                            New Request
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <AutocompleteSelect
                                    options={teacherModules}
                                    value={formData.module}
                                    onChange={(newValue) => setFormData({ ...formData, module: newValue })}
                                    label="Module"
                                    required
                                    loading={dataLoading}
                                    getOptionLabel={(option) => option ? `${option.code} - ${option.name}` : ''}
                                    renderOptionContent={(option) => (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip label={option.code} size="small" variant="outlined" />
                                            {option.name}
                                        </Box>
                                    )}
                                    placeholder="Search your modules..."
                                />
                                <TextField
                                    label="Date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Time"
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Duration (minutes)"
                                    name="duration"
                                    type="number"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="e.g., 120"
                                />
                                <TextField
                                    label="Preferred Room"
                                    name="room"
                                    value={formData.room}
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="e.g., Room 101, Amphitheater A"
                                    helperText="Enter your preferred room/location for the exam"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    endIcon={<SendIcon />}
                                    sx={{ mt: 2 }}
                                >
                                    Submit Request
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </Grid>

                {/* My Requests */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                        My Requests
                    </Typography>
                    <Stack spacing={2}>
                        {myRequests.length > 0 ? (
                            myRequests.map((req) => (
                                <Card key={req.id} sx={{
                                    borderRadius: '16px',
                                    background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                                    backdropFilter: GLASSMORPHISM.card.blur,
                                    border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {req.module}
                                            </Typography>
                                            <Chip
                                                label={req.status}
                                                color={getStatusColor(req.status)}
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Box>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">Date</Typography>
                                                <Typography variant="body2" fontWeight="500">{req.date}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">Time</Typography>
                                                <Typography variant="body2" fontWeight="500">{req.time}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">Duration</Typography>
                                                <Typography variant="body2" fontWeight="500">{req.duration} min</Typography>
                                            </Grid>
                                            {req.room && (
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary">Room</Typography>
                                                    <Typography variant="body2" fontWeight="500">{req.room}</Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                        {req.refusalReason && (
                                            <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                                                <Typography variant="caption" fontWeight="bold" color="error.dark">
                                                    Reason for refusal:
                                                </Typography>
                                                <Typography variant="body2" color="error.dark">
                                                    {req.refusalReason}
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px', bgcolor: theme.palette.action.hover }}>
                                <Typography color="text.secondary">No requests yet. Submit your first request!</Typography>
                            </Paper>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
