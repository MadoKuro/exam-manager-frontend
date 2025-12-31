import {
    Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
    OutlinedInput, Chip, Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { COLORS } from '../../../theme/themeConstants';

/**
 * Dialog for assigning surveillants to an exam
 * Handles manual selection with conflict warnings
 */
export default function AssignmentDialog({
    open,
    exam,
    teachers,
    selectedSurveillants,
    teacherWorkload,
    availableSurveillants,
    unavailableSurveillants,
    conflicts,
    getModuleName,
    onClose,
    onSurveillantChange,
    onConfirm
}) {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: '16px' } }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                Assign Surveillants
                {exam && (
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 'normal' }}>
                        {getModuleName(exam.moduleId)} - {exam.date} at {exam.startTime}
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent>
                {/* Conflict warnings */}
                {conflicts.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        {conflicts.map((conflict, index) => (
                            <Alert
                                key={index}
                                severity="warning"
                                icon={<WarningAmberIcon />}
                                sx={{ mb: 1, borderRadius: 2 }}
                            >
                                <strong>Conflict:</strong> {conflict.surveillants.join(', ')} already assigned to "{conflict.examName}" at {conflict.time}
                            </Alert>
                        ))}
                    </Box>
                )}

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Select Surveillants</InputLabel>
                    <Select
                        multiple
                        value={selectedSurveillants}
                        onChange={onSurveillantChange}
                        input={<OutlinedInput label="Select Surveillants" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((id) => {
                                    const teacher = teachers.find(t => t.id === id);
                                    return (
                                        <Chip
                                            key={id}
                                            label={teacher?.name || id}
                                            size="small"
                                            sx={{ bgcolor: `${COLORS.primaryMain}20`, color: COLORS.primaryDark }}
                                        />
                                    );
                                })}
                            </Box>
                        )}
                    >
                        {/* Available teachers */}
                        {availableSurveillants.length > 0 && (
                            <MenuItem disabled sx={{ opacity: 1, fontWeight: 700, color: COLORS.successMain }}>
                                Available
                            </MenuItem>
                        )}
                        {availableSurveillants.map((teacher) => (
                            <MenuItem key={teacher.id} value={teacher.id}>
                                <Checkbox checked={selectedSurveillants.indexOf(teacher.id) > -1} />
                                <ListItemText
                                    primary={teacher.name}
                                    secondary={`Workload: ${teacherWorkload[teacher.id] || 0} exams`}
                                />
                                <Chip
                                    label="Available"
                                    size="small"
                                    sx={{ bgcolor: COLORS.successLight, color: COLORS.successDark }}
                                />
                            </MenuItem>
                        ))}

                        {/* Unavailable teachers */}
                        {unavailableSurveillants.length > 0 && (
                            <MenuItem disabled sx={{ opacity: 1, fontWeight: 700, color: COLORS.warningMain }}>
                                Busy at this time
                            </MenuItem>
                        )}
                        {unavailableSurveillants.map((teacher) => (
                            <MenuItem key={teacher.id} value={teacher.id}>
                                <Checkbox checked={selectedSurveillants.indexOf(teacher.id) > -1} />
                                <ListItemText
                                    primary={teacher.name}
                                    secondary="Has another exam at this time"
                                />
                                <Chip
                                    label="Busy"
                                    size="small"
                                    sx={{ bgcolor: COLORS.warningLight, color: COLORS.warningDark }}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                >
                    Confirm Assignment
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AssignmentDialog.propTypes = {
    /** Whether dialog is open */
    open: PropTypes.bool.isRequired,
    /** Current exam being assigned */
    exam: PropTypes.shape({
        id: PropTypes.number,
        moduleId: PropTypes.number,
        date: PropTypes.string,
        startTime: PropTypes.string,
    }),
    /** All teachers */
    teachers: PropTypes.array.isRequired,
    /** Currently selected surveillant IDs */
    selectedSurveillants: PropTypes.arrayOf(PropTypes.number).isRequired,
    /** Teacher workload map */
    teacherWorkload: PropTypes.object.isRequired,
    /** Available teachers for this time slot */
    availableSurveillants: PropTypes.array.isRequired,
    /** Unavailable teachers for this time slot */
    unavailableSurveillants: PropTypes.array.isRequired,
    /** Conflict warnings */
    conflicts: PropTypes.array.isRequired,
    /** Get module name function */
    getModuleName: PropTypes.func.isRequired,
    /** Close dialog callback */
    onClose: PropTypes.func.isRequired,
    /** Surveillant selection change callback */
    onSurveillantChange: PropTypes.func.isRequired,
    /** Confirm assignment callback */
    onConfirm: PropTypes.func.isRequired,
};
