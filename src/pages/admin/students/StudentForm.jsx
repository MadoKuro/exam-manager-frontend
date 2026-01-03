import { useState, useEffect, useMemo } from 'react';
import { Box, TextField, Button, Paper, Stack, Grow, Grid, Chip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader } from '../../../components/admin';
import AutocompleteSelect from '../../../components/AutocompleteSelect';
import { GLASSMORPHISM } from '../../../theme/themeConstants';

export default function StudentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { studentsCrud, levels, groups, specializations } = useAdminData();
    const { notify } = useNotification();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentNumber: '',
        level: null,
        specialization: null,
        group: null
    });
    const isEditing = Boolean(id);

    // Filter groups by selected level
    const filteredGroups = useMemo(() => {
        if (!formData.level) return [];
        const levelId = formData.level.id;
        return groups.filter(g => (g.levelId || g.level_id) === levelId);
    }, [groups, formData.level]);

    useEffect(() => {
        if (id) {
            const student = studentsCrud.getById(Number(id));
            if (student) {
                // Get levelId from group relationship if not directly available
                const studentLevelId = student.levelId || student.level_id || student.group?.level_id;
                const studentLevel = levels.find(l => l.id === studentLevelId) || null;
                const studentGroupId = student.groupId || student.group_id;
                const studentGroup = groups.find(g => g.id === studentGroupId) || null;
                // Find specialization object from specializations array
                const studentSpecId = student.specialization_id || student.specialization?.id;
                const studentSpec = specializations.find(s => s.id === studentSpecId) || null;

                setFormData({
                    name: student.name,
                    email: student.email,
                    studentNumber: student.studentNumber || student.student_number || '',
                    level: studentLevel,
                    specialization: studentSpec,
                    group: studentGroup
                });
            }
        }
    }, [id, levels, groups, specializations]);

    const handleLevelChange = (newLevel) => {
        setFormData({ ...formData, level: newLevel, group: null });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.studentNumber || !formData.level || !formData.group) {
            notify('Please fill all required fields', 'error');
            return;
        }

        // Prepare data for API
        const submitData = {
            name: formData.name,
            email: formData.email,
            studentNumber: formData.studentNumber,
            levelId: formData.level.id,
            groupId: formData.group.id,
            specializationId: formData.specialization?.id || null
        };

        if (isEditing) {
            studentsCrud.update(Number(id), submitData);
            notify('Student updated successfully', 'success');
        } else {
            studentsCrud.add(submitData);
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
                                        placeholder="e.g., Mohamed Amine"
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
                                        placeholder="e.g., student@student.edu"
                                        fullWidth
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </Grid>
                            </Grid>

                            {/* Student Number */}
                            <TextField
                                label="Student Number"
                                placeholder="e.g., 202412345"
                                fullWidth
                                value={formData.studentNumber}
                                onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                                required
                                disabled={isEditing}
                                helperText={isEditing ? 'Student number cannot be changed' : 'Unique identifier for this student'}
                            />

                            {/* Level - Autocomplete */}
                            <AutocompleteSelect
                                options={levels}
                                value={formData.level}
                                onChange={handleLevelChange}
                                label="Level"
                                required
                                getOptionLabel={(option) => option ? `${option.name} (${option.code})` : ''}
                                renderOptionContent={(option) => (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip label={option.code} size="small" variant="outlined" />
                                        {option.name}
                                    </Box>
                                )}
                                placeholder="Search levels..."
                            />

                            {/* Specialization - Autocomplete from specializations table */}
                            <AutocompleteSelect
                                options={specializations}
                                value={formData.specialization}
                                onChange={(newValue) => setFormData({ ...formData, specialization: newValue })}
                                label="Specialization"
                                getOptionLabel={(option) => option?.name || ''}
                                renderOptionContent={(option) => (
                                    <Box>
                                        <strong>{option.name}</strong>
                                        {option.code && (
                                            <Chip
                                                label={option.code}
                                                size="small"
                                                variant="outlined"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </Box>
                                )}
                                placeholder="Search specializations..."
                            />

                            {/* Group - Autocomplete (filtered by level) */}
                            <AutocompleteSelect
                                options={filteredGroups}
                                value={formData.group}
                                onChange={(newValue) => setFormData({ ...formData, group: newValue })}
                                label="Group"
                                required
                                disabled={!formData.level}
                                getOptionLabel={(option) => option?.name || ''}
                                renderOptionContent={(option) => (
                                    <Box>
                                        <strong>{option.name}</strong>
                                        {option.capacity && (
                                            <span style={{ marginLeft: 8, opacity: 0.7 }}>
                                                (Capacity: {option.capacity})
                                            </span>
                                        )}
                                    </Box>
                                )}
                                placeholder={formData.level ? "Search groups..." : "Select a level first"}
                                helperText={!formData.level ? 'Select a level first to see available groups' : ''}
                            />

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
