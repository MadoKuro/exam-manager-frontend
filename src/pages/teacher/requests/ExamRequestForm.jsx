import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import { useExamRequests } from '../../../context/ExamRequestContext';
import { useNotification } from '../../../context/NotificationContext';

const myModules = ['CS101', 'DB201', 'ALG102'];

export default function ExamRequestForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // Check if editing
    const { addRequest, editRequest, getAvailableRooms, getRequestById } = useExamRequests();
    const { notify } = useNotification();

    const isEditMode = !!id;

    // Form State
    const [formData, setFormData] = useState({
        module: '',
        date: '',
        time: '',
        duration: 120,
        room: '',
    });

    const [availableRooms, setAvailableRooms] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Load data if editing
    useEffect(() => {
        if (isEditMode) {
            const req = getRequestById(id);
            if (req) {
                setFormData({
                    module: req.module,
                    date: req.date,
                    time: req.time,
                    duration: req.duration,
                    room: req.room
                });
            } else {
                navigate('/teacher/requests'); // Not found
            }
        }
    }, [id, isEditMode, getRequestById, navigate]);

    // Effect: Update available rooms logic
    useEffect(() => {
        if (formData.date && formData.time && formData.duration) {
            const rooms = getAvailableRooms(formData.date, formData.time, formData.duration);
            setAvailableRooms(rooms);

            // If currently selected room is no longer available (and we aren't just loading the initial edit data)
            // Logic: Is the room in the list?
            if (formData.room) {
                const isStillAvailable = rooms.find(r => r.id === formData.room);
                // In edit mode, the CURRENT room might be "occupied" by THIS request technically,
                // but getAvailableRooms filters by APPROVED requests. Since this request is Pending (editable),
                // it shouldn't block itself. So this logic is fine.
                if (!isStillAvailable) {
                    // Only clear if user changed something that made it unavailable
                    // But wait, if I'm editing, maybe I want to keep my room? 
                    // For now, if it's not in the list, clear it to force valid selection.
                    setFormData(prev => ({ ...prev, room: '' }));
                }
            }
        } else {
            setAvailableRooms([]);
        }
    }, [formData.date, formData.time, formData.duration]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDay();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 3 Days Rule
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);
        const selectedDate = new Date(dateString);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < threeDaysFromNow) {
            return 'Exams must be scheduled at least 3 days in advance.';
        }

        if (day === 0 || day === 6) {
            return 'Exams cannot be scheduled on weekends (Saturday/Sunday).';
        }
        return null;
    };

    const validateTime = (timeString) => {
        if (!timeString) return null;
        const [hours, minutes] = timeString.split(':').map(Number);
        const timeValue = hours * 60 + minutes;

        const morningStart = 8 * 60 + 30; // 08:30
        const morningEnd = 13 * 60;       // 13:00
        const afternoonStart = 13 * 60;   // 13:00
        const afternoonEnd = 17 * 60;     // 17:00

        const duration = Number(formData.duration);
        const examEnd = timeValue + duration;

        const inMorning = (timeValue >= morningStart && examEnd <= morningEnd);
        const inAfternoon = (timeValue >= afternoonStart && examEnd <= afternoonEnd);

        if (!inMorning && !inAfternoon) {
            return 'Exams must be scheduled between 08:30-13:00 OR 13:00-17:00.';
        }
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dateError = validateDate(formData.date);
        if (dateError) {
            setError(dateError);
            return;
        }

        const timeError = validateTime(formData.time);
        if (timeError) {
            setError(timeError);
            return;
        }

        if (!formData.room) {
            setError('Please select a room.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            if (isEditMode) {
                editRequest(id, formData);
                notify('Exam request updated successfully!', 'success');
            } else {
                addRequest(formData);
                notify('Exam request submitted successfully!', 'success');
            }
            setLoading(false);
            navigate('/teacher/requests');
        }, 800);
    };

    return (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Paper sx={{
                p: 5,
                maxWidth: 700,
                mx: 'auto',
                borderRadius: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.6)'
            }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: '800', color: '#064e3b' }}>
                    {isEditMode ? 'Edit Exam Request' : 'Request New Exam'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: '#059669' }}>
                    {isEditMode ? 'Modify your pending request details.' : 'Select a time slot to see available rooms.'}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    {error && (
                        <Slide direction="down" in={!!error}>
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                        </Slide>
                    )}

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Module"
                                name="module"
                                value={formData.module}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                            >
                                {myModules.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                                helperText="Must be at least 3 days in advance."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Duration (minutes)"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="time"
                                label="Start Time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                                inputProps={{ step: 300 }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label={formData.date && formData.time ? "Select Room" : "Select Date & Time first"}
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                                required
                                disabled={!formData.date || !formData.time || availableRooms.length === 0}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                            >
                                {availableRooms.length > 0 ? (
                                    availableRooms.map((room) => (
                                        <MenuItem key={room.id} value={room.id}>
                                            {room.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled value="">
                                        No rooms available
                                    </MenuItem>
                                )}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Alert severity="info" icon={false} sx={{ mt: 3, borderRadius: 3, bgcolor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Scheduling Rules:</Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.875rem' }}>
                            <li>Must be 3+ days in advance</li>
                            <li>08:30 - 13:00 OR 13:00 - 17:00</li>
                            <li>No Weekends</li>
                        </Box>
                    </Alert>

                    <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            onClick={() => navigate('/teacher/requests')}
                            sx={{ color: '#6b7280', fontWeight: 600 }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : (isEditMode ? <EditIcon /> : <SendIcon />)}
                            disabled={loading}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                py: 1.5,
                                fontWeight: 'bold',
                                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
                                bgcolor: '#10b981',
                                '&:hover': {
                                    bgcolor: '#059669',
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            {loading ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Request' : 'Submit Request')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Slide>
    );
}
