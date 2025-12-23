import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GradientText from '../GradientText';
import { COLORS, GRADIENTS } from '../../theme/themeConstants';

/**
 * Shared sidebar header component with logo and role badge
 * @param {string} role - User role to display (e.g., 'Student', 'Teacher')
 */
export default function SidebarHeader({ role }) {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 2.5,
            px: 2,
            width: '100%',
            mb: 1
        }}>
            <Box sx={{
                width: 36,
                height: 36,
                background: GRADIENTS.brand,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                boxShadow: '0 2px 8px -2px rgba(139, 92, 246, 0.3)'
            }}>
                <SchoolIcon sx={{ fontSize: 20, color: 'white' }} />
            </Box>
            <GradientText variant="h6" sx={{ mb: 0, fontWeight: 700, letterSpacing: '-0.3px', fontSize: '1rem', textAlign: 'center' }}>
                UniManager
            </GradientText>
            {role && (
                <Typography variant="caption" sx={{
                    color: COLORS.primaryMain,
                    fontWeight: 500,
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase',
                    fontSize: '0.6rem',
                    opacity: 0.8
                }}>
                    {role}
                </Typography>
            )}
        </Box>
    );
}
