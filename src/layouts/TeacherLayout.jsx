import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';
import { useExamRequests } from '../context/ExamRequestContext';
import { useUserNotifications } from '../context/UserNotificationsContext';
import { BaseLayout, AppBarControls } from '../components/layout';

export default function TeacherLayout() {
    const { user } = useAuth();
    const { requests } = useExamRequests();
    const { getUnreadCount } = useUserNotifications();

    // Compute pending request count for this teacher
    const pendingRequestCount = requests.filter(
        r => r.teacherId === user?.id && r.status === 'Pending'
    ).length;

    // Get unread notification count for teacher
    const unreadNotificationCount = getUnreadCount('teacher', user?.id);

    // Total notifications = pending requests + unread notifications from context
    const totalNotificationCount = pendingRequestCount + unreadNotificationCount;

    const menuItems = [
        { text: 'Dashboard', path: '/teacher/dashboard', icon: <DashboardIcon /> },
        { text: 'Profile', path: '/teacher/profile', icon: <PersonIcon /> },
        { text: 'Exam Requests', path: '/teacher/requests', icon: <EventNoteIcon /> },
        { text: 'Schedule', path: '/teacher/schedule', icon: <EventIcon /> },
        { text: 'Notifications', path: '/teacher/notifications', icon: <NotificationsIcon /> },
    ];

    return (
        <BaseLayout
            role="Teacher"
            menuItems={menuItems}
            appBarControls={
                <AppBarControls
                    user={user}
                    notificationPath="/teacher/notifications"
                    notificationCount={totalNotificationCount}
                    defaultInitial="T"
                />
            }
        />
    );
}
