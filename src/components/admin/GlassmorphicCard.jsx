import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GLASSMORPHISM } from '../../theme/themeConstants';

/**
 * Reusable glassmorphic card container with consistent styling
 * @param {boolean} compact - Use smaller padding and border radius
 * @param {object} sx - Additional sx props to merge
 * @param {React.ReactNode} children - Card content
 */
export default function GlassmorphicCard({
    children,
    compact = false,
    sx = {},
    ...props
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Paper
            elevation={0}
            sx={{
                p: compact ? 2 : 3,
                borderRadius: compact ? '16px' : '24px',
                background: isDark ? GLASSMORPHISM.card.dark : GLASSMORPHISM.card.light,
                backdropFilter: GLASSMORPHISM.card.blur,
                border: `1px solid ${isDark ? GLASSMORPHISM.card.border.dark : GLASSMORPHISM.card.border.light}`,
                ...sx
            }}
            {...props}
        >
            {children}
        </Paper>
    );
}
