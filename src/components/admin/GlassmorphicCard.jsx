import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { GLASSMORPHISM, ANIMATIONS } from '../../theme/themeConstants';

/**
 * Reusable glassmorphic card container with consistent styling
 * 
 * @param {string} variant - 'default' | 'compact' | 'elevated' - Card size/style variant
 * @param {string} hoverEffect - 'none' | 'lift' | 'glow' - Hover animation type
 * @param {string} rounded - 'small' | 'medium' | 'large' - Border radius size
 * @param {boolean} noPadding - Remove default padding
 * @param {object} sx - Additional sx props to merge
 * @param {React.ReactNode} children - Card content
 */
export default function GlassmorphicCard({
    children,
    variant = 'default',
    hoverEffect = 'none',
    rounded = 'large',
    noPadding = false,
    sx = {},
    ...props
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Border radius mapping
    const radiusMap = {
        small: '12px',
        medium: '16px',
        large: '24px',
    };

    // Padding based on variant
    const paddingMap = {
        default: 3,
        compact: 2,
        elevated: 3,
    };

    // Hover effects
    const hoverStyles = {
        none: {},
        lift: {
            transition: `all ${ANIMATIONS.duration.normal} ${ANIMATIONS.easing.smooth}`,
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: isDark
                    ? '0 12px 32px -8px rgba(0,0,0,0.5)'
                    : '0 12px 32px -8px rgba(0,0,0,0.12)',
            },
        },
        glow: {
            transition: `all ${ANIMATIONS.duration.normal} ${ANIMATIONS.easing.smooth}`,
            '&:hover': {
                boxShadow: isDark
                    ? '0 0 24px rgba(16,185,129,0.2)'
                    : '0 0 24px rgba(16,185,129,0.15)',
            },
        },
    };

    // Elevated variant adds extra shadow
    const elevatedStyles = variant === 'elevated' ? {
        boxShadow: isDark
            ? '0 8px 24px -6px rgba(0,0,0,0.4)'
            : '0 8px 24px -6px rgba(0,0,0,0.08)',
    } : {};

    return (
        <Paper
            elevation={0}
            sx={{
                p: noPadding ? 0 : paddingMap[variant],
                borderRadius: radiusMap[rounded],
                background: isDark ? GLASSMORPHISM.card.dark : GLASSMORPHISM.card.light,
                backdropFilter: GLASSMORPHISM.card.blur,
                border: `1px solid ${isDark ? GLASSMORPHISM.card.border.dark : GLASSMORPHISM.card.border.light}`,
                ...elevatedStyles,
                ...hoverStyles[hoverEffect],
                ...sx
            }}
            {...props}
        >
            {children}
        </Paper>
    );
}

GlassmorphicCard.propTypes = {
    /** Card content */
    children: PropTypes.node.isRequired,
    /** Card size/style variant */
    variant: PropTypes.oneOf(['default', 'compact', 'elevated']),
    /** Hover animation type */
    hoverEffect: PropTypes.oneOf(['none', 'lift', 'glow']),
    /** Border radius size */
    rounded: PropTypes.oneOf(['small', 'medium', 'large']),
    /** Remove default padding */
    noPadding: PropTypes.bool,
    /** Additional MUI sx props */
    sx: PropTypes.object,
};
