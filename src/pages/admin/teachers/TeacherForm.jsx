import { useState, useEffect, useMemo } from 'react';
import { Box, TextField, Button, Paper, Stack, Grow, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader } from '../../../components/admin';
import AutocompleteSelect from '../../../components/AutocompleteSelect';
import { GLASSMORPHISM } from '../../../theme/themeConstants';

export default function TeacherForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { teachers, teachersCrud } = useAdminData();
    const { notify } = useNotification();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        phone: '',
        office: ''
    });
    const isEditing = Boolean(id);

    // Extract unique departments and offices from existing teachers for autocomplete
    const departmentOptions = useMemo(() => {
        const uniqueDepts = [...new Set(
            teachers
                .map(t => t.department)
                .filter(d => d && d.trim() !== '')
        )];
        return uniqueDepts.map(d => ({ label: d, value: d }));
    }, [teachers]);

    const officeOptions = useMemo(() => {
        const uniqueOffices = [...new Set(
            teachers
                .map(t => t.office)
                .filter(o => o && o.trim() !== '')
        )];
        return uniqueOffices.map(o => ({ label: o, value: o }));
    }, [teachers]);

    useEffect(() => {
        if (id) {
            const teacher = teachersCrud.getById(Number(id));
            if (teacher) {
                setFormData({
                    name: teacher.name || '',
                    email: teacher.email || '',
                    department: teacher.department || '',
                    phone: teacher.phone || '',
                    office: teacher.office || ''
                });
            }
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            notify('Please fill required fields (Name and Email)', 'error');
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
                        maxWidth: 700,
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* Name and Email Row */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Full Name"
                                        placeholder="e.g., Dr. Ahmed Benali"
                                        fullWidth
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Email Address"
                                        type="email"
                                        placeholder="e.g., ahmed.benali@uni.edu"
                                        fullWidth
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </Grid>
                            </Grid>

                            {/* Phone Number - Full width like Student Number */}
                            <TextField
                                label="Phone Number"
                                placeholder="e.g., +213 555 123 456"
                                fullWidth
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />

                            {/* Department - Autocomplete (like Level in StudentForm) */}
                            <AutocompleteSelect
                                options={departmentOptions}
                                value={departmentOptions.find(d => d.value === formData.department) || (formData.department ? { label: formData.department, value: formData.department } : null)}
                                onChange={(newValue) => {
                                    const dept = newValue?.value || newValue?.label || (typeof newValue === 'string' ? newValue : '');
                                    setFormData({ ...formData, department: dept });
                                }}
                                label="Department"
                                getOptionLabel={(option) => option?.label || option || ''}
                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                placeholder="Search or type department..."
                                freeSolo
                            />

                            {/* Office - Autocomplete (like Specialization in StudentForm) */}
                            <AutocompleteSelect
                                options={officeOptions}
                                value={officeOptions.find(o => o.value === formData.office) || (formData.office ? { label: formData.office, value: formData.office } : null)}
                                onChange={(newValue) => {
                                    const office = newValue?.value || newValue?.label || (typeof newValue === 'string' ? newValue : '');
                                    setFormData({ ...formData, office: office });
                                }}
                                label="Office"
                                getOptionLabel={(option) => option?.label || option || ''}
                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                placeholder="Search or type office..."
                                freeSolo
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
