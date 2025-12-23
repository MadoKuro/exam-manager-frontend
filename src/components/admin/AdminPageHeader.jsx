import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { COLORS } from '../../theme/themeConstants';

/**
 * Reusable admin page header with title, subtitle, and action buttons
 */
export default function AdminPageHeader({
    title,
    subtitle,
    onAdd,
    addLabel = 'Add',
    children // For additional buttons like import
}) {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                    <Typography variant="h3" fontWeight="900" sx={{
                        color: theme.palette.text.primary,
                        letterSpacing: '-1px'
                    }}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="h6" sx={{ color: COLORS.primaryMain, opacity: 0.8 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {children}
                    {onAdd && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={onAdd}
                            sx={{ borderRadius: 2 }}
                        >
                            {addLabel}
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
