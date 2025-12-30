import { Box, Typography, IconButton, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import GlassmorphicCard from '../GlassmorphicCard';

/**
 * Calendar navigation controls for PlanningView
 */
export default function CalendarControls({
    calendarView,
    onViewChange,
    onNavigate,
    onToday,
    headerText
}) {
    return (
        <GlassmorphicCard
            compact
            sx={{
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => onNavigate(-1)}>
                    <ChevronLeftIcon />
                </IconButton>
                <IconButton onClick={() => onNavigate(1)}>
                    <ChevronRightIcon />
                </IconButton>
                <Button
                    size="small"
                    startIcon={<TodayIcon />}
                    onClick={onToday}
                    sx={{ ml: 1 }}
                >
                    Today
                </Button>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {headerText}
            </Typography>

            <ToggleButtonGroup
                value={calendarView}
                exclusive
                onChange={(e, newView) => newView && onViewChange(newView)}
                size="small"
            >
                <ToggleButton value="day">Day</ToggleButton>
                <ToggleButton value="week">Week</ToggleButton>
                <ToggleButton value="month">Month</ToggleButton>
            </ToggleButtonGroup>
        </GlassmorphicCard>
    );
}
