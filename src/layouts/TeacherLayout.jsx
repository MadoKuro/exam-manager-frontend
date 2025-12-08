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
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../context/ThemeContext';

const drawerWidth = 280;

export default function TeacherLayout() {
    const { logout } = useAuth();
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', path: '/teacher/dashboard', icon: <DashboardIcon /> },
        { text: 'Profile', path: '/teacher/profile', icon: <PersonIcon /> },
        { text: 'Exam Requests', path: '/teacher/requests', icon: <EventNoteIcon /> },
        { text: 'Schedule', path: '/teacher/schedule', icon: <EventIcon /> },
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
                    color: '#064e3b' // Dark Emerald text
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '-0.5px' }}>
                        Teacher Dashboard
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
                        background: 'rgba(255, 255, 255, 0.65)', // Milky Glass
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
                        bgcolor: '#10b981', // Emerald
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.4)'
                    }}>
                        <Typography variant="h4" sx={{ color: 'white' }}>🎓</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#065f46', letterSpacing: '-0.5px' }}>
                        UniManager
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Teacher Portal
                    </Typography>
                </Toolbar>

                <Box sx={{ overflow: 'auto', px: 3, flexGrow: 1, mt: 1 }}>
                    <List>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        sx={{
                                            borderRadius: '16px',
                                            transition: 'all 0.3s ease',
                                            background: isActive ? '#10b981' : 'transparent', // Solid Emerald when active
                                            color: isActive ? 'white' : '#4b5563',
                                            boxShadow: isActive ? '0 8px 20px -5px rgba(16, 185, 129, 0.4)' : 'none',
                                            '&:hover': {
                                                background: isActive ? '#059669' : 'rgba(16, 185, 129, 0.08)',
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: isActive ? 'white' : '#10b981', minWidth: 44 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>

                {/* Bottom Section: Logout */}
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
                <Toolbar /> {/* Spacer */}
                <Box>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
