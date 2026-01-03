import { useState, useEffect, useMemo } from 'react';
import {
    Box, TextField, Button, Paper, Stack, MenuItem, Grow,
    Chip, Alert, Typography
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAdminData, EXAM_TYPES } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader } from '../../../components/admin';
import AutocompleteSelect from '../../../components/AutocompleteSelect';
import { GLASSMORPHISM, COLORS, ANIMATIONS } from '../../../theme/themeConstants';

/**
 * Exam creation/edit form with conflict detection
 */
export default function ExamForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const {
        examsCrud, modules, rooms, groups, teachers,
        checkRoomConflicts, checkTeacherConflicts
    } = useAdminData();
    const { notify } = useNotification();

    const [formData, setFormData] = useState({
        module: null,
        date: '',
        startTime: '',
        duration: 60,
        type: 'Written',
        rooms: [],
        groups: [],
        status: 'Scheduled'
    });

    const [conflicts, setConflicts] = useState({ room: [], teacher: [] });
    const isEditing = Boolean(id);

    // Load existing exam data for editing
    useEffect(() => {
        if (id) {
            const exam = examsCrud.getById(Number(id));
            if (exam) {
                // Find the actual objects for autocomplete
                const examModule = modules.find(m => m.id === exam.moduleId) || null;
                const examRooms = (exam.roomIds || []).map(id => rooms.find(r => r.id === id)).filter(Boolean);
                const examGroups = (exam.groupIds || []).map(id => groups.find(g => g.id === id)).filter(Boolean);

                setFormData({
                    module: examModule,
                    date: exam.date,
                    startTime: exam.startTime,
                    duration: exam.duration,
                    type: exam.type,
                    rooms: examRooms,
                    groups: examGroups,
                    status: exam.status || 'Scheduled'
                });
            }
        }
    }, [id]);

    // Check for conflicts when form data changes
    useEffect(() => {
        if (!formData.date || !formData.startTime || !formData.duration) {
            setConflicts({ room: [], teacher: [] });
            return;
        }

        const roomIds = formData.rooms.map(r => r.id);
        const roomConflicts = roomIds.length > 0
            ? checkRoomConflicts(
                formData.date,
                formData.startTime,
                formData.duration,
                roomIds,
                isEditing ? Number(id) : null
            )
            : [];

        const teacherConflicts = formData.module
            ? checkTeacherConflicts(
                formData.date,
                formData.startTime,
                formData.duration,
                formData.module.id,
                isEditing ? Number(id) : null
            )
            : [];

        setConflicts({ room: roomConflicts, teacher: teacherConflicts });
    }, [formData.date, formData.startTime, formData.duration, formData.rooms, formData.module, id]);

    // Get responsible teacher name for selected module
    const responsibleTeacher = useMemo(() => {
        if (!formData.module) return null;
        return teachers.find(t => t.id === formData.module.teacherId);
    }, [formData.module, teachers]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.module || !formData.date || !formData.startTime || formData.rooms.length === 0) {
            notify('Please fill all required fields', 'error');
            return;
        }

        const examData = {
            moduleId: formData.module.id,
            date: formData.date,
            startTime: formData.startTime,
            duration: formData.duration,
            type: formData.type,
            roomIds: formData.rooms.map(r => r.id),
            groupIds: formData.groups.map(g => g.id),
            status: formData.status,
            surveillantIds: isEditing ? examsCrud.getById(Number(id))?.surveillantIds || [] : [],
            createdAt: isEditing ? examsCrud.getById(Number(id))?.createdAt : new Date().toISOString().split('T')[0]
        };

        try {
            if (isEditing) {
                await examsCrud.update(Number(id), examData);
                notify('Exam updated successfully', 'success');
            } else {
                await examsCrud.add(examData);
                notify('Exam created successfully', 'success');
            }
            navigate('/admin/exams');
        } catch (error) {
            console.error('Error saving exam:', error);
            notify(error.response?.data?.message || 'Failed to save exam', 'error');
        }
    };

    // Compute selected room objects for autocomplete
    const selectedRooms = formData.rooms || [];
    const selectedGroups = formData.groups || [];

    // Calculate total capacity
    const totalCapacity = useMemo(() => {
        return formData.rooms.reduce((sum, room) => {
            return sum + (room?.capacity || 0);
        }, 0);
    }, [formData.rooms]);

    return (
        <Box>
            <AdminPageHeader
                title={isEditing ? 'Edit Exam' : 'Create New Exam'}
                subtitle={isEditing ? 'Update exam details' : 'Schedule a new exam session'}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/exams')}
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
                    {/* Conflict Warnings */}
                    {(conflicts.room.length > 0 || conflicts.teacher.length > 0) && (
                        <Box sx={{ mb: 3 }}>
                            {conflicts.room.map((conflict, index) => (
                                <Alert
                                    key={`room-${index}`}
                                    severity="warning"
                                    icon={<WarningAmberIcon />}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 2,
                                        animation: `${ANIMATIONS.duration.normal} ${ANIMATIONS.easing.smooth}`
                                    }}
                                >
                                    <strong>Room Conflict:</strong> {conflict.rooms.join(', ')} {conflict.rooms.length > 1 ? 'are' : 'is'} already booked for "{conflict.examName}" on {conflict.time}
                                </Alert>
                            ))}
                            {conflicts.teacher.map((conflict, index) => (
                                <Alert
                                    key={`teacher-${index}`}
                                    severity="warning"
                                    icon={<WarningAmberIcon />}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 2
                                    }}
                                >
                                    <strong>Teacher Conflict:</strong> {conflict.teacher} has another exam "{conflict.examName}" scheduled on {conflict.time}
                                </Alert>
                            ))}
                        </Box>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* Module Selection */}
                            <AutocompleteSelect
                                options={modules}
                                value={formData.module}
                                onChange={(newValue) => setFormData({ ...formData, module: newValue })}
                                label="Module"
                                required
                                getOptionLabel={(option) => option ? `${option.code} - ${option.name}` : ''}
                                renderOptionContent={(option) => (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip label={option.code} size="small" variant="outlined" />
                                        {option.name}
                                    </Box>
                                )}
                                placeholder="Search modules..."
                            />

                            {/* Show responsible teacher */}
                            {responsibleTeacher && (
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: `${COLORS.primaryMain}10`,
                                    border: `1px solid ${COLORS.primaryMain}30`
                                }}>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        Responsible Teacher
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: COLORS.primaryMain }}>
                                        {responsibleTeacher.name}
                                    </Typography>
                                </Box>
                            )}

                            {/* Date and Time Row */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Date *"
                                    type="date"
                                    fullWidth
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                                <TextField
                                    label="Start Time *"
                                    type="time"
                                    fullWidth
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Box>

                            {/* Duration and Type Row */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Duration (minutes) *"
                                    type="number"
                                    fullWidth
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                    inputProps={{ min: 15, max: 300, step: 15 }}
                                    required
                                />
                                <TextField
                                    select
                                    label="Exam Type *"
                                    fullWidth
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    {EXAM_TYPES.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            {/* Room Multi-Select */}
                            <AutocompleteSelect
                                options={rooms}
                                value={formData.rooms}
                                onChange={(newValue) => setFormData({ ...formData, rooms: newValue || [] })}
                                label="Rooms"
                                required
                                multiple
                                getOptionLabel={(option) => option ? `${option.name} (${option.capacity})` : ''}
                                renderOptionContent={(option) => (
                                    <Box>
                                        <Typography variant="body1">{option.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Capacity: {option.capacity} • {option.location}
                                        </Typography>
                                    </Box>
                                )}
                                placeholder="Search rooms..."
                                chipColor="primary"
                            />

                            {/* Show total capacity */}
                            {formData.rooms.length > 0 && (
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: `${COLORS.infoMain}10`,
                                    border: `1px solid ${COLORS.infoMain}30`
                                }}>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        Total Capacity
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.infoMain }}>
                                        {totalCapacity} seats
                                    </Typography>
                                </Box>
                            )}

                            {/* Group Multi-Select */}
                            <AutocompleteSelect
                                options={groups}
                                value={formData.groups}
                                onChange={(newValue) => setFormData({ ...formData, groups: newValue || [] })}
                                label="Groups"
                                multiple
                                getOptionLabel={(option) => option?.name || ''}
                                renderOptionContent={(option) => (
                                    <Box>
                                        <Typography variant="body1">{option.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Capacity: {option.capacity}
                                        </Typography>
                                    </Box>
                                )}
                                placeholder="Search groups..."
                                chipColor="secondary"
                            />

                            {/* Actions */}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/admin/exams')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ borderRadius: 2 }}
                                >
                                    {isEditing ? 'Update Exam' : 'Create Exam'}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            </Grow>
        </Box>
    );
}
