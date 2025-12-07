import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

export default function ModuleForm() {
    const { id } = useParams();
    return <Typography variant="h4">{id ? 'Edit Module' : 'Add Module'}</Typography>;
}
