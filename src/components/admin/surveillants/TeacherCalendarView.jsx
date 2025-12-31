import { Box, Typography, CardContent, Grid, Avatar, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import GlassmorphicCard from '../GlassmorphicCard';
import { COLORS } from '../../../theme/themeConstants';

/**
 * Teacher calendar/availability view
 * Shows teacher cards with their assigned exams and availability status
 */
export default function TeacherCalendarView({
    teachers,
    teacherWorkload,
    getTeacherExams,
    getModuleName
}) {
    const theme = useTheme();

    return (
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
                            <GlassmorphicCard
                                variant="compact"
                                rounded="medium"
                                hoverEffect="lift"
                            >
                                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
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
                            </GlassmorphicCard>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}

TeacherCalendarView.propTypes = {
    /** Array of teacher objects */
    teachers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
    /** Object mapping teacher IDs to workload count */
    teacherWorkload: PropTypes.object.isRequired,
    /** Function to get teacher's exams */
    getTeacherExams: PropTypes.func.isRequired,
    /** Function to get module name by ID */
    getModuleName: PropTypes.func.isRequired,
};
