import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, IconButton, Tooltip, CardContent, Grid, Avatar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GlassmorphicCard from '../GlassmorphicCard';
import { GLASSMORPHISM, COLORS, GRADIENTS } from '../../../theme/themeConstants';

/**
 * Teachers list view with table and exam cards
 * Used in SurveillantsList for the "list" view mode
 */
export default function TeachersListView({
    teachers,
    exams,
    teacherWorkload,
    getModuleName,
    onOpenAssignDialog,
    onAutoAssign
}) {
    const theme = useTheme();

    return (
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
                        <GlassmorphicCard
                            key={exam.id}
                            variant="compact"
                            rounded="medium"
                            hoverEffect="lift"
                        >
                            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
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
                                        onClick={() => onOpenAssignDialog(exam)}
                                        sx={{ flex: 1, borderRadius: 2 }}
                                    >
                                        Assign
                                    </Button>
                                    <Tooltip title="Auto-assign available teachers">
                                        <IconButton
                                            size="small"
                                            onClick={() => onAutoAssign(exam)}
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
                        </GlassmorphicCard>
                    ))}
                </Box>
            </Grid>
        </Grid>
    );
}

TeachersListView.propTypes = {
    /** Array of teacher objects */
    teachers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string,
    })).isRequired,
    /** Array of exam objects */
    exams: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        moduleId: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        startTime: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        surveillantIds: PropTypes.arrayOf(PropTypes.number),
    })).isRequired,
    /** Object mapping teacher IDs to workload count */
    teacherWorkload: PropTypes.object.isRequired,
    /** Function to get module name by ID */
    getModuleName: PropTypes.func.isRequired,
    /** Callback when assign dialog should open */
    onOpenAssignDialog: PropTypes.func.isRequired,
    /** Callback for auto-assign action */
    onAutoAssign: PropTypes.func.isRequired,
};
