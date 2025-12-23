import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventIcon from '@mui/icons-material/Event';
import { useAuth } from '../context/AuthContext';
import { BaseLayout, AppBarControls } from '../components/layout';

export default function TeacherLayout() {
    const { user } = useAuth();

    const menuItems = [
        { text: 'Dashboard', path: '/teacher/dashboard', icon: <DashboardIcon /> },
        { text: 'Profile', path: '/teacher/profile', icon: <PersonIcon /> },
        { text: 'Exam Requests', path: '/teacher/requests', icon: <EventNoteIcon /> },
        { text: 'Schedule', path: '/teacher/schedule', icon: <EventIcon /> },
    ];

    return (
        <BaseLayout
            role="Teacher"
            menuItems={menuItems}
            appBarControls={
                <AppBarControls
                    user={user}
                    notificationPath="/teacher/requests"
                    notificationCount={2}
                    defaultInitial="T"
                />
            }
        />
    );
}
