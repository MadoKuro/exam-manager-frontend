import { Box, Typography, Card, CardContent, Tooltip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTheme } from '@mui/material/styles';
import { COLORS, ANIMATIONS } from '../../../theme/themeConstants';
import { StatusChip } from '../index';

// Consistent exam card color scheme
const EXAM_CARD_COLORS = {
    // Normal exam card
    normal: {
        light: {
            bg: `linear-gradient(135deg, ${COLORS.primaryMain}10 0%, ${COLORS.secondaryMain}08 100%)`,
            border: `1px solid ${COLORS.primaryMain}20`,
            accent: COLORS.primaryMain
        },
        dark: {
            bg: `linear-gradient(135deg, ${COLORS.primaryMain}15 0%, ${COLORS.secondaryMain}10 100%)`,
            border: `1px solid ${COLORS.primaryMain}30`,
            accent: COLORS.primaryMain
        }
    },
    // Conflict exam card
    conflict: {
        light: {
            bg: `linear-gradient(135deg, ${COLORS.errorLight} 0%, ${COLORS.errorLight} 100%)`,
            border: `2px solid ${COLORS.errorMain}`,
            accent: COLORS.errorMain
        },
        dark: {
            bg: `linear-gradient(135deg, ${COLORS.errorMain}20 0%, ${COLORS.errorMain}08 100%)`,
            border: `2px solid ${COLORS.errorMain}`,
            accent: COLORS.errorMain
        }
    },
    // Compact card (month view)
    compact: {
        normal: {
            light: `${COLORS.primaryMain}12`,
            dark: `${COLORS.primaryMain}18`
        },
        conflict: {
            light: `${COLORS.errorMain}15`,
            dark: `${COLORS.errorMain}20`
        },
        hover: {
            normal: {
                light: `${COLORS.primaryMain}20`,
                dark: `${COLORS.primaryMain}28`
            },
            conflict: {
                light: `${COLORS.errorMain}22`,
                dark: `${COLORS.errorMain}30`
            }
        }
    }
};

/**
 * Individual exam event card for calendar views
 */
export default function ExamCard({
    exam,
    moduleName,
    moduleCode,
    roomNames,
    hasConflicts = false,
    variant = 'full' // 'full' | 'compact'
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const mode = isDark ? 'dark' : 'light';

    // Compact variant for month view
    if (variant === 'compact') {
        const bgColor = hasConflicts
            ? EXAM_CARD_COLORS.compact.conflict[mode]
            : EXAM_CARD_COLORS.compact.normal[mode];
        const hoverBgColor = hasConflicts
            ? EXAM_CARD_COLORS.compact.hover.conflict[mode]
            : EXAM_CARD_COLORS.compact.hover.normal[mode];
        const accentColor = hasConflicts ? COLORS.errorMain : COLORS.primaryMain;

        return (
            <Box
                sx={{
                    p: 0.5,
                    px: 1,
                    borderRadius: '6px',
                    bgcolor: bgColor,
                    borderLeft: `3px solid ${accentColor}`,
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: hoverBgColor,
                        transform: 'translateX(2px)'
                    },
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        color: theme.palette.text.primary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {moduleCode}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: '0.65rem',
                        color: theme.palette.text.secondary,
                        fontWeight: 500
                    }}
                >
                    {exam.startTime}
                </Typography>
            </Box>
        );
    }

    // Full variant for day/week view
    const cardColors = hasConflicts
        ? EXAM_CARD_COLORS.conflict[mode]
        : EXAM_CARD_COLORS.normal[mode];

    return (
        <Card
            elevation={0}
            sx={{
                mb: 1.5,
                borderRadius: '12px',
                background: cardColors.bg,
                border: cardColors.border,
                transition: `all ${ANIMATIONS.duration.normal} ${ANIMATIONS.easing.smooth}`,
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: isDark
                        ? `0 4px 20px rgba(0,0,0,0.3)`
                        : `0 4px 20px rgba(0,0,0,0.08)`
                }
            }}
        >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                {/* Header row with time and type */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {hasConflicts && (
                        <Tooltip title="Scheduling conflict detected">
                            <WarningIcon sx={{ color: COLORS.errorMain, fontSize: 18 }} />
                        </Tooltip>
                    )}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: cardColors.accent,
                        fontWeight: 700
                    }}>
                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'inherit' }}>
                            {exam.startTime}
                        </Typography>
                    </Box>
                    <StatusChip
                        label={exam.type}
                        variant="secondary"
                        sx={{ height: 22, fontSize: '0.7rem' }}
                    />
                </Box>

                {/* Module name */}
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {moduleName}
                </Typography>

                {/* Room and duration info */}
                <Typography
                    variant="caption"
                    sx={{
                        color: theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                    }}
                >
                    {roomNames} • {exam.duration}min
                </Typography>
            </CardContent>
        </Card>
    );
}
