import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../context/AuthContext';
import { BaseLayout, AppBarControls } from '../components/layout';

export default function StudentLayout() {
    const { user } = useAuth();

    const menuItems = [
        { text: 'Dashboard', path: '/student/dashboard', icon: <DashboardIcon /> },
        { text: 'Exams Schedule', path: '/student/schedule', icon: <CalendarMonthIcon /> },
        { text: 'Notifications', path: '/student/notifications', icon: <NotificationsIcon /> },
        { text: 'Modules', path: '/student/modules', icon: <LibraryBooksIcon /> },
        { text: 'Downloads', path: '/student/downloads', icon: <DownloadIcon /> },
        { text: 'Profile', path: '/student/profile', icon: <PersonIcon /> },
    ];

    return (
        <BaseLayout
            role="Student"
            menuItems={menuItems}
            appBarControls={
                <AppBarControls
                    user={user}
                    notificationPath="/student/notifications"
                    notificationCount={3}
                    defaultInitial="S"
                />
            }
        />
    );
}
