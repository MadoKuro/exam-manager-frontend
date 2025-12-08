import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView'; // For Excel icon proxy

export default function StudentSchedule() {
    const [view, setView] = useState('list');
    const [filterModule, setFilterModule] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Mock Data
    const exams = [
        { id: 1, module: 'Algorithmics 2', date: '2026-01-12', time: '10:00 - 12:00', room: 'Room 23', teacher: 'Mr. X', type: 'Final Exam' },
        { id: 2, module: 'Web Development', date: '2026-01-14', time: '14:00 - 16:00', room: 'Lab 04', teacher: 'Mrs. Y', type: 'Lab Test' },
        { id: 3, module: 'Databases', date: '2026-01-16', time: '08:30 - 10:30', room: 'Amphi A', teacher: 'Mr. Z', type: 'Final Exam' },
        { id: 4, module: 'Mathematics', date: '2026-01-19', time: '10:00 - 12:00', room: 'Room 12', teacher: 'Mrs. A', type: 'Regular' },
        { id: 5, module: 'English', date: '2026-01-21', time: '13:00 - 14:00', room: 'Room 05', teacher: 'Mr. B', type: 'Regular' },
    ];

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    const filteredExams = exams.filter(exam => {
        const matchesModule = exam.module.toLowerCase().includes(filterModule.toLowerCase());
        const matchesType = filterType === 'all' || exam.type === filterType;
        return matchesModule && matchesType;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'Final Exam': return 'error';
            case 'Lab Test': return 'info';
            case 'Regular': return 'success';
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

            <Card sx={{ mb: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
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
                                <MenuItem value="Final Exam">Final Exam</MenuItem>
                                <MenuItem value="Lab Test">Lab Test</MenuItem>
                                <MenuItem value="Regular">Regular</MenuItem>
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
                <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ background: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b' }}>
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
                            <Paper sx={{ p: 2, height: '100%', minHeight: 200, bgcolor: 'background.paper', borderRadius: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
                                    {day}
                                </Typography>
                                {filteredExams
                                    .filter(e => {
                                        // Simple mock match for demo purposes based on day string presence or random logic if real dates were parsed
                                        // keeping it simple: match exact dates from mock data
                                        if (e.date === '2026-01-12' && day.includes('12/01')) return true;
                                        if (e.date === '2026-01-14' && day.includes('14/01')) return true;
                                        if (e.date === '2026-01-16' && day.includes('16/01')) return true;
                                        return false;
                                    })
                                    .map(exam => (
                                        <Card key={exam.id} variant="outlined" sx={{ mb: 1, borderRadius: 2, borderColor: (theme) => theme.palette[getTypeColor(exam.type)].main }}>
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
