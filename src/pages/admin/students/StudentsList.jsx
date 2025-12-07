import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

export default function StudentsList() {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Students Management</Typography>
                <Button variant="contained" component={Link} to="/admin/students/add">Add Student</Button>
            </Box>
        </Box>
    );
}
