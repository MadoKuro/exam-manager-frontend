import { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Stack, Grow } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader } from '../../../components/admin';
import { GLASSMORPHISM } from '../../../theme/themeConstants';

export default function TeacherForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { teachersCrud } = useAdminData();
    const { notify } = useNotification();

    const [formData, setFormData] = useState({ name: '', email: '' });
    const isEditing = Boolean(id);

    useEffect(() => {
        if (id) {
            const teacher = teachersCrud.getById(Number(id));
            if (teacher) {
                setFormData({ name: teacher.name, email: teacher.email });
            }
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            notify('Please fill all fields', 'error');
            return;
        }

        if (isEditing) {
            teachersCrud.update(Number(id), formData);
            notify('Teacher updated successfully', 'success');
        } else {
            teachersCrud.add(formData);
            notify('Teacher added successfully', 'success');
        }
        navigate('/admin/teachers');
    };

    return (
        <Box>
            <AdminPageHeader
                title={isEditing ? 'Edit Teacher' : 'Add Teacher'}
                subtitle={isEditing ? 'Update teacher information' : 'Create a new teacher record'}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/teachers')}
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
                                label="Full Name"
                                placeholder="e.g., Dr. Ahmed Benali"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <TextField
                                label="Email Address"
                                type="email"
                                placeholder="e.g., ahmed.benali@uni.edu"
                                fullWidth
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/admin/teachers')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ borderRadius: 2 }}
                                >
                                    {isEditing ? 'Update Teacher' : 'Add Teacher'}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            </Grow>
        </Box>
    );
}
