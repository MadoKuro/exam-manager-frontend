import { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Stack, MenuItem, Grow } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader } from '../../../components/admin';
import { GLASSMORPHISM } from '../../../theme/themeConstants';

export default function ModuleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { modulesCrud, semesters, teachers } = useAdminData();
    const { notify } = useNotification();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        semesterId: '',
        teacherId: ''
    });
    const isEditing = Boolean(id);

    useEffect(() => {
        if (id) {
            const module = modulesCrud.getById(Number(id));
            if (module) {
                setFormData({
                    name: module.name,
                    code: module.code,
                    semesterId: module.semesterId,
                    teacherId: module.teacherId,
                });
            }
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.code || !formData.semesterId || !formData.teacherId) {
            notify('Please fill all fields', 'error');
            return;
        }

        if (isEditing) {
            modulesCrud.update(Number(id), formData);
            notify('Module updated successfully', 'success');
        } else {
            modulesCrud.add(formData);
            notify('Module added successfully', 'success');
        }
        navigate('/admin/modules');
    };

    return (
        <Box>
            <AdminPageHeader
                title={isEditing ? 'Edit Module' : 'Add Module'}
                subtitle={isEditing ? 'Update module information' : 'Create a new module'}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/modules')}
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
                                label="Module Code"
                                placeholder="e.g., ALG101"
                                fullWidth
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                            <TextField
                                label="Module Name"
                                placeholder="e.g., Algorithmics"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <TextField
                                select
                                label="Semester"
                                fullWidth
                                value={formData.semesterId}
                                onChange={(e) => setFormData({ ...formData, semesterId: Number(e.target.value) })}
                                required
                            >
                                {semesters.map((semester) => (
                                    <MenuItem key={semester.id} value={semester.id}>
                                        {semester.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Responsible Teacher"
                                fullWidth
                                value={formData.teacherId}
                                onChange={(e) => setFormData({ ...formData, teacherId: Number(e.target.value) })}
                                required
                            >
                                {teachers.map((teacher) => (
                                    <MenuItem key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/admin/modules')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ borderRadius: 2 }}
                                >
                                    {isEditing ? 'Update Module' : 'Add Module'}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            </Grow>
        </Box>
    );
}
