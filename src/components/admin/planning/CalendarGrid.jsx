import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { COLORS } from '../../../theme/themeConstants';
import ExamCard from './ExamCard';
import CalendarDayColumn from './CalendarDayColumn';

// Mixed primary/secondary calendar color scheme
const CALENDAR_COLORS = {
    // Today cell highlight - secondary (purple)
    today: {
        light: `${COLORS.secondaryMain}12`,
        dark: `${COLORS.secondaryMain}18`
    },
    // Header row - primary (green) tint
    header: {
        light: `${COLORS.primaryMain}08`,
        dark: `${COLORS.primaryMain}12`
    },
    // Hover effect - primary (green)
    hover: {
        light: `${COLORS.primaryMain}05`,
        dark: `${COLORS.primaryMain}08`
    },
    // Today date badge - secondary (purple)
    todayBadge: {
        light: COLORS.secondaryMain,
        dark: COLORS.secondaryMain
    }
};

/**
 * Calendar grid component supporting day, week, and month views
 */
export default function CalendarGrid({
    calendarView,
    days,
    getExamsForDay,
    getModuleName,
    getModuleCode,
    getRoomNames,
    hasConflicts
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Month view with CSS Grid
    if (calendarView === 'month') {
        return (
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '1px',
                bgcolor: theme.palette.divider,
            }}>
                {/* Day Headers - primary color */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Box key={day} sx={{
                        p: 1.5,
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        color: COLORS.primaryMain,
                        bgcolor: isDark ? CALENDAR_COLORS.header.dark : CALENDAR_COLORS.header.light,
                    }}>
                        {day}
                    </Box>
                ))}

                {/* Empty cells for start of month */}
                {Array.from({ length: days[0]?.getDay() || 0 }).map((_, i) => (
                    <Box key={`empty-${i}`} sx={{
                        minHeight: 120,
                        bgcolor: theme.palette.background.paper,
                        opacity: 0.5
                    }} />
                ))}

                {/* Calendar Days */}
                {days.map((day, index) => {
                    const dayExams = getExamsForDay(day);
                    const isToday = day.toDateString() === new Date().toDateString();
                    return (
                        <Box key={index} sx={{
                            minHeight: 120,
                            p: 1,
                            bgcolor: isToday
                                ? (isDark ? CALENDAR_COLORS.today.dark : CALENDAR_COLORS.today.light)
                                : theme.palette.background.paper,
                            '&:hover': {
                                bgcolor: isToday
                                    ? (isDark ? CALENDAR_COLORS.today.dark : CALENDAR_COLORS.today.light)
                                    : (isDark ? CALENDAR_COLORS.hover.dark : CALENDAR_COLORS.hover.light)
                            }
                        }}>
                            {/* Today badge uses secondary (purple), regular days use primary (green) for number */}
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: isToday ? 700 : 500,
                                    color: isToday ? 'white' : theme.palette.text.primary,
                                    mb: 1,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    bgcolor: isToday ? CALENDAR_COLORS.todayBadge[isDark ? 'dark' : 'light'] : 'transparent',
                                    boxShadow: isToday ? `0 2px 8px ${COLORS.secondaryMain}60` : 'none'
                                }}
                            >
                                {day.getDate()}
                            </Typography>

                            {/* Exam indicators */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                {dayExams.slice(0, 3).map(exam => (
                                    <ExamCard
                                        key={exam.id}
                                        exam={exam}
                                        moduleCode={getModuleCode(exam.moduleId)}
                                        hasConflicts={hasConflicts(exam)}
                                        variant="compact"
                                    />
                                ))}
                                {/* Overflow text uses primary (green) */}
                                {dayExams.length > 3 && (
                                    <Typography variant="caption" sx={{
                                        color: COLORS.primaryMain,
                                        fontWeight: 600,
                                        pl: 0.5,
                                        fontSize: '0.7rem'
                                    }}>
                                        +{dayExams.length - 3} more
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        );
    }

    // Day/Week view with columns
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            {days.map((day, index) => (
                <CalendarDayColumn
                    key={index}
                    day={day}
                    exams={getExamsForDay(day)}
                    getModuleName={getModuleName}
                    getModuleCode={getModuleCode}
                    getRoomNames={getRoomNames}
                    hasConflicts={hasConflicts}
                />
            ))}
        </Box>
    );
}

// Export color scheme for consistency across calendar components
export { CALENDAR_COLORS };
