import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';

export default function StudentDownloads() {

    const downloadOptions = [
        { title: 'Full Exam Schedule', description: 'Complete schedule for all modules', icon: <CalendarMonthIcon sx={{ fontSize: 40 }} />, type: 'PDF' },
        { title: 'Schedule by Module', description: 'Exam dates grouped by module', icon: <ClassIcon sx={{ fontSize: 40 }} />, type: 'PDF' },
        { title: 'Schedule by Day', description: 'Daily breakdown of exam times', icon: <SchoolIcon sx={{ fontSize: 40 }} />, type: 'PDF' },
        { title: 'Excel Export', description: 'Editable spreadsheet format', icon: <TableViewIcon sx={{ fontSize: 40 }} />, type: 'Excel' },
    ];

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                Downloads Area
            </Typography>

            <Grid container spacing={3}>
                {downloadOptions.map((option, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ height: '100%', borderRadius: 4, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 4 }}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: '50%',
                                    bgcolor: option.type === 'Excel' ? 'success.light' : 'error.light',
                                    color: option.type === 'Excel' ? 'success.main' : 'error.main',
                                    mb: 2
                                }}>
                                    {option.icon}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    {option.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                                    {option.description}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color={option.type === 'Excel' ? 'success' : 'error'}
                                    startIcon={option.type === 'Excel' ? <TableViewIcon /> : <PictureAsPdfIcon />}
                                    sx={{ borderRadius: '12px', textTransform: 'none', width: '100%' }}
                                >
                                    Download {option.type}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 6, p: 3, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Archive
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                    Access schedules from previous semesters. (Coming Soon)
                </Typography>
            </Box>
        </Box>
    );
}
