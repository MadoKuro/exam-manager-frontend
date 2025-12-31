import { useState, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, ToggleButton, ToggleButtonGroup, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import { GLASSMORPHISM, COLORS } from '../../theme/themeConstants';
import { useAdminData } from '../../context/AdminDataContext';

export default function StudentSchedule() {
    const theme = useTheme();
    const [view, setView] = useState('list');
    const [filterModule, setFilterModule] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Get data from shared context
    const { exams, modules, teachers, rooms } = useAdminData();

    // Helper functions to lookup related data
    const getModuleName = (moduleId) => modules.find(m => m.id === moduleId)?.name || 'Unknown Module';
    const getTeacherName = (moduleId) => {
        const module = modules.find(m => m.id === moduleId);
        return teachers.find(t => t.id === module?.teacherId)?.name || 'TBD';
    };
    const getRoomNames = (roomIds) => {
        if (!roomIds?.length) return 'TBD';
        return roomIds.map(id => rooms.find(r => r.id === id)?.name || 'Room').join(', ');
    };

    // Transform exams data for display
    const displayExams = useMemo(() => exams.map(exam => ({
        id: exam.id,
        module: getModuleName(exam.moduleId),
        date: exam.date,
        time: `${exam.startTime} - ${calculateEndTime(exam.startTime, exam.duration)}`,
        room: getRoomNames(exam.roomIds),
        teacher: getTeacherName(exam.moduleId),
        type: exam.type || 'Final Exam'
    })), [exams, modules, teachers, rooms]);

    // Helper to calculate end time
    function calculateEndTime(startTime, durationMinutes) {
        const [hours, mins] = startTime.split(':').map(Number);
        const totalMins = hours * 60 + mins + durationMinutes;
        const endHours = Math.floor(totalMins / 60) % 24;
        const endMins = totalMins % 60;
        return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
    }

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    const filteredExams = displayExams.filter(exam => {
        const matchesModule = exam.module.toLowerCase().includes(filterModule.toLowerCase());
        const matchesType = filterType === 'all' || exam.type === filterType;
        return matchesModule && matchesType;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'Written': return 'error';
            case 'Oral': return 'info';
            case 'Practical': return 'success';
            case 'Online': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Exams Schedule
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        startIcon={<PictureAsPdfIcon />}
                        variant="outlined"
                        color="error"
                        sx={{ borderRadius: '12px', textTransform: 'none' }}
                    >
                        PDF
                    </Button>
                    <Button
                        startIcon={<TableViewIcon />}
                        variant="outlined"
                        color="success"
                        sx={{ borderRadius: '12px', textTransform: 'none' }}
                    >
                        Excel
                    </Button>
                </Box>
            </Box>

            <Card sx={{
                mb: 4,
                borderRadius: 4,
                background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                backdropFilter: GLASSMORPHISM.card.blur,
                border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search by module..."
                                value={filterModule}
                                onChange={(e) => setFilterModule(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                size="small"
                                label="Exam Type"
                            >
                                <MenuItem value="all">All Types</MenuItem>
                                <MenuItem value="Written">Written</MenuItem>
                                <MenuItem value="Oral">Oral</MenuItem>
                                <MenuItem value="Practical">Practical</MenuItem>
                                <MenuItem value="Online">Online</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <ToggleButtonGroup
                                value={view}
                                exclusive
                                onChange={handleViewChange}
                                aria-label="view mode"
                                size="small"
                            >
                                <ToggleButton value="list" aria-label="list view">
                                    <ViewListIcon />
                                </ToggleButton>
                                <ToggleButton value="calendar" aria-label="calendar view">
                                    <CalendarMonthIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {view === 'list' && (
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 4,
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: 'divider',
                        background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                        backdropFilter: GLASSMORPHISM.card.blur,
                    }}
                >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: `${COLORS.primaryMain}0D` }}>
                                <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Room</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Teacher</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredExams.map((exam) => (
                                <TableRow key={exam.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{exam.module}</TableCell>
                                    <TableCell>{exam.date}</TableCell>
                                    <TableCell>{exam.time}</TableCell>
                                    <TableCell>
                                        <Chip label={exam.room} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{exam.teacher}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={exam.type}
                                            size="small"
                                            color={getTypeColor(exam.type)}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredExams.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">No exams found matching your filters.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {view === 'calendar' && (
                <Grid container spacing={2}>
                    {/* Simple Weekly View Mockup */}
                    {['Monday 12/01', 'Tuesday 13/01', 'Wednesday 14/01', 'Thursday 15/01', 'Friday 16/01'].map((day, index) => (
                        <Grid item xs={12} sm={6} md={2.4} key={index}>
                            <Paper sx={{
                                p: 2,
                                height: '100%',
                                minHeight: 200,
                                bgcolor: 'background.paper',
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                                    {day}
                                </Typography>
                                {filteredExams
                                    .filter(e => {
                                        if (e.date === '2026-01-12' && day.includes('12/01')) return true;
                                        if (e.date === '2026-01-14' && day.includes('14/01')) return true;
                                        if (e.date === '2026-01-16' && day.includes('16/01')) return true;
                                        return false;
                                    })
                                    .map(exam => (
                                        <Card key={exam.id} variant="outlined" sx={{
                                            mb: 1,
                                            borderRadius: 2,
                                            borderColor: (theme) => theme.palette[getTypeColor(exam.type)].main
                                        }}>
                                            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                    {exam.time}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, my: 0.5 }}>
                                                    {exam.module}
                                                </Typography>
                                                <Typography variant="caption" display="block">
                                                    {exam.room}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
