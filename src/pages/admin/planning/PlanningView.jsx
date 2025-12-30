import { useState, useMemo } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Grow, Tooltip,
    ToggleButton, ToggleButtonGroup, Collapse
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';
import FilterListIcon from '@mui/icons-material/FilterList';
import WarningIcon from '@mui/icons-material/Warning';
import { useAdminData, EXAM_TYPES } from '../../../context/AdminDataContext';
import { AdminPageHeader, GlassmorphicCard, StatusChip } from '../../../components/admin';
import { CalendarControls, CalendarGrid, FilterPanel } from '../../../components/admin/planning';
import { COLORS } from '../../../theme/themeConstants';
import {
    getModuleName as getModuleNameUtil,
    getModuleCode as getModuleCodeUtil,
    getRoomNames as getRoomNamesUtil,
    getSurveillantNames as getSurveillantNamesUtil,
    getGroupNames as getGroupNamesUtil,
    getResponsibleTeacher as getResponsibleTeacherUtil
} from '../../../utils/examHelpers';

/**
 * Exam Planning page with calendar and table views
 */
export default function PlanningView() {
    const theme = useTheme();
    const { exams, modules, rooms, teachers, groups, checkRoomConflicts, checkTeacherConflicts } = useAdminData();

    const [viewMode, setViewMode] = useState('calendar');
    const [calendarView, setCalendarView] = useState('week');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        teacher: '',
        room: '',
        group: '',
        examType: ''
    });

    // Bound helper functions
    const getModuleName = (moduleId) => getModuleNameUtil(moduleId, modules);
    const getModuleCode = (moduleId) => getModuleCodeUtil(moduleId, modules);
    const getRoomNames = (roomIds) => getRoomNamesUtil(roomIds, rooms);
    const getSurveillantNames = (surveillantIds) => getSurveillantNamesUtil(surveillantIds, teachers);
    const getGroupNames = (groupIds) => getGroupNamesUtil(groupIds, groups);
    const getResponsibleTeacher = (moduleId) => getResponsibleTeacherUtil(moduleId, modules, teachers);

    // Check if exam has conflicts
    const hasConflicts = (exam) => {
        const roomConflicts = checkRoomConflicts(exam.date, exam.startTime, exam.duration, exam.roomIds, exam.id);
        const teacherConflicts = checkTeacherConflicts(exam.date, exam.startTime, exam.duration, exam.moduleId, exam.id);
        return roomConflicts.length > 0 || teacherConflicts.length > 0;
    };

    // Filter exams
    const filteredExams = useMemo(() => {
        return exams.filter(exam => {
            const module = modules.find(m => m.id === exam.moduleId);

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const moduleName = getModuleName(exam.moduleId).toLowerCase();
                const moduleCode = getModuleCode(exam.moduleId).toLowerCase();
                if (!moduleName.includes(searchLower) && !moduleCode.includes(searchLower)) {
                    return false;
                }
            }

            if (filters.teacher && module?.teacherId !== Number(filters.teacher)) return false;
            if (filters.room && !exam.roomIds?.includes(Number(filters.room))) return false;
            if (filters.group && !exam.groupIds?.includes(Number(filters.group))) return false;
            if (filters.examType && exam.type !== filters.examType) return false;

            return true;
        });
    }, [exams, filters, modules]);

    // Calendar navigation
    const navigateCalendar = (direction) => {
        const newDate = new Date(currentDate);
        if (calendarView === 'day') {
            newDate.setDate(newDate.getDate() + direction);
        } else if (calendarView === 'week') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        } else {
            newDate.setMonth(newDate.getMonth() + direction);
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => setCurrentDate(new Date());

    // Get days for calendar view
    const getCalendarDays = () => {
        const days = [];
        const start = new Date(currentDate);

        if (calendarView === 'day') {
            days.push(new Date(start));
        } else if (calendarView === 'week') {
            start.setDate(start.getDate() - start.getDay());
            for (let i = 0; i < 7; i++) {
                days.push(new Date(start));
                start.setDate(start.getDate() + 1);
            }
        } else {
            start.setDate(1);
            const month = start.getMonth();
            while (start.getMonth() === month) {
                days.push(new Date(start));
                start.setDate(start.getDate() + 1);
            }
        }
        return days;
    };

    // Get exams for a specific day
    const getExamsForDay = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return filteredExams.filter(exam => exam.date === dateStr);
    };

    // Get header text
    const getHeaderText = () => {
        if (calendarView === 'day') {
            return currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } else if (calendarView === 'week') {
            const start = new Date(currentDate);
            start.setDate(start.getDate() - start.getDay());
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        return currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    const clearFilters = () => {
        setFilters({ search: '', teacher: '', room: '', group: '', examType: '' });
    };

    const activeFilterCount = Object.values(filters).filter(v => v).length;

    return (
        <Box>
            <AdminPageHeader
                title="Exam Planning"
                subtitle="View and manage exam schedule"
            >
                <Button
                    variant={showFilters ? 'contained' : 'outlined'}
                    startIcon={<FilterListIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{ mr: 2, borderRadius: 2 }}
                >
                    Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </Button>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, newMode) => newMode && setViewMode(newMode)}
                    size="small"
                    sx={{
                        bgcolor: theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
                        borderRadius: 2
                    }}
                >
                    <ToggleButton value="calendar" sx={{ px: 2 }}>
                        <CalendarMonthIcon sx={{ mr: 1 }} /> Calendar
                    </ToggleButton>
                    <ToggleButton value="table" sx={{ px: 2 }}>
                        <ViewListIcon sx={{ mr: 1 }} /> Table
                    </ToggleButton>
                </ToggleButtonGroup>
            </AdminPageHeader>

            {/* Filter Panel */}
            <Collapse in={showFilters}>
                <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClear={clearFilters}
                    teachers={teachers}
                    rooms={rooms}
                    groups={groups}
                    examTypes={EXAM_TYPES}
                />
            </Collapse>

            <Grow in={true}>
                <Box>
                    {viewMode === 'calendar' ? (
                        <Box>
                            <CalendarControls
                                calendarView={calendarView}
                                onViewChange={setCalendarView}
                                onNavigate={navigateCalendar}
                                onToday={goToToday}
                                headerText={getHeaderText()}
                            />
                            <GlassmorphicCard sx={{ p: 0, overflow: 'hidden' }}>
                                <CalendarGrid
                                    calendarView={calendarView}
                                    days={getCalendarDays()}
                                    getExamsForDay={getExamsForDay}
                                    getModuleName={getModuleName}
                                    getModuleCode={getModuleCode}
                                    getRoomNames={getRoomNames}
                                    hasConflicts={hasConflicts}
                                />
                            </GlassmorphicCard>
                        </Box>
                    ) : (
                        <TableContainer component={GlassmorphicCard} sx={{ p: 0 }}>
                            <Table>
                                <TableHead sx={{ bgcolor: `${COLORS.primaryMain}0D` }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Module</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Rooms</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Teacher</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Groups</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Surveillants</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredExams.length > 0 ? (
                                        filteredExams.map((exam) => {
                                            const hasIssues = hasConflicts(exam);
                                            return (
                                                <TableRow
                                                    key={exam.id}
                                                    hover
                                                    sx={{
                                                        bgcolor: hasIssues ? `${COLORS.errorMain}08` : 'inherit',
                                                        '&:hover': {
                                                            bgcolor: hasIssues ? `${COLORS.errorMain}12` : undefined
                                                        }
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {hasIssues && (
                                                                <Tooltip title="Scheduling conflict detected">
                                                                    <WarningIcon sx={{ color: COLORS.errorMain, fontSize: 18 }} />
                                                                </Tooltip>
                                                            )}
                                                            <Box>
                                                                <Chip label={getModuleCode(exam.moduleId)} size="small" variant="outlined" sx={{ mb: 0.5 }} />
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {getModuleName(exam.moduleId)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ fontWeight: 600 }}>{exam.date}</Typography>
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                            {exam.startTime} ({exam.duration}min)
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusChip label={exam.type} variant="secondary" />
                                                    </TableCell>
                                                    <TableCell>{getRoomNames(exam.roomIds)}</TableCell>
                                                    <TableCell>{getResponsibleTeacher(exam.moduleId)}</TableCell>
                                                    <TableCell>{getGroupNames(exam.groupIds)}</TableCell>
                                                    <TableCell>
                                                        <StatusChip
                                                            label={`${exam.surveillantIds?.length || 0} assigned`}
                                                            variant={exam.surveillantIds?.length > 0 ? 'success' : 'warning'}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusChip
                                                            label={exam.status || 'Scheduled'}
                                                            variant="info"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" sx={{ py: 6, color: theme.palette.text.secondary }}>
                                                No exams found matching the current filters
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Grow>
        </Box>
    );
}
