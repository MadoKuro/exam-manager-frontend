import { useState, useMemo } from 'react';
import { Box, Button, Alert, Grow, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { useTeacherWorkload } from '../../../hooks/useTeacherWorkload';
import { AdminPageHeader } from '../../../components/admin';
import { TeachersListView, TeacherCalendarView, AssignmentDialog } from '../../../components/admin/surveillants';
import { COLORS } from '../../../theme/themeConstants';

/**
 * Surveillants/Invigilator management page
 * Features: Teacher list, calendar view, auto-assign, manual assignment
 * 
 * Refactored to use extracted components:
 * - TeachersListView: List view with teacher table and exam cards
 * - TeacherCalendarView: Calendar view showing teacher availability
 * - AssignmentDialog: Dialog for manual surveillant assignment
 * - useTeacherWorkload: Hook for workload calculations
 */
export default function SurveillantsList() {
    const theme = useTheme();
    const {
        teachers, exams, examsCrud, modules,
        checkSurveillantConflicts, getAvailableSurveillants, autoAssignSurveillants
    } = useAdminData();
    const { notify } = useNotification();

    // Use extracted workload hook
    const {
        teacherWorkload,
        examsNeedingSurveillants,
        getTeacherExams,
        getModuleName
    } = useTeacherWorkload(teachers, exams, modules);

    // View state
    const [viewMode, setViewMode] = useState('list');

    // Dialog state
    const [assignDialog, setAssignDialog] = useState({ open: false, exam: null });
    const [selectedSurveillants, setSelectedSurveillants] = useState([]);
    const [conflicts, setConflicts] = useState([]);

    // Dialog handlers
    const handleOpenAssignDialog = (exam) => {
        setAssignDialog({ open: true, exam });
        setSelectedSurveillants(exam.surveillantIds || []);
        setConflicts([]);
    };

    const handleCloseAssignDialog = () => {
        setAssignDialog({ open: false, exam: null });
        setSelectedSurveillants([]);
        setConflicts([]);
    };

    const handleSurveillantChange = (event) => {
        const { value } = event.target;
        const newSelection = typeof value === 'string' ? value.split(',').map(Number) : value;
        setSelectedSurveillants(newSelection);

        if (assignDialog.exam) {
            const exam = assignDialog.exam;
            const conflictResult = checkSurveillantConflicts(
                exam.date, exam.startTime, exam.duration,
                newSelection, exam.id
            );
            setConflicts(conflictResult);
        }
    };

    const handleConfirmAssignment = () => {
        if (!assignDialog.exam) return;
        examsCrud.update(assignDialog.exam.id, { surveillantIds: selectedSurveillants });
        notify(`Assigned ${selectedSurveillants.length} surveillant(s) to exam`, 'success');
        handleCloseAssignDialog();
    };

    // Auto-assign handler
    const handleAutoAssign = (exam) => {
        const roomCount = exam.roomIds?.length || 1;
        const neededSurveillants = Math.max(roomCount, 1);
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

    // Available/unavailable surveillants for dialog
    const availableSurveillants = useMemo(() => {
        if (!assignDialog.exam) return teachers;
        const exam = assignDialog.exam;
        return getAvailableSurveillants(exam.date, exam.startTime, exam.duration, exam.id);
    }, [assignDialog.exam, teachers, getAvailableSurveillants]);

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
                            onClick={() => examsNeedingSurveillants.forEach(exam => handleAutoAssign(exam))}
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
                        <TeachersListView
                            teachers={teachers}
                            exams={exams}
                            teacherWorkload={teacherWorkload}
                            getModuleName={getModuleName}
                            onOpenAssignDialog={handleOpenAssignDialog}
                            onAutoAssign={handleAutoAssign}
                        />
                    ) : (
                        <TeacherCalendarView
                            teachers={teachers}
                            teacherWorkload={teacherWorkload}
                            getTeacherExams={getTeacherExams}
                            getModuleName={getModuleName}
                        />
                    )}
                </Box>
            </Grow>

            {/* Assignment Dialog */}
            <AssignmentDialog
                open={assignDialog.open}
                exam={assignDialog.exam}
                teachers={teachers}
                selectedSurveillants={selectedSurveillants}
                teacherWorkload={teacherWorkload}
                availableSurveillants={availableSurveillants}
                unavailableSurveillants={unavailableSurveillants}
                conflicts={conflicts}
                getModuleName={getModuleName}
                onClose={handleCloseAssignDialog}
                onSurveillantChange={handleSurveillantChange}
                onConfirm={handleConfirmAssignment}
            />
        </Box>
    );
}
