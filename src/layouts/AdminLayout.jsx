import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LayersIcon from '@mui/icons-material/Layers';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { BaseLayout, AppBarControls, PageNavbar } from '../components/layout';
import { useExamRequests } from '../context/ExamRequestContext';
import { ANIMATIONS, COLORS } from '../theme/themeConstants';

/**
 * Admin navigation configuration
 * Each domain has a sidebar icon and a set of page-level navigation items
 */
const navigationConfig = {
    overview: {
        label: 'Overview',
        icon: <DashboardIcon />,
        basePath: '/admin/requests',
        items: [
            { text: 'Pending Requests', path: '/admin/requests', icon: <EventNoteIcon /> },
        ],
    },
    academic: {
        label: 'Academic',
        icon: <SchoolIcon />,
        basePath: '/admin/years',
        items: [
            { text: 'Years', path: '/admin/years', icon: <CalendarMonthIcon /> },
            { text: 'Semesters', path: '/admin/semesters', icon: <LayersIcon /> },
            { text: 'Levels', path: '/admin/levels', icon: <LayersIcon /> },
            { text: 'Groups', path: '/admin/groups', icon: <GroupIcon /> },
        ],
    },
    people: {
        label: 'People',
        icon: <PeopleIcon />,
        basePath: '/admin/teachers',
        items: [
            { text: 'Teachers', path: '/admin/teachers', icon: <PeopleIcon /> },
            { text: 'Students', path: '/admin/students', icon: <PeopleIcon /> },
        ],
    },
    exams: {
        label: 'Exams',
        icon: <AssignmentIcon />,
        basePath: '/admin/exams',
        items: [
            { text: 'Exams', path: '/admin/exams', icon: <AssignmentIcon /> },
            { text: 'Surveillants', path: '/admin/surveillants', icon: <SupervisorAccountIcon /> },
            { text: 'Planning', path: '/admin/planning', icon: <CalendarViewMonthIcon /> },
            { text: 'Convocations', path: '/admin/convocations', icon: <MailOutlineIcon /> },
        ],
    },
    resources: {
        label: 'Resources',
        icon: <InventoryIcon />,
        basePath: '/admin/modules',
        items: [
            { text: 'Modules', path: '/admin/modules', icon: <MenuBookIcon /> },
            { text: 'Rooms', path: '/admin/rooms', icon: <MeetingRoomIcon /> },
        ],
    },
};

/**
 * Helper to find the active domain based on current path
 */
function getActiveDomain(pathname) {
    for (const [key, config] of Object.entries(navigationConfig)) {
        if (config.items.some(item => pathname.startsWith(item.path))) {
            return key;
        }
    }
    return 'overview';
}

export default function AdminLayout() {
    const theme = useTheme();
    const location = useLocation();
    const { requests } = useExamRequests();

    const activeDomain = getActiveDomain(location.pathname);
    const pageNavItems = navigationConfig[activeDomain]?.items || [];

    // Dynamic pending request count
    const pendingCount = requests.filter(r => r.status === 'Pending').length;

    // Admin AppBar controls with dynamic notification count
    const adminAppBarControls = (
        <AppBarControls
            user={{ name: 'Admin' }}
            notificationPath="/admin/requests"
            notificationCount={pendingCount}
            defaultInitial="A"
        />
    );

    // Simplified sidebar with top-level domain items
    const adminMenuSections = (
        <List disablePadding>
            {Object.entries(navigationConfig).map(([key, config]) => {
                const isActive = activeDomain === key;
                return (
                    <ListItem key={key} disablePadding sx={{ mb: 0.75 }}>
                        <ListItemButton
                            component={Link}
                            to={config.basePath}
                            sx={{
                                borderRadius: '10px',
                                transition: `all ${ANIMATIONS.duration.normal} ${ANIMATIONS.easing.smooth}`,
                                background: isActive
                                    ? `linear-gradient(135deg, ${COLORS.primaryMain} 0%, ${COLORS.secondaryMain} 100%)`
                                    : 'transparent',
                                color: isActive ? 'white' : theme.palette.text.primary,
                                boxShadow: isActive
                                    ? '0 8px 20px -5px rgba(16,185,129,0.35)'
                                    : 'none',
                                '&:hover': {
                                    background: isActive
                                        ? `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.secondaryDark} 100%)`
                                        : `rgba(16,185,129,0.08)`,
                                    transform: ANIMATIONS.hover.translateX,
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: isActive ? 'white' : COLORS.primaryMain,
                                    minWidth: 36,
                                }}
                            >
                                {config.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={config.label}
                                primaryTypographyProps={{
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '0.875rem',
                                    color: isActive ? 'white' : 'inherit',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );

    return (
        <BaseLayout
            role="Admin"
            menuSections={adminMenuSections}
            appBarControls={adminAppBarControls}
            pageNavbar={<PageNavbar items={pageNavItems} />}
        />
    );
}
