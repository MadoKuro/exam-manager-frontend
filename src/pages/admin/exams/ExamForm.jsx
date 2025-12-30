import { useState, useEffect, useMemo } from 'react';
import {
    Box, TextField, Button, Paper, Stack, MenuItem, Grow,
    Chip, Alert, FormControl, InputLabel, Select, OutlinedInput,
    Checkbox, ListItemText, Typography
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAdminData, EXAM_TYPES } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader } from '../../../components/admin';
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
        moduleId: '',
        date: '',
        startTime: '',
        duration: 60,
        type: 'Written',
        roomIds: [],
        groupIds: [],
        status: 'Scheduled'
    });

    const [conflicts, setConflicts] = useState({ room: [], teacher: [] });
    const isEditing = Boolean(id);

    // Load existing exam data for editing
    useEffect(() => {
        if (id) {
            const exam = examsCrud.getById(Number(id));
            if (exam) {
                setFormData({
                    moduleId: exam.moduleId,
                    date: exam.date,
                    startTime: exam.startTime,
                    duration: exam.duration,
                    type: exam.type,
                    roomIds: exam.roomIds || [],
                    groupIds: exam.groupIds || [],
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

        const roomConflicts = formData.roomIds.length > 0
            ? checkRoomConflicts(
                formData.date,
                formData.startTime,
                formData.duration,
                formData.roomIds,
                isEditing ? Number(id) : null
            )
            : [];

        const teacherConflicts = formData.moduleId
            ? checkTeacherConflicts(
                formData.date,
                formData.startTime,
                formData.duration,
                formData.moduleId,
                isEditing ? Number(id) : null
            )
            : [];

        setConflicts({ room: roomConflicts, teacher: teacherConflicts });
    }, [formData.date, formData.startTime, formData.duration, formData.roomIds, formData.moduleId, id]);

    // Get responsible teacher name for selected module
    const responsibleTeacher = useMemo(() => {
        if (!formData.moduleId) return null;
        const mod = modules.find(m => m.id === formData.moduleId);
        if (!mod) return null;
        return teachers.find(t => t.id === mod.teacherId);
    }, [formData.moduleId, modules, teachers]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.moduleId || !formData.date || !formData.startTime || formData.roomIds.length === 0) {
            notify('Please fill all required fields', 'error');
            return;
        }

        const examData = {
            ...formData,
            surveillantIds: isEditing ? examsCrud.getById(Number(id))?.surveillantIds || [] : [],
            createdAt: isEditing ? examsCrud.getById(Number(id))?.createdAt : new Date().toISOString().split('T')[0]
        };

        if (isEditing) {
            examsCrud.update(Number(id), examData);
            notify('Exam updated successfully', 'success');
        } else {
            examsCrud.add(examData);
            notify('Exam created successfully', 'success');
        }
        navigate('/admin/exams');
    };

    const handleRoomChange = (event) => {
        const { value } = event.target;
        setFormData({ ...formData, roomIds: typeof value === 'string' ? value.split(',').map(Number) : value });
    };

    const handleGroupChange = (event) => {
        const { value } = event.target;
        setFormData({ ...formData, groupIds: typeof value === 'string' ? value.split(',').map(Number) : value });
    };

    // Calculate total capacity
    const totalCapacity = useMemo(() => {
        return formData.roomIds.reduce((sum, roomId) => {
            const room = rooms.find(r => r.id === roomId);
            return sum + (room?.capacity || 0);
        }, 0);
    }, [formData.roomIds, rooms]);

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
                            <TextField
                                select
                                label="Module *"
                                fullWidth
                                value={formData.moduleId}
                                onChange={(e) => setFormData({ ...formData, moduleId: Number(e.target.value) })}
                                required
                            >
                                {modules.map((mod) => (
                                    <MenuItem key={mod.id} value={mod.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip label={mod.code} size="small" variant="outlined" />
                                            {mod.name}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>

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
                            <FormControl fullWidth required>
                                <InputLabel>Rooms *</InputLabel>
                                <Select
                                    multiple
                                    value={formData.roomIds}
                                    onChange={handleRoomChange}
                                    input={<OutlinedInput label="Rooms *" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((roomId) => {
                                                const room = rooms.find(r => r.id === roomId);
                                                return (
                                                    <Chip
                                                        key={roomId}
                                                        label={room ? `${room.name} (${room.capacity})` : roomId}
                                                        size="small"
                                                        sx={{ bgcolor: `${COLORS.primaryMain}20`, color: COLORS.primaryDark }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {rooms.map((room) => (
                                        <MenuItem key={room.id} value={room.id}>
                                            <Checkbox checked={formData.roomIds.indexOf(room.id) > -1} />
                                            <ListItemText
                                                primary={room.name}
                                                secondary={`Capacity: ${room.capacity} • ${room.location}`}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Show total capacity */}
                            {formData.roomIds.length > 0 && (
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
                            <FormControl fullWidth>
                                <InputLabel>Groups</InputLabel>
                                <Select
                                    multiple
                                    value={formData.groupIds}
                                    onChange={handleGroupChange}
                                    input={<OutlinedInput label="Groups" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((groupId) => {
                                                const group = groups.find(g => g.id === groupId);
                                                return (
                                                    <Chip
                                                        key={groupId}
                                                        label={group?.name || groupId}
                                                        size="small"
                                                        sx={{ bgcolor: `${COLORS.secondaryMain}20`, color: COLORS.secondaryDark }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {groups.map((group) => (
                                        <MenuItem key={group.id} value={group.id}>
                                            <Checkbox checked={formData.groupIds.indexOf(group.id) > -1} />
                                            <ListItemText
                                                primary={group.name}
                                                secondary={`Capacity: ${group.capacity}`}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

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
