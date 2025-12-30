import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Grow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAdminData } from '../../../context/AdminDataContext';
import { AdminPageHeader, GlassmorphicCard, StatusChip } from '../../../components/admin';
import { COLORS } from '../../../theme/themeConstants';
import {
    getModuleName,
    getModuleCode,
    getRoomNames,
    getResponsibleTeacherObj,
    getStudentCount,
    getSurveillantCount,
    formatDuration
} from '../../../utils/examHelpers';

/**
 * Convocations list page - shows all exams with convocation options
 */
export default function ConvocationsList() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { exams, modules, rooms, teachers, groups, students } = useAdminData();

    return (
        <Box>
            <AdminPageHeader
                title="Exam Convocations"
                subtitle="Generate and send convocation letters"
            />

            <Grow in={true}>
                <TableContainer component={GlassmorphicCard} sx={{ p: 0 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: `${COLORS.primaryMain}0D` }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Exam</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Rooms</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Responsible</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Students</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Surveillants</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: 200 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {exams.length > 0 ? (
                                exams.map((exam) => {
                                    const responsibleTeacher = getResponsibleTeacherObj(exam.moduleId, modules, teachers);
                                    const studentCountVal = getStudentCount(exam.groupIds, students);
                                    const surveillantCountVal = getSurveillantCount(exam.surveillantIds);

                                    return (
                                        <TableRow key={exam.id} hover>
                                            <TableCell>
                                                <Box>
                                                    <Chip
                                                        label={getModuleCode(exam.moduleId, modules)}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ mb: 0.5 }}
                                                    />
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {getModuleName(exam.moduleId, modules)}
                                                    </Typography>
                                                    <StatusChip
                                                        label={exam.type}
                                                        variant="secondary"
                                                        sx={{ height: 20, fontSize: '0.7rem', mt: 0.5 }}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 600 }}>{exam.date}</Typography>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                    {exam.startTime} ({formatDuration(exam.duration)})
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{getRoomNames(exam.roomIds, rooms)}</TableCell>
                                            <TableCell>
                                                {responsibleTeacher ? (
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {responsibleTeacher.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                            {responsibleTeacher.email}
                                                        </Typography>
                                                    </Box>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <StatusChip
                                                    label={`${studentCountVal} students`}
                                                    variant={studentCountVal > 0 ? 'success' : 'warning'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <StatusChip
                                                    label={`${surveillantCountVal} assigned`}
                                                    variant={surveillantCountVal > 0 ? 'success' : 'warning'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<VisibilityIcon />}
                                                        onClick={() => navigate(`/admin/convocations/${exam.id}`)}
                                                        sx={{ borderRadius: 2 }}
                                                    >
                                                        View
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: theme.palette.text.secondary }}>
                                        No exams found. Create exams first to generate convocations.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grow>
        </Box>
    );
}
