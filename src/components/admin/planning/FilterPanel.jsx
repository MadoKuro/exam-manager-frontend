import {
    Box, TextField, MenuItem, InputAdornment, Stack, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import GlassmorphicCard from '../GlassmorphicCard';

/**
 * Collapsible filter panel for exam planning view
 */
export default function FilterPanel({
    filters,
    onFiltersChange,
    onClear,
    teachers = [],
    rooms = [],
    groups = [],
    examTypes = []
}) {
    const theme = useTheme();

    const handleChange = (field) => (e) => {
        onFiltersChange({ ...filters, [field]: e.target.value });
    };

    const activeFilterCount = Object.values(filters).filter(v => v).length;

    return (
        <GlassmorphicCard compact sx={{ mb: 3 }}>
            <Stack spacing={2}>
                <TextField
                    fullWidth
                    label="Search"
                    placeholder="Search by module name or code..."
                    value={filters.search}
                    onChange={handleChange('search')}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    select
                    fullWidth
                    label="Teacher"
                    value={filters.teacher}
                    onChange={handleChange('teacher')}
                >
                    <MenuItem value="">All Teachers</MenuItem>
                    {teachers.map(t => (
                        <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    fullWidth
                    label="Room"
                    value={filters.room}
                    onChange={handleChange('room')}
                >
                    <MenuItem value="">All Rooms</MenuItem>
                    {rooms.map(r => (
                        <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    fullWidth
                    label="Group"
                    value={filters.group}
                    onChange={handleChange('group')}
                >
                    <MenuItem value="">All Groups</MenuItem>
                    {groups.map(g => (
                        <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    fullWidth
                    label="Exam Type"
                    value={filters.examType}
                    onChange={handleChange('examType')}
                >
                    <MenuItem value="">All Types</MenuItem>
                    {examTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                </TextField>
            </Stack>
            {activeFilterCount > 0 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={onClear}
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        Clear All Filters
                    </Button>
                </Box>
            )}
        </GlassmorphicCard>
    );
}
