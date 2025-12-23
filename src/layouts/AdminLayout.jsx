<<<<<<< HEAD
import { Outlet, Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAuth } from '../context/AuthContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../context/ThemeContext';

const drawerWidth = 280;
=======
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
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6

export default function AdminLayout() {
    const theme = useTheme();
    const location = useLocation();

<<<<<<< HEAD
    const menuItems = [
        { text: 'Exam Requests', path: '/admin/requests', icon: <EventNoteIcon /> }, // New Link
        /* { text: 'Years', path: '/admin/years', icon: <DashboardIcon /> }, */
        /* { text: 'Semesters', path: '/admin/semesters', icon: <DashboardIcon /> }, */
        /* Placeholder for other admin links */
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Top Bar - Minimalist Green/White */}
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
                    color: '#064e3b'
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '-0.5px' }}>
                        Admin Dashboard
                    </Typography>
                    <IconButton onClick={toggleColorMode} sx={{ color: '#10b981' }}>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Sidebar (Floating White Glass Panel) */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth - 24,
                        margin: '12px',
                        height: 'calc(100vh - 24px)',
                        borderRadius: '24px',
                        boxSizing: 'border-box',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        background: 'rgba(255, 255, 255, 0.65)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
                        color: '#374151',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    },
                }}
            >
                <Toolbar sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 5 }}>
                    <Box sx={{
                        width: 64,
                        height: 64,
                        bgcolor: '#059669', // Darker Green for Admin
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        boxShadow: '0 8px 20px -5px rgba(5, 150, 105, 0.4)'
                    }}>
                        <Typography variant="h4" sx={{ color: 'white' }}>🛡️</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#065f46', letterSpacing: '-0.5px' }}>
                        UniManager
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Admin Portal
                    </Typography>
                </Toolbar>

                <Box sx={{ overflow: 'auto', px: 3, flexGrow: 1, mt: 1 }}>
                    <List>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
=======
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
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        sx={{
<<<<<<< HEAD
                                            borderRadius: '16px',
                                            transition: 'all 0.3s ease',
                                            background: isActive ? '#059669' : 'transparent', // Darker Green for Admin Active
                                            color: isActive ? 'white' : '#4b5563',
                                            boxShadow: isActive ? '0 8px 20px -5px rgba(5, 150, 105, 0.4)' : 'none',
                                            '&:hover': {
                                                background: isActive ? '#047857' : 'rgba(16, 185, 129, 0.08)',
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: isActive ? 'white' : '#059669', minWidth: 44 }}>
=======
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
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
<<<<<<< HEAD
                                            primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
=======
                                            primaryTypographyProps={{
                                                fontWeight: isActive ? 600 : 500,
                                                fontSize: '0.875rem',
                                                color: isActive ? 'white' : 'inherit',
                                            }}
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
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

<<<<<<< HEAD
                <Box sx={{ p: 3 }}>
                    <ListItemButton onClick={logout} sx={{ borderRadius: '16px', color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}>
                        <ListItemIcon sx={{ minWidth: 40, color: '#ef4444' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
                <Toolbar />
                <Box>
                    <Outlet />
                </Box>
            </Box>
        </Box>
=======
    return (
        <BaseLayout
            role="Admin"
            menuSections={adminMenuSections}
            appBarControls={adminAppBarControls}
        />
>>>>>>> a407daef8171f1044c4a5bd77ebda5e39d0a29b6
    );
}
