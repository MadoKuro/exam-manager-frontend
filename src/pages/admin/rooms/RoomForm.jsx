import { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Stack, Grow } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader } from '../../../components/admin';
import { GLASSMORPHISM } from '../../../theme/themeConstants';

export default function RoomForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { roomsCrud } = useAdminData();
    const { notify } = useNotification();

    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        location: ''
    });
    const isEditing = Boolean(id);

    useEffect(() => {
        if (id) {
            const room = roomsCrud.getById(Number(id));
            if (room) {
                setFormData({
                    name: room.name,
                    capacity: room.capacity,
                    location: room.location,
                });
            }
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.capacity || !formData.location) {
            notify('Please fill all fields', 'error');
            return;
        }

        const dataToSave = { ...formData, capacity: Number(formData.capacity) };

        if (isEditing) {
            roomsCrud.update(Number(id), dataToSave);
            notify('Room updated successfully', 'success');
        } else {
            roomsCrud.add(dataToSave);
            notify('Room added successfully', 'success');
        }
        navigate('/admin/rooms');
    };

    return (
        <Box>
            <AdminPageHeader
                title={isEditing ? 'Edit Room' : 'Add Room'}
                subtitle={isEditing ? 'Update room information' : 'Create a new room'}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/rooms')}
                    sx={{ mr: 1 }}
                >
                    Back
                </Button>
            </AdminPageHeader>

            <Grow in={true}>
                <Paper
                    sx={{
                        p: 4,
                        borderRadius: '24px',
                        background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                        backdropFilter: GLASSMORPHISM.card.blur,
                        border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                        maxWidth: 600,
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Room Name"
                                placeholder="e.g., Room 101, Lab 2"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <TextField
                                label="Capacity"
                                type="number"
                                placeholder="e.g., 40"
                                fullWidth
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                required
                                inputProps={{ min: 1 }}
                            />
                            <TextField
                                label="Location"
                                placeholder="e.g., Building A, Floor 1"
                                fullWidth
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/admin/rooms')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ borderRadius: 2 }}
                                >
                                    {isEditing ? 'Update Room' : 'Add Room'}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            </Grow>
        </Box>
    );
}
