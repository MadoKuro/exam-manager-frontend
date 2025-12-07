import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

export default function ModulesList() {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4">Modules Management</Typography>
                <Button variant="contained" component={Link} to="/admin/modules/add">Add Module</Button>
            </Box>
        </Box>
    );
}
