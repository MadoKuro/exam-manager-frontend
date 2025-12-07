import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

export default function StudentForm() {
    const { id } = useParams();
    return <Typography variant="h4">{id ? 'Edit Student' : 'Add Student'}</Typography>;
}
