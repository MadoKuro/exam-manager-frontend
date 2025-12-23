import { Typography } from '@mui/material';
import { GRADIENTS } from '../theme/themeConstants';

/**
 * Reusable gradient text component
 * @param {string} children - Text content
 * @param {object} sx - Additional styles
 */
export default function GradientText({ children, variant = 'h5', sx = {}, ...props }) {
    return (
        <Typography
            variant={variant}
            sx={{
                fontWeight: 800,
                background: GRADIENTS.brand,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                ...sx,
            }}
            {...props}
        >
            {children}
        </Typography>
    );
}

