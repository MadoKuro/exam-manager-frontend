import { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Stack, MenuItem, Grow } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader } from '../../../components/admin';
import { GLASSMORPHISM } from '../../../theme/themeConstants';

export default function StudentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { studentsCrud, levels, groups } = useAdminData();
    const { notify } = useNotification();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        levelId: '',
        specialization: '',
        groupId: ''
    });
    const isEditing = Boolean(id);

    // Filter groups by selected level
    const filteredGroups = groups.filter(g => g.levelId === formData.levelId);

    useEffect(() => {
        if (id) {
            const student = studentsCrud.getById(Number(id));
            if (student) {
                setFormData({
                    name: student.name,
                    email: student.email,
                    levelId: student.levelId,
                    specialization: student.specialization,
                    groupId: student.groupId,
                });
            }
        }
    }, [id]);

    const handleLevelChange = (levelId) => {
        setFormData({ ...formData, levelId: Number(levelId), groupId: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.levelId || !formData.groupId) {
            notify('Please fill all required fields', 'error');
            return;
        }

        if (isEditing) {
            studentsCrud.update(Number(id), formData);
            notify('Student updated successfully', 'success');
        } else {
            studentsCrud.add(formData);
            notify('Student added successfully', 'success');
        }
        navigate('/admin/students');
    };

    return (
        <Box>
            <AdminPageHeader
                title={isEditing ? 'Edit Student' : 'Add Student'}
                subtitle={isEditing ? 'Update student information' : 'Create a new student record'}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/students')}
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
                                placeholder="e.g., Mohamed Amine"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <TextField
                                label="Email Address"
                                type="email"
                                placeholder="e.g., student@student.edu"
                                fullWidth
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <TextField
                                select
                                label="Level"
                                fullWidth
                                value={formData.levelId}
                                onChange={(e) => handleLevelChange(e.target.value)}
                                required
                            >
                                {levels.map((level) => (
                                    <MenuItem key={level.id} value={level.id}>
                                        {level.name} ({level.code})
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Specialization"
                                placeholder="e.g., Computer Science"
                                fullWidth
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            />
                            <TextField
                                select
                                label="Group"
                                fullWidth
                                value={formData.groupId}
                                onChange={(e) => setFormData({ ...formData, groupId: Number(e.target.value) })}
                                required
                                disabled={!formData.levelId}
                                helperText={!formData.levelId ? 'Select a level first' : ''}
                            >
                                {filteredGroups.map((group) => (
                                    <MenuItem key={group.id} value={group.id}>
                                        {group.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/admin/students')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ borderRadius: 2 }}
                                >
                                    {isEditing ? 'Update Student' : 'Add Student'}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            </Grow>
        </Box>
    );
}
