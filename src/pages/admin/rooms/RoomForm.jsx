import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

export default function RoomForm() {
    const { id } = useParams();
    return <Typography variant="h4">{id ? 'Edit Room' : 'Add Room'}</Typography>;
}
