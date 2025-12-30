import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { COLORS } from '../../../theme/themeConstants';
import ExamCard from './ExamCard';

// Mixed primary/secondary color scheme (matching CalendarGrid)
const CALENDAR_COLORS = {
    // Today highlight - secondary (purple)
    today: {
        light: `${COLORS.secondaryMain}12`,
        dark: `${COLORS.secondaryMain}18`
    },
    // Regular header - primary (green)
    header: {
        light: `${COLORS.primaryMain}08`,
        dark: `${COLORS.primaryMain}12`
    },
    // Today badge - secondary (purple)
    todayBadge: {
        light: COLORS.secondaryMain,
        dark: COLORS.secondaryMain
    }
};

/**
 * Single day column for week/day calendar views
 */
export default function CalendarDayColumn({
    day,
    exams,
    getModuleName,
    getModuleCode,
    getRoomNames,
    hasConflicts
}) {
    const theme = useTheme();
    const isToday = day.toDateString() === new Date().toDateString();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                flex: 1,
                minWidth: 0,
                borderRight: `1px solid ${theme.palette.divider}`,
                '&:last-child': { borderRight: 'none' }
            }}
        >
            {/* Day header - today uses secondary bg, regular uses primary */}
            <Box sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: isToday
                    ? (isDark ? CALENDAR_COLORS.today.dark : CALENDAR_COLORS.today.light)
                    : (isDark ? CALENDAR_COLORS.header.dark : CALENDAR_COLORS.header.light),
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                {/* Day name - secondary for today, primary for regular */}
                <Typography
                    variant="body2"
                    sx={{
                        color: isToday ? COLORS.secondaryMain : COLORS.primaryMain,
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        mb: 0.5
                    }}
                >
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </Typography>
                {/* Date number - purple badge for today */}
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: isToday ? 700 : 600,
                        color: isToday ? 'white' : theme.palette.text.primary,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: isToday ? CALENDAR_COLORS.todayBadge[isDark ? 'dark' : 'light'] : 'transparent',
                        boxShadow: isToday ? `0 2px 8px ${COLORS.secondaryMain}60` : 'none'
                    }}
                >
                    {day.getDate()}
                </Typography>
            </Box>

            {/* Exams for day */}
            <Box sx={{
                p: 1.5,
                minHeight: 300,
                bgcolor: theme.palette.background.paper
            }}>
                {exams.length > 0 ? exams.map(exam => (
                    <ExamCard
                        key={exam.id}
                        exam={exam}
                        moduleName={getModuleName(exam.moduleId)}
                        moduleCode={getModuleCode(exam.moduleId)}
                        roomNames={getRoomNames(exam.roomIds)}
                        hasConflicts={hasConflicts(exam)}
                        variant="full"
                    />
                )) : (
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.disabled,
                            textAlign: 'center',
                            py: 4,
                            fontStyle: 'italic'
                        }}
                    >
                        No exams scheduled
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
