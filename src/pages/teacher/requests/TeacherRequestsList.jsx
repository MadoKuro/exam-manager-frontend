import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Grow from '@mui/material/Grow';
import Zoom from '@mui/material/Zoom';
import { useExamRequests } from '../../../context/ExamRequestContext';

export default function TeacherRequestsList() {
    const { requests } = useExamRequests();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Refused': return 'error';
            default: return 'warning';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="900" sx={{ color: '#064e3b', letterSpacing: '-0.5px' }}>
                        Exam Requests
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#059669' }}>
                        Track the status of your exam proposals.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={Link}
                    to="/teacher/requests/new"
                    sx={{
                        borderRadius: '14px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        height: 48,
                        px: 3,
                        bgcolor: '#10b981', // Emerald
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-2px)', bgcolor: '#059669', boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)' }
                    }}
                >
                    New Request
                </Button>
            </Box>

            <Grow in={true} timeout={800}>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.8)', // White Glass
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                    }}
                >
                    <Table>
                        <TableHead sx={{ bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
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
                            {requests.length > 0 ? (
                                requests.map((req, index) => (
                                    <TableRow key={req.id} hover sx={{
                                        transition: 'background-color 0.2s',
                                        '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.03) !important' }
                                    }}>
                                        <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>{req.module}</TableCell>
                                        <TableCell sx={{ color: '#4b5563' }}>{req.date}</TableCell>
                                        <TableCell sx={{ color: '#4b5563' }}>{req.time} ({req.duration}m)</TableCell>
                                        <TableCell sx={{ color: '#4b5563' }}>{req.room}</TableCell>
                                        <TableCell>
                                            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                                                <Chip
                                                    label={req.status}
                                                    color={getStatusColor(req.status)}
                                                    size="small"
                                                    sx={{ fontWeight: 'bold', borderRadius: 2 }}
                                                />
                                            </Zoom>
                                        </TableCell>
                                        <TableCell>
                                            {req.status === 'Pending' && (
                                                <Tooltip title="Edit Request">
                                                    <IconButton
                                                        component={Link}
                                                        to={`/teacher/requests/edit/${req.id}`}
                                                        size="small"
                                                        sx={{ color: '#10b981' }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {req.status === 'Refused' && req.reason && (
                                                <Tooltip title={`Reason: ${req.reason}`} arrow>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#ef4444', cursor: 'help' }}>
                                                        <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                        <Typography variant="caption" fontWeight="bold">Refused</Typography>
                                                    </Box>
                                                </Tooltip>
                                            )}
                                            {req.status === 'Approved' && <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 'bold' }}>Scheduled</Typography>}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                                        <Typography sx={{ color: '#9ca3af', mb: 2 }}>No requests found.</Typography>
                                        <Button component={Link} to="/teacher/requests/new" sx={{ color: '#10b981', borderColor: '#10b981' }} variant="outlined">
                                            Create your first request
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grow>
        </Box>
    );
}
