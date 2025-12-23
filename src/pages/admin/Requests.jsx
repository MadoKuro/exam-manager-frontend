import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useExamRequests } from '../../context/ExamRequestContext';
import { useNotification } from '../../context/NotificationContext';
import { GLASSMORPHISM, COLORS } from '../../theme/themeConstants';

export default function AdminRequests() {
    const { requests, updateRequestStatus } = useExamRequests();
    const { notify } = useNotification();
    const theme = useTheme();

    // Dialog State
    const [openRefuse, setOpenRefuse] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [refusalReason, setRefusalReason] = useState('');

    const pendingRequests = requests.filter(req => req.status === 'Pending');

    const handleApprove = (id) => {
        updateRequestStatus(id, 'Approved');
        notify('Exam request Approved!', 'success');
    };

    const handleOpenRefuse = (id) => {
        setSelectedId(id);
        setRefusalReason('');
        setOpenRefuse(true);
    };

    const handleConfirmRefuse = () => {
        if (!refusalReason.trim()) {
            notify('Please provide a reason for refusal.', 'error');
            return;
        }
        updateRequestStatus(selectedId, 'Refused', refusalReason);
        notify('Exam request Refused.', 'info');
        setOpenRefuse(false);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="900" sx={{ color: theme.palette.text.primary, letterSpacing: '-1px' }}>
                    Pending Requests
                </Typography>
                <Typography variant="h6" sx={{ color: COLORS.primaryMain, opacity: 0.8 }}>
                    Review and manage teacher exam proposals.
                </Typography>
            </Box>

            <Grow in={true}>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: '24px',
                        background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                        backdropFilter: GLASSMORPHISM.card.blur,
                        border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                    }}
                >
                    <Table>
                        <TableHead sx={{ bgcolor: `${COLORS.primaryMain}0D` }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Module</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Time</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Room</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingRequests.length > 0 ? (
                                pendingRequests.map((req) => (
                                    <TableRow key={req.id} hover>
                                        <TableCell sx={{ fontWeight: 600 }}>{req.module}</TableCell>
                                        <TableCell>{req.date}</TableCell>
                                        <TableCell>{req.time} ({req.duration}m)</TableCell>
                                        <TableCell>{req.room}</TableCell>
                                        <TableCell>
                                            <Chip label="Pending" size="small" sx={{ bgcolor: COLORS.warningLight, color: COLORS.warningDark, fontWeight: 'bold' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<CheckCircleIcon />}
                                                    onClick={() => handleApprove(req.id)}
                                                    sx={{
                                                        background: `linear-gradient(135deg, ${COLORS.primaryMain} 0%, ${COLORS.secondaryMain} 100%)`,
                                                        '&:hover': {
                                                            background: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.secondaryDark} 100%)`
                                                        },
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => handleOpenRefuse(req.id)}
                                                    sx={{
                                                        color: COLORS.errorMain,
                                                        borderColor: COLORS.errorMain,
                                                        '&:hover': {
                                                            bgcolor: COLORS.errorLight,
                                                            borderColor: COLORS.errorMain
                                                        },
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    Refuse
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: theme.palette.text.secondary }}>
                                        No pending requests found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grow>

            {/* Refusal Dialog */}
            <Dialog open={openRefuse} onClose={() => setOpenRefuse(false)} PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ color: COLORS.errorMain, fontWeight: 'bold' }}>Refuse Request</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide a reason for refusing this exam request. The teacher will be notified.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason for Refusal"
                        fullWidth
                        variant="outlined"
                        value={refusalReason}
                        onChange={(e) => setRefusalReason(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpenRefuse(false)} sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
                    <Button onClick={handleConfirmRefuse} variant="contained" color="error" sx={{ borderRadius: 2 }}>
                        Refuse Exam
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
