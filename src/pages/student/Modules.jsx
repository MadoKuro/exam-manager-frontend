import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from '@mui/icons-material/Person';

export default function StudentModules() {
    const modules = [
        { id: 1, name: 'Algorithmics 2', code: 'CS301', teacher: 'Mr. X', credits: 4, type: 'Core' },
        { id: 2, name: 'Web Development', code: 'CS302', teacher: 'Mrs. Y', credits: 3, type: 'Core' },
        { id: 3, name: 'Database Systems', code: 'CS303', teacher: 'Mr. Z', credits: 3, type: 'Core' },
        { id: 4, name: 'Mathematics for CS', code: 'MATH202', teacher: 'Mrs. A', credits: 2, type: 'Foundation' },
        { id: 5, name: 'Technical English', code: 'LANG101', teacher: 'Mr. B', credits: 1, type: 'Elective' },
        { id: 6, name: 'Operating Systems', code: 'CS304', teacher: 'Mr. C', credits: 4, type: 'Core' },
    ];

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Semester Modules
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    List of registered modules and responsible teachers for the current semester.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {modules.map((module) => (
                    <Grid item xs={12} sm={6} md={4} key={module.id}>
                        <Card sx={{
                            height: '100%',
                            borderRadius: 4,
                            position: 'relative',
                            overflow: 'visible',
                            mt: 2,
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 6
                            }
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                top: -15,
                                left: 20,
                                bgcolor: 'primary.main',
                                color: 'white',
                                width: 40,
                                height: 40,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                            }}>
                                <ClassIcon fontSize="small" />
                            </Box>
                            <CardContent sx={{ pt: 4, pb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        {module.code}
                                    </Typography>
                                    <Chip label={module.type} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, minHeight: 64 }}>
                                    {module.name}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'background.default', p: 1.5, borderRadius: 3 }}>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.main' }}>
                                        <PersonIcon fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Responsible Teacher
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {module.teacher}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
