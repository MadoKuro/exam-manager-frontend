import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { GRADIENTS } from '../../../theme/themeConstants';

/**
 * Convocations List placeholder page
 */
export default function ConvocationsList() {
    const theme = useTheme();

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Convocations
            </Typography>
            <Box
                sx={{
                    p: 4,
                    borderRadius: '16px',
                    background: theme.palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.7)'
                        : 'rgba(31, 41, 55, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        background: GRADIENTS.brand,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 8px 24px -8px rgba(139, 92, 246, 0.4)',
                    }}
                >
                    <MailOutlineIcon sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Exam Convocations
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Generate and send exam convocation letters to students and surveillants.
                </Typography>
            </Box>
        </Box>
    );
}
