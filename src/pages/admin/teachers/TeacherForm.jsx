import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

export default function TeacherForm() {
    const { id } = useParams();
    return <Typography variant="h4">{id ? 'Edit Teacher' : 'Add Teacher'}</Typography>;
}
