import { Box, Typography, Card, CardContent, Avatar, Divider, Chip, Stack, Grow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupsIcon from '@mui/icons-material/Groups';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { COLORS } from '../../theme/themeConstants';

export default function StudentProfile() {
    const { user } = useAuth();
    const { students, levels, groups } = useAdminData();
    const theme = useTheme();

    // Find current student from context using user ID
    const currentStudent = students.find(s => s.id === user?.id);

    // Lookup level and group names
    const levelName = levels.find(l => l.id === currentStudent?.levelId)?.name || 'N/A';
    const groupName = groups.find(g => g.id === currentStudent?.groupId)?.name || 'N/A';

    const studentInfo = {
        name: currentStudent?.name || user?.name || 'Student',
        studentId: String(currentStudent?.id || user?.id || '').padStart(8, '0'),
        group: groupName,
        level: levelName,
        specialty: currentStudent?.specialization || 'N/A',
        email: currentStudent?.email || user?.email || 'student@univ.edu',
    };

    const InfoItem = ({ icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Avatar sx={{ bgcolor: `${COLORS.primaryMain}1A`, color: 'primary.main', mr: 2 }}>
                {icon}
            </Avatar>
            <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
            <Grow in={true} timeout={800}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 6, textAlign: 'center' }}>
                        My Profile
                    </Typography>

                    <Card sx={{
                        borderRadius: 4,
                        overflow: 'visible',
                        mt: 8,
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
                        }
                    }}>
                        {/* Gradient Banner */}
                        <Box sx={{
                            height: 140,
                            background: `linear-gradient(135deg, ${COLORS.primaryMain} 0%, ${COLORS.secondaryMain} 100%)`,
                            borderRadius: '16px 16px 0 0',
                            position: 'relative',
                            mt: -8,
                            mx: 2,
                            boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.5)'
                        }} />

                        <CardContent sx={{ position: 'relative', pt: 0, pb: 4, px: 4 }}>
                            {/* Avatar */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: -7, mb: 3 }}>
                                <Avatar sx={{
                                    width: 140,
                                    height: 140,
                                    border: '6px solid',
                                    borderColor: 'background.paper',
                                    bgcolor: 'primary.dark',
                                    fontSize: '4rem',
                                    boxShadow: 4
                                }}>
                                    {studentInfo.name.charAt(0)}
                                </Avatar>
                            </Box>

                            {/* Name & Title */}
                            <Box sx={{ textAlign: 'center', mb: 5 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    {studentInfo.name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: '1.1rem' }}>
                                    {studentInfo.email}
                                </Typography>
                                <Chip
                                    label="Active Student"
                                    color="success"
                                    sx={{
                                        bgcolor: `${COLORS.primaryMain}1A`,
                                        color: 'primary.dark',
                                        fontWeight: 700,
                                        px: 1
                                    }}
                                />
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            {/* Info Stack */}
                            <Stack spacing={2} sx={{ maxWidth: 500, mx: 'auto' }}>
                                <InfoItem
                                    icon={<BadgeIcon />}
                                    label="STUDENT ID"
                                    value={studentInfo.studentId}
                                />
                                <InfoItem
                                    icon={<SchoolIcon />}
                                    label="SPECIALTY"
                                    value={studentInfo.specialty}
                                />
                                <InfoItem
                                    icon={<GroupsIcon />}
                                    label="LEVEL / GROUP"
                                    value={`${studentInfo.level} — ${studentInfo.group}`}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Grow>
        </Box>
    );
}
