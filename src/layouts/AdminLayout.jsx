import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LayersIcon from '@mui/icons-material/Layers';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { BaseLayout, AppBarControls } from '../components/layout';
import { ANIMATIONS, COLORS } from '../theme/themeConstants';

export default function AdminLayout() {
    const theme = useTheme();
    const location = useLocation();

    const menuSections = [
        {
            label: 'OVERVIEW',
            items: [
                { text: 'Pending Requests', path: '/admin/requests', icon: <EventNoteIcon /> },
            ],
        },
        {
            label: 'ACADEMIC STRUCTURE',
            items: [
                { text: 'Years', path: '/admin/years', icon: <CalendarMonthIcon /> },
                { text: 'Semesters', path: '/admin/semesters', icon: <LayersIcon /> },
                { text: 'Levels', path: '/admin/levels', icon: <LayersIcon /> },
                { text: 'Groups', path: '/admin/groups', icon: <GroupIcon /> },
            ],
        },
        {
            label: 'PEOPLE MANAGEMENT',
            items: [
                { text: 'Teachers', path: '/admin/teachers', icon: <PeopleIcon /> },
                { text: 'Students', path: '/admin/students', icon: <PeopleIcon /> },
            ],
        },
        {
            label: 'RESOURCES',
            items: [
                { text: 'Modules', path: '/admin/modules', icon: <MenuBookIcon /> },
                { text: 'Rooms', path: '/admin/rooms', icon: <MeetingRoomIcon /> },
            ],
        },
    ];

    // Admin AppBar controls with notifications
    const adminAppBarControls = (
        <AppBarControls
            user={{ name: 'Admin' }}
            notificationPath="/admin/requests"
            notificationCount={3}
            defaultInitial="A"
        />
    );

    // Custom grouped menu sections for admin
    const adminMenuSections = (
        <>
            {menuSections.map((section) => (
                <Box key={section.label} sx={{ mb: 2.5 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            opacity: 0.65,
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            letterSpacing: '0.7px',
                            mb: 1,
                            ml: 1,
                            color: theme.palette.text.secondary,
                        }}
                    >
                        {section.label}
                    </Typography>
                    <List disablePadding>
                        {section.items.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <ListItem key={item.text} disablePadding sx={{ mb: 0.75 }}>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
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
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
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
                </Box>
            ))}
        </>
    );

    return (
        <BaseLayout
            role="Admin"
            menuSections={adminMenuSections}
            appBarControls={adminAppBarControls}
        />
    );
}
