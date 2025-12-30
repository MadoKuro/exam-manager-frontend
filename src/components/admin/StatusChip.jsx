import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { COLORS } from '../../theme/themeConstants';

/**
 * Status chip with consistent Light/Dark mode theming
 * @param {string} label - Chip text
 * @param {string} variant - 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary'
 * @param {string} size - 'small' | 'medium'
 */
export default function StatusChip({
    label,
    variant = 'info',
    size = 'small',
    sx = {},
    ...props
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Color configurations for each variant
    const colorConfig = {
        success: {
            bg: isDark ? `${COLORS.successMain}25` : COLORS.successLight,
            color: isDark ? COLORS.successMain : COLORS.successDark,
            border: COLORS.successMain
        },
        warning: {
            bg: isDark ? `${COLORS.warningMain}25` : COLORS.warningLight,
            color: isDark ? COLORS.warningMain : COLORS.warningDark,
            border: COLORS.warningMain
        },
        error: {
            bg: isDark ? `${COLORS.errorMain}25` : COLORS.errorLight,
            color: isDark ? COLORS.errorMain : COLORS.errorDark,
            border: COLORS.errorMain
        },
        info: {
            bg: isDark ? `${COLORS.infoMain}20` : `${COLORS.infoMain}15`,
            color: isDark ? COLORS.infoMain : COLORS.infoDark,
            border: COLORS.infoMain
        },
        primary: {
            bg: isDark ? `${COLORS.primaryMain}25` : `${COLORS.primaryMain}20`,
            color: isDark ? COLORS.primaryMain : COLORS.primaryMain,
            border: COLORS.primaryMain
        },
        secondary: {
            bg: isDark ? `${COLORS.secondaryMain}25` : `${COLORS.secondaryMain}20`,
            color: isDark ? COLORS.secondaryMain : COLORS.secondaryDark,
            border: COLORS.secondaryMain
        }
    };

    const config = colorConfig[variant] || colorConfig.info;

    return (
        <Chip
            label={label}
            size={size}
            sx={{
                bgcolor: config.bg,
                color: config.color,
                fontWeight: 600,
                border: isDark ? `1px solid ${config.border}40` : 'none',
                transition: 'all 0.3s ease',
                ...sx
            }}
            {...props}
        />
    );
}
