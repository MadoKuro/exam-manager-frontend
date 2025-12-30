import { useState, useRef, useMemo } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Grow, Grid, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider,
    Checkbox, FormControlLabel, Alert, Snackbar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import { useAdminData } from '../../../context/AdminDataContext';
import { useNotification } from '../../../context/NotificationContext';
import { AdminPageHeader } from '../../../components/admin';
import { GLASSMORPHISM, COLORS, GRADIENTS, ANIMATIONS } from '../../../theme/themeConstants';

/**
 * Convocation detail page - shows students and generates convocations
 */
export default function ConvocationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { exams, modules, rooms, teachers, groups, students, examsCrud } = useAdminData();
    const { notify } = useNotification();
    const printRef = useRef();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [sendEmailChecked, setSendEmailChecked] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Get exam data
    const exam = useMemo(() => exams.find(e => e.id === Number(id)), [exams, id]);

    if (!exam) {
        return (
            <Box>
                <AdminPageHeader title="Convocation Not Found" subtitle="The requested exam was not found">
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/convocations')}>
                        Back to Convocations
                    </Button>
                </AdminPageHeader>
            </Box>
        );
    }

    // Helper functions
    const module = modules.find(m => m.id === exam.moduleId);
    const responsibleTeacher = teachers.find(t => t.id === module?.teacherId);
    const examRooms = exam.roomIds?.map(id => rooms.find(r => r.id === id)).filter(Boolean) || [];
    const surveillants = exam.surveillantIds?.map(id => teachers.find(t => t.id === id)).filter(Boolean) || [];

    // Get students for this exam based on groups
    const examStudents = students.filter(s => exam.groupIds?.includes(s.groupId));

    // Get groups for this exam
    const examGroups = exam.groupIds?.map(id => groups.find(g => g.id === id)).filter(Boolean) || [];

    // Format duration
    const formatDuration = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h === 0) return `${m} minutes`;
        if (m === 0) return `${h} hour${h > 1 ? 's' : ''}`;
        return `${h}h ${m}min`;
    };

    // Generate PDF (simulated)
    const handleDownloadPDF = () => {
        // In a real app, this would generate a PDF using a library like react-pdf or jspdf
        notify('PDF download started...', 'info');
        setTimeout(() => {
            notify('Teacher convocation PDF downloaded successfully!', 'success');
        }, 1000);
    };

    // Send in-app notification
    const handleSendNotification = () => {
        notify(`In-app notification sent to ${responsibleTeacher?.name || 'teacher'}!`, 'success');
    };

    // Send email (simulated)
    const handleSendEmail = () => {
        if (responsibleTeacher) {
            notify(`Email sent to ${responsibleTeacher.email}!`, 'success');
        } else {
            notify('No responsible teacher found for this exam', 'error');
        }
    };

    // Handle generate convocation action
    const handleGenerateConvocation = () => {
        handleSendNotification();
        if (sendEmailChecked) {
            handleSendEmail();
        }
        handleDownloadPDF();
        setPreviewOpen(false);
    };

    return (
        <Box>
            <AdminPageHeader
                title="Exam Convocation"
                subtitle={`${module?.name || 'Unknown Module'} - ${exam.date}`}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/convocations')}
                    sx={{ mr: 1 }}
                >
                    Back
                </Button>
            </AdminPageHeader>

            <Grow in={true}>
                <Box>
                    <Grid container spacing={3}>
                        {/* Exam Details Card */}
                        <Grid item xs={12} md={4}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: '20px',
                                    background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                                    backdropFilter: GLASSMORPHISM.card.blur,
                                    border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                                    height: '100%'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                        Exam Details
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: 2,
                                            background: GRADIENTS.brand,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <EventIcon sx={{ color: 'white' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                Date
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600 }}>{exam.date}</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: 2,
                                            bgcolor: `${COLORS.secondaryMain}20`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <AccessTimeIcon sx={{ color: COLORS.secondaryMain }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                Time & Duration
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600 }}>
                                                {exam.startTime} • {formatDuration(exam.duration)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: 2,
                                            bgcolor: `${COLORS.infoMain}20`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <RoomIcon sx={{ color: COLORS.infoMain }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                Rooms
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600 }}>
                                                {examRooms.map(r => r.name).join(', ') || '-'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: 2,
                                            bgcolor: `${COLORS.primaryMain}20`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <PersonIcon sx={{ color: COLORS.primaryMain }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                Responsible Teacher
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600 }}>
                                                {responsibleTeacher?.name || '-'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                                        Surveillants ({surveillants.length})
                                    </Typography>
                                    {surveillants.length > 0 ? (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {surveillants.map(s => (
                                                <Chip
                                                    key={s.id}
                                                    label={s.name}
                                                    size="small"
                                                    sx={{ bgcolor: `${COLORS.secondaryMain}15`, color: COLORS.secondaryDark }}
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                            No surveillants assigned
                                        </Typography>
                                    )}

                                    <Divider sx={{ my: 3 }} />

                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                                        Convocation Actions
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => setPreviewOpen(true)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Generate Convocation
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<PictureAsPdfIcon />}
                                            onClick={handleDownloadPDF}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Download PDF
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<NotificationsIcon />}
                                            onClick={handleSendNotification}
                                            sx={{ borderRadius: 2, borderColor: COLORS.secondaryMain, color: COLORS.secondaryMain }}
                                        >
                                            Send Notification
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<EmailIcon />}
                                            onClick={handleSendEmail}
                                            sx={{ borderRadius: 2, borderColor: COLORS.infoMain, color: COLORS.infoMain }}
                                        >
                                            Send Email
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Students List */}
                        <Grid item xs={12} md={8}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '20px',
                                    background: theme.palette.mode === 'light' ? GLASSMORPHISM.card.light : GLASSMORPHISM.card.dark,
                                    backdropFilter: GLASSMORPHISM.card.blur,
                                    border: `1px solid ${theme.palette.mode === 'light' ? GLASSMORPHISM.card.border.light : GLASSMORPHISM.card.border.dark}`,
                                    overflow: 'hidden'
                                }}
                            >
                                <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Assigned Students
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {examGroups.map(g => (
                                                <Chip
                                                    key={g.id}
                                                    label={g.name}
                                                    size="small"
                                                    sx={{ bgcolor: `${COLORS.primaryMain}15`, color: COLORS.primaryDark }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                                        {examStudents.length} student{examStudents.length !== 1 ? 's' : ''} registered for this exam
                                    </Typography>
                                </Box>

                                <TableContainer>
                                    <Table>
                                        <TableHead sx={{ bgcolor: `${COLORS.primaryMain}08` }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Group</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Specialization</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {examStudents.length > 0 ? (
                                                examStudents.map((student, index) => {
                                                    const group = groups.find(g => g.id === student.groupId);
                                                    return (
                                                        <TableRow key={student.id} hover>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell sx={{ fontWeight: 600 }}>{student.name}</TableCell>
                                                            <TableCell>{student.email}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={group?.name || '-'}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                            <TableCell>{student.specialization || '-'}</TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center" sx={{ py: 6, color: theme.palette.text.secondary }}>
                                                        No students assigned to this exam. Add groups to the exam to see students.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Grow>

            {/* Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Teacher Convocation Preview
                </DialogTitle>
                <DialogContent>
                    {/* Convocation Letter Preview */}
                    <Paper
                        ref={printRef}
                        elevation={0}
                        sx={{
                            p: 4,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            bgcolor: 'white',
                            color: 'black'
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'black' }}>
                                UNIVERSITY EXAM CONVOCATION
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                                Academic Year 2024-2025
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="body1" sx={{ mb: 2, color: 'black' }}>
                            Dear <strong>{responsibleTeacher?.name || '[Teacher Name]'}</strong>,
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2, color: 'black' }}>
                            You are hereby convoked as the responsible teacher for the following examination:
                        </Typography>

                        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>Module</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'black' }}>
                                        {module?.code} - {module?.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>Exam Type</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'black' }}>
                                        {exam.type}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>Date</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'black' }}>
                                        {exam.date}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>Time</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'black' }}>
                                        {exam.startTime} ({formatDuration(exam.duration)})
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>Room(s)</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'black' }}>
                                        {examRooms.map(r => r.name).join(', ') || '-'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>Number of Students</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'black' }}>
                                        {examStudents.length}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {surveillants.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>Assigned Surveillants</Typography>
                                <Typography variant="body1" sx={{ color: 'black' }}>
                                    {surveillants.map(s => s.name).join(', ')}
                                </Typography>
                            </Box>
                        )}

                        <Typography variant="body1" sx={{ mb: 3, color: 'black' }}>
                            Please ensure your presence at least 15 minutes before the scheduled start time.
                            Bring all necessary examination materials.
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Box>
                                <Typography variant="body2" sx={{ color: 'gray' }}>Date of Issue</Typography>
                                <Typography variant="body1" sx={{ color: 'black' }}>
                                    {new Date().toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" sx={{ color: 'gray' }}>Administration</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: 'black' }}>
                                    Exam Office
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    <Box sx={{ mt: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sendEmailChecked}
                                    onChange={(e) => setSendEmailChecked(e.target.checked)}
                                    sx={{ color: COLORS.primaryMain, '&.Mui-checked': { color: COLORS.primaryMain } }}
                                />
                            }
                            label={`Also send email to ${responsibleTeacher?.email || 'teacher'}`}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setPreviewOpen(false)} sx={{ color: theme.palette.text.secondary }}>
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={handleDownloadPDF}
                        sx={{ borderRadius: 2 }}
                    >
                        Download PDF
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<NotificationsIcon />}
                        onClick={handleGenerateConvocation}
                        sx={{ borderRadius: 2 }}
                    >
                        Send Convocation
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
