import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grow from '@mui/material/Grow';
import { useExamRequests } from '../../context/ExamRequestContext';
import { useNotification } from '../../context/NotificationContext';

export default function AdminRequests() {
    const { requests, updateRequestStatus } = useExamRequests();
    const { notify } = useNotification();

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
                <Typography variant="h3" fontWeight="900" sx={{ color: '#064e3b', letterSpacing: '-1px' }}>
                    Pending Requests
                </Typography>
                <Typography variant="h6" sx={{ color: '#059669', opacity: 0.8 }}>
                    Review and manage teacher exam proposals.
                </Typography>
            </Box>

            <Grow in={true}>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                    }}
                >
                    <Table>
                        <TableHead sx={{ bgcolor: 'rgba(5, 150, 105, 0.05)' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#065f46' }}>Module</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#065f46' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#065f46' }}>Time</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#065f46' }}>Room</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#065f46' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#065f46' }}>Actions</TableCell>
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
                                            <Chip label="Pending" size="small" sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 'bold' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<CheckCircleIcon />}
                                                    onClick={() => handleApprove(req.id)}
                                                    sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, borderRadius: 2 }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => handleOpenRefuse(req.id)}
                                                    sx={{ color: '#ef4444', borderColor: '#ef4444', '&:hover': { bgcolor: '#fef2f2', borderColor: '#ef4444' }, borderRadius: 2 }}
                                                >
                                                    Refuse
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#9ca3af' }}>
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
                <DialogTitle sx={{ color: '#ef4444', fontWeight: 'bold' }}>Refuse Request</DialogTitle>
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
                    <Button onClick={() => setOpenRefuse(false)} sx={{ color: '#6b7280' }}>Cancel</Button>
                    <Button onClick={handleConfirmRefuse} variant="contained" color="error" sx={{ borderRadius: 2 }}>
                        Refuse Exam
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
