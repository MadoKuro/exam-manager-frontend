import { useState, useMemo } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, InputLabel, Select, MenuItem, Checkbox,
    ListItemText, OutlinedInput, Grow, IconButton, Tooltip, Alert,
    ToggleButton, ToggleButtonGroup, Avatar, Card, CardContent, Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader } from '../../../components/admin';
import { GLASSMORPHISM, COLORS, GRADIENTS, ANIMATIONS } from '../../../theme/themeConstants';

/**
 * Surveillants/Invigilator management page
 * Features: Teacher list, calendar view, auto-assign, manual assignment
 */
export default function SurveillantsList() {
    const theme = useTheme();
    const {
        teachers, exams, examsCrud, modules, rooms,
        checkSurveillantConflicts, getAvailableSurveillants, autoAssignSurveillants
    } = useAdminData();
    const { notify } = useNotification();

    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [assignDialog, setAssignDialog] = useState({ open: false, exam: null });
    const [selectedSurveillants, setSelectedSurveillants] = useState([]);
    const [conflicts, setConflicts] = useState([]);

    // Get exams needing surveillants
    const examsNeedingSurveillants = useMemo(() => {
        return exams.filter(exam => !exam.surveillantIds || exam.surveillantIds.length === 0);
    }, [exams]);

    // Calculate teacher workload (number of exams assigned)
    const teacherWorkload = useMemo(() => {
        const workload = {};
        teachers.forEach(t => { workload[t.id] = 0; });
        exams.forEach(exam => {
            (exam.surveillantIds || []).forEach(id => {
                if (workload[id] !== undefined) workload[id]++;
            });
        });
        return workload;
    }, [teachers, exams]);

    // Get teacher's assigned exams
    const getTeacherExams = (teacherId) => {
        return exams.filter(exam => exam.surveillantIds?.includes(teacherId));
    };

    // Module name helper
    const getModuleName = (moduleId) => {
        return modules.find(m => m.id === moduleId)?.name || '-';
    };

    // Open assignment dialog
    const handleOpenAssignDialog = (exam) => {
        setAssignDialog({ open: true, exam });
        setSelectedSurveillants(exam.surveillantIds || []);
        setConflicts([]);
    };

    // Close assignment dialog
    const handleCloseAssignDialog = () => {
        setAssignDialog({ open: false, exam: null });
        setSelectedSurveillants([]);
        setConflicts([]);
    };

    // Handle surveillant selection change
    const handleSurveillantChange = (event) => {
        const { value } = event.target;
        const newSelection = typeof value === 'string' ? value.split(',').map(Number) : value;
        setSelectedSurveillants(newSelection);

        // Check for conflicts
        if (assignDialog.exam) {
            const exam = assignDialog.exam;
            const conflictResult = checkSurveillantConflicts(
                exam.date, exam.startTime, exam.duration,
                newSelection, exam.id
            );
            setConflicts(conflictResult);
        }
    };

    // Confirm manual assignment
    const handleConfirmAssignment = () => {
        if (!assignDialog.exam) return;

        examsCrud.update(assignDialog.exam.id, { surveillantIds: selectedSurveillants });
        notify(`Assigned ${selectedSurveillants.length} surveillant(s) to exam`, 'success');
        handleCloseAssignDialog();
    };

    // Auto-assign surveillants to an exam
    const handleAutoAssign = (exam) => {
        const roomCount = exam.roomIds?.length || 1;
        const neededSurveillants = Math.max(roomCount, 1); // At least 1 per room

        const autoAssigned = autoAssignSurveillants(exam.id, neededSurveillants);

        if (autoAssigned.length === 0) {
            notify('No available surveillants for this time slot', 'warning');
            return;
        }

        const current = exam.surveillantIds || [];
        const merged = [...new Set([...current, ...autoAssigned])];

        examsCrud.update(exam.id, { surveillantIds: merged });
        notify(`Auto-assigned ${autoAssigned.length} surveillant(s)`, 'success');
    };

    // Get available surveillants for dialog
    const availableSurveillants = useMemo(() => {
        if (!assignDialog.exam) return teachers;
        const exam = assignDialog.exam;
        return getAvailableSurveillants(exam.date, exam.startTime, exam.duration, exam.id);
    }, [assignDialog.exam, teachers]);

    // Get unavailable surveillants for dialog
    const unavailableSurveillants = useMemo(() => {
        if (!assignDialog.exam) return [];
        return teachers.filter(t => !availableSurveillants.some(a => a.id === t.id));
    }, [assignDialog.exam, teachers, availableSurveillants]);

    return (
        <Box>
            <AdminPageHeader
                title="Invigilator Assignment"
                subtitle="Manage exam surveillance and teacher assignments"
            >
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, newMode) => newMode && setViewMode(newMode)}
                    size="small"
                    sx={{
                        bgcolor: theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
                        borderRadius: 2,
                        mr: 2,
                        '& .MuiToggleButton-root': {
                            color: theme.palette.text.secondary,
                            '&.Mui-selected': {
                                bgcolor: `${COLORS.secondaryMain}15`,
                                color: COLORS.secondaryMain,
                                '&:hover': {
                                    bgcolor: `${COLORS.secondaryMain}25`
                                }
                            }
                        }
                    }}
                >
                    <ToggleButton value="list" sx={{ px: 2 }}>
                        <ViewListIcon sx={{ mr: 1 }} /> List
                    </ToggleButton>
                    <ToggleButton value="calendar" sx={{ px: 2 }}>
                        <CalendarMonthIcon sx={{ mr: 1 }} /> Calendar
                    </ToggleButton>
                </ToggleButtonGroup>
            </AdminPageHeader>

            {/* Alert for exams needing surveillants */}
            {examsNeedingSurveillants.length > 0 && (
                <Alert
                    severity="info"
                    sx={{ mb: 3, borderRadius: 2 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => {
                                examsNeedingSurveillants.forEach(exam => handleAutoAssign(exam));
                            }}
                            startIcon={<AutoFixHighIcon />}
                        >
                            Auto-assign All
                        </Button>
                    }
                >
                    {examsNeedingSurveillants.length} exam(s) need surveillant assignment
                </Alert>
            )}

            <Grow in={true}>
                <Box>
                    {viewMode === 'list' ? (
                        // LIST VIEW - Teacher table
                        <Grid container spacing={3}>
                            {/* Teacher List */}
                            <Grid item xs={12} md={7}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                                    Teachers
                                </Typography>
                                <TableContainer
                                    component={Paper}
                                    elevation={0}
                                    sx={{
                                        borderRadius: '24px',
                                        background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                                        backdropFilter: GLASSMORPHISM.card.blur,
                                        border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                                    }}
                                >
                                    <Table>
                                        <TableHead sx={{ bgcolor: `${COLORS.primaryMain}0D` }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Teacher</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Workload</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {teachers.map((teacher) => {
                                                const workload = teacherWorkload[teacher.id] || 0;
                                                return (
                                                    <TableRow key={teacher.id} hover>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar
                                                                    sx={{
                                                                        width: 40,
                                                                        height: 40,
                                                                        background: GRADIENTS.brand,
                                                                        fontWeight: 700
                                                                    }}
                                                                >
                                                                    {teacher.name.charAt(0)}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography sx={{ fontWeight: 600 }}>
                                                                        {teacher.name}
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                                        {teacher.email}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={`${workload} exam${workload !== 1 ? 's' : ''}`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: theme.palette.mode === 'light'
                                                                        ? (workload > 3 ? COLORS.warningLight : workload > 0 ? COLORS.successLight : `${COLORS.infoMain}15`)
                                                                        : (workload > 3 ? `${COLORS.warningMain}25` : workload > 0 ? `${COLORS.successMain}25` : `${COLORS.infoMain}20`),
                                                                    color: theme.palette.mode === 'light'
                                                                        ? (workload > 3 ? COLORS.warningDark : workload > 0 ? COLORS.successDark : COLORS.infoDark)
                                                                        : (workload > 3 ? COLORS.warningMain : workload > 0 ? COLORS.successMain : COLORS.infoMain),
                                                                    fontWeight: 600,
                                                                    border: theme.palette.mode === 'dark' ? `1px solid ${workload > 3 ? COLORS.warningMain : workload > 0 ? COLORS.successMain : COLORS.infoMain}40` : 'none'
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                icon={workload > 0 ? <CheckCircleIcon /> : null}
                                                                label={workload > 0 ? 'Active' : 'Available'}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: theme.palette.mode === 'light'
                                                                        ? (workload > 0 ? COLORS.successLight : `${COLORS.primaryMain}15`)
                                                                        : (workload > 0 ? `${COLORS.successMain}25` : `${COLORS.primaryMain}20`),
                                                                    color: theme.palette.mode === 'light'
                                                                        ? (workload > 0 ? COLORS.successDark : COLORS.primaryMain)
                                                                        : (workload > 0 ? COLORS.successMain : COLORS.primaryLight),
                                                                    fontWeight: 600,
                                                                    border: theme.palette.mode === 'dark' ? `1px solid ${workload > 0 ? COLORS.successMain : COLORS.primaryMain}40` : 'none',
                                                                    '& .MuiChip-icon': {
                                                                        color: 'inherit'
                                                                    }
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            {/* Exams needing assignment */}
                            <Grid item xs={12} md={5}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                                    Exams Schedule
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {exams.map((exam) => (
                                        <Card
                                            key={exam.id}
                                            elevation={0}
                                            sx={{
                                                borderRadius: '16px',
                                                background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                                                backdropFilter: GLASSMORPHISM.card.blur,
                                                border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                                                transition: `all ${ANIMATIONS.duration.normal} ${ANIMATIONS.easing.smooth}`,
                                                '&:hover': { transform: 'translateY(-2px)' }
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                        {getModuleName(exam.moduleId)}
                                                    </Typography>
                                                    <Chip
                                                        label={exam.surveillantIds?.length > 0 ? `${exam.surveillantIds.length} assigned` : 'No assignment'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: theme.palette.mode === 'light'
                                                                ? (exam.surveillantIds?.length > 0 ? COLORS.successLight : COLORS.warningLight)
                                                                : (exam.surveillantIds?.length > 0 ? `${COLORS.successMain}25` : `${COLORS.warningMain}25`),
                                                            color: theme.palette.mode === 'light'
                                                                ? (exam.surveillantIds?.length > 0 ? COLORS.successDark : COLORS.warningDark)
                                                                : (exam.surveillantIds?.length > 0 ? COLORS.successMain : COLORS.warningMain),
                                                            fontWeight: 600,
                                                            border: theme.palette.mode === 'dark' ? `1px solid ${exam.surveillantIds?.length > 0 ? COLORS.successMain : COLORS.warningMain}40` : 'none'
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                                                    {exam.date} at {exam.startTime} • {exam.duration}min
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<PersonAddIcon />}
                                                        onClick={() => handleOpenAssignDialog(exam)}
                                                        sx={{ flex: 1, borderRadius: 2 }}
                                                    >
                                                        Assign
                                                    </Button>
                                                    <Tooltip title="Auto-assign available teachers">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleAutoAssign(exam)}
                                                            sx={{
                                                                bgcolor: `${COLORS.secondaryMain}15`,
                                                                '&:hover': { bgcolor: `${COLORS.secondaryMain}25` }
                                                            }}
                                                        >
                                                            <AutoFixHighIcon sx={{ color: COLORS.secondaryMain }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    ) : (
                        // CALENDAR VIEW - Visual teacher availability
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                                Teacher Availability Calendar
                            </Typography>
                            <Grid container spacing={2}>
                                {teachers.map((teacher) => {
                                    const teacherExams = getTeacherExams(teacher.id);
                                    const workload = teacherWorkload[teacher.id] || 0;

                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    borderRadius: '16px',
                                                    background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                                                    backdropFilter: GLASSMORPHISM.card.blur,
                                                    border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                                                    transition: `all ${ANIMATIONS.duration.normal} ${ANIMATIONS.easing.smooth}`,
                                                    '&:hover': { transform: 'translateY(-4px)' }
                                                }}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                background: workload > 3 ? `linear-gradient(135deg, ${COLORS.warningMain}, ${COLORS.errorMain})` :
                                                                    workload > 0 ? `linear-gradient(135deg, ${COLORS.primaryMain}, ${COLORS.secondaryMain})` :
                                                                        COLORS.successMain,
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            {teacher.name.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 700 }}>
                                                                {teacher.name}
                                                            </Typography>
                                                            <Chip
                                                                label={workload > 3 ? 'Busy' : workload > 0 ? 'Partially Busy' : 'Available'}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: theme.palette.mode === 'light'
                                                                        ? (workload > 3 ? COLORS.errorLight : workload > 0 ? COLORS.warningLight : COLORS.successLight)
                                                                        : (workload > 3 ? `${COLORS.errorMain}25` : workload > 0 ? `${COLORS.warningMain}25` : `${COLORS.successMain}25`),
                                                                    color: theme.palette.mode === 'light'
                                                                        ? (workload > 3 ? COLORS.errorDark : workload > 0 ? COLORS.warningDark : COLORS.successDark)
                                                                        : (workload > 3 ? COLORS.errorMain : workload > 0 ? COLORS.warningMain : COLORS.successMain),
                                                                    fontWeight: 600,
                                                                    mt: 0.5,
                                                                    border: theme.palette.mode === 'dark' ? `1px solid ${workload > 3 ? COLORS.errorMain : workload > 0 ? COLORS.warningMain : COLORS.successMain}40` : 'none'
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>

                                                    {/* Assigned exams list */}
                                                    {teacherExams.length > 0 ? (
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                                                Assigned Exams:
                                                            </Typography>
                                                            {teacherExams.slice(0, 3).map((exam) => (
                                                                <Box
                                                                    key={exam.id}
                                                                    sx={{
                                                                        p: 1,
                                                                        mb: 1,
                                                                        borderRadius: 1,
                                                                        bgcolor: `${COLORS.primaryMain}08`,
                                                                        borderLeft: `3px solid ${COLORS.primaryMain}`
                                                                    }}
                                                                >
                                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                        {getModuleName(exam.moduleId)}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                                        {exam.date} at {exam.startTime}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                            {teacherExams.length > 3 && (
                                                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                                    +{teacherExams.length - 3} more
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                            No exams assigned yet
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Grow>

            {/* Assignment Dialog */}
            <Dialog
                open={assignDialog.open}
                onClose={handleCloseAssignDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Assign Surveillants
                    {assignDialog.exam && (
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 'normal' }}>
                            {getModuleName(assignDialog.exam.moduleId)} - {assignDialog.exam.date} at {assignDialog.exam.startTime}
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent>
                    {/* Conflict warnings */}
                    {conflicts.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            {conflicts.map((conflict, index) => (
                                <Alert
                                    key={index}
                                    severity="warning"
                                    icon={<WarningAmberIcon />}
                                    sx={{ mb: 1, borderRadius: 2 }}
                                >
                                    <strong>Conflict:</strong> {conflict.surveillants.join(', ')} already assigned to "{conflict.examName}" at {conflict.time}
                                </Alert>
                            ))}
                        </Box>
                    )}

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Select Surveillants</InputLabel>
                        <Select
                            multiple
                            value={selectedSurveillants}
                            onChange={handleSurveillantChange}
                            input={<OutlinedInput label="Select Surveillants" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((id) => {
                                        const teacher = teachers.find(t => t.id === id);
                                        return (
                                            <Chip
                                                key={id}
                                                label={teacher?.name || id}
                                                size="small"
                                                sx={{ bgcolor: `${COLORS.primaryMain}20`, color: COLORS.primaryDark }}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                        >
                            {/* Available teachers */}
                            {availableSurveillants.length > 0 && (
                                <MenuItem disabled sx={{ opacity: 1, fontWeight: 700, color: COLORS.successMain }}>
                                    Available
                                </MenuItem>
                            )}
                            {availableSurveillants.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>
                                    <Checkbox checked={selectedSurveillants.indexOf(teacher.id) > -1} />
                                    <ListItemText
                                        primary={teacher.name}
                                        secondary={`Workload: ${teacherWorkload[teacher.id] || 0} exams`}
                                    />
                                    <Chip
                                        label="Available"
                                        size="small"
                                        sx={{ bgcolor: COLORS.successLight, color: COLORS.successDark }}
                                    />
                                </MenuItem>
                            ))}

                            {/* Unavailable teachers */}
                            {unavailableSurveillants.length > 0 && (
                                <MenuItem disabled sx={{ opacity: 1, fontWeight: 700, color: COLORS.warningMain }}>
                                    Busy at this time
                                </MenuItem>
                            )}
                            {unavailableSurveillants.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>
                                    <Checkbox checked={selectedSurveillants.indexOf(teacher.id) > -1} />
                                    <ListItemText
                                        primary={teacher.name}
                                        secondary="Has another exam at this time"
                                    />
                                    <Chip
                                        label="Busy"
                                        size="small"
                                        sx={{ bgcolor: COLORS.warningLight, color: COLORS.warningDark }}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleCloseAssignDialog} sx={{ color: theme.palette.text.secondary }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAssignment}
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                    >
                        Confirm Assignment
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
